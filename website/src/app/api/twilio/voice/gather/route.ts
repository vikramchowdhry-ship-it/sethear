import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, normalizePhone, validateTwilioRequest } from "@/lib/twilio";
import { LANGUAGES, STRINGS, detectYes, pickPrompt, langOf } from "@/lib/i18n";

export async function POST(request: Request) {
  const params = await formDataToParams(request);
  if (!(await validateTwilioRequest(request, params))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const url = new URL(request.url);
  const lang = langOf(url.searchParams.get("lang"));
  const { sayVoice, sayLang } = LANGUAGES[lang];
  const t = STRINGS[lang];

  const speech = params.SpeechResult || "";
  const digits = params.Digits || "";
  const isYes = detectYes(lang, digits, speech) === true;

  if (!isYes) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.noThanks)}</Say>
  <Hangup/>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  const from = params.From || "";
  const last10 = normalizePhone(from);
  const allSeniors = await prisma.seniorProfile.findMany();
  const matched = allSeniors.find((s) => normalizePhone(s.seniorPhone) === last10);

  const prompt = pickPrompt(lang);
  const promptParam = encodeURIComponent(prompt.question);
  const seniorIdParam = encodeURIComponent(matched?.id || "");

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.yesIntro(prompt.question))}</Say>
  <Record action="/api/twilio/voice/recording?seniorId=${seniorIdParam}&amp;prompt=${promptParam}&amp;lang=${lang}" transcribe="true" transcribeCallback="/api/twilio/voice/transcription?seniorId=${seniorIdParam}&amp;prompt=${promptParam}" maxLength="180" playBeep="true" />
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
