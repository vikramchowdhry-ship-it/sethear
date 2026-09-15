import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, validateTwilioRequest } from "@/lib/twilio";
import { LANGUAGES, STRINGS, langOf } from "@/lib/i18n";
import { converse } from "@/lib/ai";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const params = await formDataToParams(request);
  if (!(await validateTwilioRequest(request, params))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const url = new URL(request.url);
  const lang = langOf(url.searchParams.get("lang"));
  const { sayVoice, sayLang, gatherLang } = LANGUAGES[lang];
  const t = STRINGS[lang];
  const gatherLangAttr = gatherLang ? ` language="${gatherLang}"` : "";

  const callSid = params.CallSid || "";
  const userSpeech = (params.SpeechResult || "").trim();

  const session = await prisma.callSession.findUnique({
    where: { callSid },
    include: {
      senior: {
        include: {
          reminders: { where: { recurrence: "daily" } },
          memoryItems: true,
        },
      },
    },
  });

  if (!session) {
    // Shouldn't normally happen — session is created in /voice. Bail out gracefully.
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.noResponseFallback)}</Say>
  <Hangup/>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  const history = (session.messages as unknown as ChatMessage[]) || [];
  if (userSpeech) {
    history.push({ role: "user", content: userSpeech });
  }

  const remindersRead = session.senior.reminders.map((r) => r.description);
  const memories = session.senior.memoryItems.map((m) => ({ item: m.item, location: m.location }));

  const result = await converse(
    history,
    session.senior.seniorName,
    lang,
    remindersRead,
    memories,
    session.turns,
  );

  if (result.reply) {
    history.push({ role: "assistant", content: result.reply });
  }

  if (result.savedStory) {
    await prisma.story.create({
      data: {
        seniorId: session.seniorId,
        prompt: result.savedStory.prompt,
        answer: result.savedStory.answer,
        capturedVia: "phone",
      },
    });
  }

  if (result.savedMemory) {
    const existing = session.senior.memoryItems.find(
      (m) => m.item.toLowerCase() === result.savedMemory!.item.toLowerCase(),
    );
    if (existing) {
      await prisma.memoryItem.update({
        where: { id: existing.id },
        data: { location: result.savedMemory.location },
      });
    } else {
      await prisma.memoryItem.create({
        data: {
          seniorId: session.seniorId,
          item: result.savedMemory.item,
          location: result.savedMemory.location,
        },
      });
    }
  }

  const callEnding = result.emergency || result.endCall || !result.reply;

  if (callEnding) {
    // The conversation is over — we only ever kept the transcript to give
    // the AI context mid-call. Delete it now rather than storing it forever.
    await prisma.callSession.delete({ where: { callSid } }).catch(() => {});
  } else {
    await prisma.callSession.update({
      where: { callSid },
      data: { messages: history, turns: session.turns + 1 },
    });
  }

  if (result.emergency) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(result.reply)}</Say>
  <Hangup/>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  if (result.endCall || !result.reply) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${result.reply ? `<Say voice="${sayVoice}" language="${sayLang}">${escapeXml(result.reply)}</Say>` : ""}
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.reminderGoodbye)}</Say>
  <Hangup/>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" speechTimeout="auto"${gatherLangAttr} action="/api/twilio/voice/converse?lang=${lang}" method="POST">
    <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(result.reply)}</Say>
  </Gather>
  <Say voice="${sayVoice}" language="${sayLang}">${escapeXml(t.reminderGoodbye)}</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
