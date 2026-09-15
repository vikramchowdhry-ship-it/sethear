import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTwilioClient, twilioConfigured } from "@/lib/twilio";

// Matches scheduled times ("HH:MM") within this many minutes of right now,
// so a cron that doesn't run exactly on the minute still catches them.
const MATCH_WINDOW_MINUTES = 15;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!twilioConfigured()) {
    return NextResponse.json({ skipped: true, reason: "Twilio not configured yet" });
  }

  // NOTE: scheduledTime/preferredCallTime are plain "HH:MM" with no timezone
  // attached, compared against server time (UTC on Vercel) — a real deployment
  // should ask each family for a timezone and convert.
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const client = getTwilioClient();
  const baseUrl = process.env.PUBLIC_BASE_URL || "";

  const reminderResults = await sendDueReminders(client, baseUrl, now, todayKey);
  const checkInResults = await sendDueCheckIns(client, baseUrl, now, todayKey);
  const staleSessionsDeleted = await deleteStaleCallSessions();

  return NextResponse.json({
    reminders: reminderResults,
    checkIns: checkInResults,
    staleSessionsDeleted,
  });
}

/**
 * Call transcripts are meant to be deleted the moment a call ends (see the
 * converse route), but a call that times out or gets hung up mid-conversation
 * never hits that code path. This is the backstop: no real call lasts
 * anywhere near an hour, so anything older than that is stale and gets
 * cleaned up here rather than lingering in the database indefinitely.
 */
async function deleteStaleCallSessions() {
  const cutoff = new Date(Date.now() - 60 * 60 * 1000);
  const result = await prisma.callSession.deleteMany({
    where: { updatedAt: { lt: cutoff } },
  });
  return result.count;
}

async function sendDueReminders(
  client: ReturnType<typeof getTwilioClient>,
  baseUrl: string,
  now: Date,
  todayKey: string,
) {
  const dueReminders = await prisma.reminder.findMany({
    where: { recurrence: "daily" },
    include: { senior: true },
  });

  const results: { reminderId: string; status: string }[] = [];

  for (const reminder of dueReminders) {
    if (!isWithinWindow(reminder.scheduledTime, now)) continue;

    const alreadySentToday =
      reminder.lastSentAt && reminder.lastSentAt.toISOString().slice(0, 10) === todayKey;
    if (alreadySentToday) continue;

    try {
      await client.calls.create({
        to: reminder.senior.seniorPhone,
        from: process.env.TWILIO_PHONE_NUMBER!,
        url: `${baseUrl}/api/twilio/reminder-twiml?reminderId=${reminder.id}`,
        statusCallback: `${baseUrl}/api/twilio/reminder-status?reminderId=${reminder.id}`,
        statusCallbackEvent: ["completed"],
        statusCallbackMethod: "POST",
      });
      await prisma.reminder.update({ where: { id: reminder.id }, data: { lastSentAt: now } });
      results.push({ reminderId: reminder.id, status: "called" });
    } catch (err) {
      results.push({ reminderId: reminder.id, status: `error: ${(err as Error).message}` });
    }
  }

  return { checked: dueReminders.length, results };
}

async function sendDueCheckIns(
  client: ReturnType<typeof getTwilioClient>,
  baseUrl: string,
  now: Date,
  todayKey: string,
) {
  const seniors = await prisma.seniorProfile.findMany();
  const results: { seniorId: string; status: string }[] = [];

  for (const senior of seniors) {
    if (!isWithinWindow(senior.preferredCallTime, now)) continue;

    const alreadyCalledToday =
      senior.lastCheckInAt && senior.lastCheckInAt.toISOString().slice(0, 10) === todayKey;
    if (alreadyCalledToday) continue;

    try {
      await client.calls.create({
        to: senior.seniorPhone,
        from: process.env.TWILIO_PHONE_NUMBER!,
        url: `${baseUrl}/api/twilio/checkin-twiml?seniorId=${senior.id}`,
        statusCallback: `${baseUrl}/api/twilio/checkin-status?seniorId=${senior.id}`,
        statusCallbackEvent: ["completed"],
        statusCallbackMethod: "POST",
      });
      await prisma.seniorProfile.update({ where: { id: senior.id }, data: { lastCheckInAt: now } });
      results.push({ seniorId: senior.id, status: "called" });
    } catch (err) {
      results.push({ seniorId: senior.id, status: `error: ${(err as Error).message}` });
    }
  }

  return { checked: seniors.length, results };
}

function isWithinWindow(scheduledTime: string, now: Date) {
  const [h, m] = scheduledTime.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return false;

  const scheduled = new Date(now);
  scheduled.setHours(h, m, 0, 0);

  const diffMinutes = Math.abs(now.getTime() - scheduled.getTime()) / 60000;
  return diffMinutes <= MATCH_WINDOW_MINUTES;
}
