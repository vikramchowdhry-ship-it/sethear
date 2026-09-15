import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTwilioClient, twilioConfigured } from "@/lib/twilio";

// Matches reminders whose scheduledTime ("HH:MM") is within this many minutes
// of right now, so a cron that doesn't run exactly on the minute still catches them.
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

  // NOTE: scheduledTime is a plain "HH:MM" typed in by the family with no
  // timezone attached. This compares against server time (UTC on Vercel) —
  // a real deployment should ask each family for a timezone and convert.
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);

  const dueReminders = await prisma.reminder.findMany({
    where: { recurrence: "daily" },
    include: { senior: true },
  });

  const client = getTwilioClient();
  const baseUrl = process.env.PUBLIC_BASE_URL || "";
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
      });
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { lastSentAt: now },
      });
      results.push({ reminderId: reminder.id, status: "called" });
    } catch (err) {
      results.push({ reminderId: reminder.id, status: `error: ${(err as Error).message}` });
    }
  }

  return NextResponse.json({ checked: dueReminders.length, results });
}

function isWithinWindow(scheduledTime: string, now: Date) {
  const [h, m] = scheduledTime.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return false;

  const scheduled = new Date(now);
  scheduled.setHours(h, m, 0, 0);

  const diffMinutes = Math.abs(now.getTime() - scheduled.getTime()) / 60000;
  return diffMinutes <= MATCH_WINDOW_MINUTES;
}
