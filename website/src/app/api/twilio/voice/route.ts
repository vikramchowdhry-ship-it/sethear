import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, normalizePhone, validateTwilioRequest } from "@/lib/twilio";
import { LANGUAGES, STRINGS, langOf } from "@/lib/i18n";

export async function POST(request: Request) {
  const params = await formDataToParams(request);
  if (!(await validateTwilioRequest(request, params))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const from = params.From || "";
  const last10 = normalizePhone(from);

  const seniors = await prisma.seniorProfile.findMany({
    include: { reminders: { where: { recurrence: "daily" } } },
  });
  const senior = seniors.find((s) => normalizePhone(s.seniorPhone) === last10);

  if (!senior) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${escapeXml(STRINGS.en.unrecognizedCaller)}</Say>
  <Hangup/>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  const lang = langOf(senior.language);
  const { sayVoice, sayLang, gatherLang } = LANGUAGES[lang];
  const t = STRINGS[lang];

  const reminderLines = senior.reminders.map((r) => t.reminderLine(r.description)).join(" ");
  const greeting = `${t.greeting(senior.seniorName)} ${reminderLines}`;

  const gatherLangAttr = gatherLang ? ` language="${gatherLang}"` : "";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(greeting)}</Say>
  <Gather input="dtmf speech" numDigits="1" speechTimeout="auto"${gatherLangAttr} action="/api/twilio/voice/gather?lang=${lang}" method="POST">
    <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.askStory)}</Say>
  </Gather>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.noResponseFallback)}</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
