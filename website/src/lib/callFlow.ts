import { prisma } from "@/lib/prisma";
import { LANGUAGES, STRINGS, langOf } from "@/lib/i18n";
import { aiConfigured } from "@/lib/ai";

type SeniorWithReminders = {
  id: string;
  seniorName: string;
  language: string;
  reminders: { description: string }[];
};

/** Builds the opening TwiML for a call — used for both inbound calls and outbound daily check-ins. */
export async function buildGreetingTwiml(senior: SeniorWithReminders, callSid: string) {
  const lang = langOf(senior.language);
  const { sayVoice, sayLang, gatherLang } = LANGUAGES[lang];
  const t = STRINGS[lang];

  const reminderLines = senior.reminders.map((r) => t.reminderLine(r.description)).join(" ");
  const greeting = `${t.greeting(senior.seniorName)} ${reminderLines}`;
  const gatherLangAttr = gatherLang ? ` language="${gatherLang}"` : "";

  if (aiConfigured()) {
    await prisma.callSession.upsert({
      where: { callSid },
      create: { callSid, seniorId: senior.id, messages: [], turns: 0 },
      update: {},
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(greeting)}</Say>
  <Gather input="speech" speechTimeout="auto"${gatherLangAttr} action="/api/twilio/voice/converse?lang=${lang}" method="POST">
    <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.openCheckIn)}</Say>
  </Gather>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.noResponseFallback)}</Say>
  <Hangup/>
</Response>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(greeting)}</Say>
  <Gather input="dtmf speech" numDigits="1" speechTimeout="auto"${gatherLangAttr} action="/api/twilio/voice/gather?lang=${lang}" method="POST">
    <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.askStory)}</Say>
  </Gather>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.noResponseFallback)}</Say>
  <Hangup/>
</Response>`;
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
