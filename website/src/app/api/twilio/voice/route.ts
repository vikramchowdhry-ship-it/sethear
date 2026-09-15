import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, normalizePhone, validateTwilioRequest } from "@/lib/twilio";

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
  <Say voice="Polly.Joanna">Hi there. I don't have a profile matched to this number yet. Please ask your family to sign up for you on the SetHear website. Goodbye for now.</Say>
  <Hangup/>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  }

  const reminderLines = senior.reminders
    .map((r) => `You also asked me to remind you: ${r.description}.`)
    .join(" ");

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Hello ${escapeXml(senior.seniorName)}, it's so good to hear from you. ${escapeXml(reminderLines)}</Say>
  <Gather input="speech" speechTimeout="auto" action="/api/twilio/voice/gather" method="POST">
    <Say voice="Polly.Joanna">Would you like to share a story today? Just say yes or no.</Say>
  </Gather>
  <Say voice="Polly.Joanna">I didn't catch that. We can try again next time. Take care.</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
