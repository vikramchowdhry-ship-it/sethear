import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, validateTwilioRequest } from "@/lib/twilio";
import { buildGreetingTwiml } from "@/lib/callFlow";

export async function POST(request: Request) {
  const params = await formDataToParams(request);
  if (!(await validateTwilioRequest(request, params))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const url = new URL(request.url);
  const seniorId = url.searchParams.get("seniorId") || "";

  const senior = await prisma.seniorProfile.findUnique({
    where: { id: seniorId },
    include: { reminders: { where: { recurrence: "daily" } } },
  });

  if (!senior) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`,
      { headers: { "Content-Type": "text/xml" } },
    );
  }

  const twiml = await buildGreetingTwiml(senior, params.CallSid || "");
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}
