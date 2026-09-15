import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, normalizePhone, validateTwilioRequest } from "@/lib/twilio";
import { STRINGS } from "@/lib/i18n";
import { buildGreetingTwiml } from "@/lib/callFlow";

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

  const twiml = await buildGreetingTwiml(senior, params.CallSid || "");
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
