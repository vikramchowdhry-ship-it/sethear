import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LANGUAGES, STRINGS, langOf } from "@/lib/i18n";

export async function POST(request: Request) {
  return handle(request);
}
export async function GET(request: Request) {
  return handle(request);
}

async function handle(request: Request) {
  const url = new URL(request.url);
  const reminderId = url.searchParams.get("reminderId") || "";

  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
    include: { senior: true },
  });

  const lang = langOf(reminder?.senior.language);
  const { sayVoice, sayLang } = LANGUAGES[lang];
  const t = STRINGS[lang];

  const message = reminder
    ? t.reminderGreeting(reminder.senior.seniorName, reminder.description)
    : "Hello, this was a reminder call, but the details couldn't be found.";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(message)}</Say>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.reminderGoodbye)}</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
