import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, normalizePhone, validateTwilioRequest } from "@/lib/twilio";
import { storyPrompts } from "@/lib/storyPrompts";

export async function POST(request: Request) {
  const params = await formDataToParams(request);
  if (!(await validateTwilioRequest(request, params))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const speech = (params.SpeechResult || "").toLowerCase();
  const saidYes = /\byes\b|yeah|sure|okay|ok\b/.test(speech);

  if (!saidYes) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">No problem. Talk again soon. Goodbye.</Say>
  <Hangup/>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  const from = params.From || "";
  const last10 = normalizePhone(from);
  const allSeniors = await prisma.seniorProfile.findMany();
  const matched = allSeniors.find((s) => normalizePhone(s.seniorPhone) === last10);

  const prompt = storyPrompts[Math.floor(Math.random() * storyPrompts.length)];
  const promptParam = encodeURIComponent(prompt.question);
  const seniorIdParam = encodeURIComponent(matched?.id || "");

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Wonderful. Here's today's question: ${escapeXml(prompt.question)} Tell me all about it after the beep, and just hang up or stay quiet for a few seconds when you're done.</Say>
  <Record action="/api/twilio/voice/recording?seniorId=${seniorIdParam}&amp;prompt=${promptParam}" transcribe="true" transcribeCallback="/api/twilio/voice/transcription?seniorId=${seniorIdParam}&amp;prompt=${promptParam}" maxLength="180" playBeep="true" />
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
