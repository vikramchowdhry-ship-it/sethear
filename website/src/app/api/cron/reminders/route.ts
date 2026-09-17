import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTwilioClient, twilioConfigured } from "@/lib/twilio";
import { localDateKeyInTz, scheduledInstant } from "@/lib/time";

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

  // scheduledTime/preferredCallTime are plain "HH:MM" in the senior's own
  // timezone (SeniorProfile.timezone). isWithinWindow/localDateKeyInTz convert
  // that to a real instant before comparing against server time (UTC).
  const now = new Date();
  const client = getTwilioClient();
  const baseUrl = process.env.PUBLIC_BASE_URL || "";

  const reminderResults = await sendDueReminders(client, baseUrl, now);
  const checkInResults = await sendDueCheckIns(client, baseUrl, now);
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
) {
  const dueReminders = await prisma.reminder.findMany({
    where: { recurrence: "daily" },
    include: { senior: true },
  });

  const results: { reminderId: string; status: string }[] = [];

  for (const reminder of dueReminders) {
    const tz = reminder.senior.timezone;
    if (!isWithinWindow(reminder.scheduledTime, tz, now)) continue;

    const todayKey = localDateKeyInTz(now, tz);
    const alreadySentToday =
      reminder.lastSentAt && localDateKeyInTz(reminder.lastSentAt, tz) === todayKey;
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
) {
  const seniors = await prisma.seniorProfile.findMany();
  const results: { seniorId: string; status: string }[] = [];

  for (const senior of seniors) {
    const tz = senior.timezone;
    if (!isWithinWindow(senior.preferredCallTime, tz, now)) continue;

    const todayKey = localDateKeyInTz(now, tz);
    const alreadyCalledToday =
      senior.lastCheckInAt && localDateKeyInTz(senior.lastCheckInAt, tz) === todayKey;
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

function isWithinWindow(scheduledTime: string, timeZone: string, now: Date) {
  const [h, m] = scheduledTime.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return false;

  const scheduled = scheduledInstant(scheduledTime, timeZone, now);
  const diffMinutes = Math.abs(now.getTime() - scheduled.getTime()) / 60000;
  return diffMinutes <= MATCH_WINDOW_MINUTES;
}
