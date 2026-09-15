import { NextResponse } from "next/server";
import { formDataToParams, validateTwilioRequest } from "@/lib/twilio";
import { LANGUAGES, STRINGS, langOf } from "@/lib/i18n";

export async function POST(request: Request) {
  const params = await formDataToParams(request);
  if (!(await validateTwilioRequest(request, params))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const url = new URL(request.url);
  const lang = langOf(url.searchParams.get("lang"));
  const { sayVoice, sayLang } = LANGUAGES[lang];

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(STRINGS[lang].thankYouRecording)}</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
