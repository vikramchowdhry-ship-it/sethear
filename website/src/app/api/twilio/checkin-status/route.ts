import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, validateTwilioRequest } from "@/lib/twilio";
import { sendEmail, missedCallEmail } from "@/lib/email";

const UNANSWERED_STATUSES = ["no-answer", "busy", "failed", "canceled"];

export async function POST(request: Request) {
  const params = await formDataToParams(request);
  if (!(await validateTwilioRequest(request, params))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const url = new URL(request.url);
  const seniorId = url.searchParams.get("seniorId") || "";
  const callStatus = params.CallStatus || "";

  if (seniorId && UNANSWERED_STATUSES.includes(callStatus)) {
    const senior = await prisma.seniorProfile.findUnique({ where: { id: seniorId } });
    if (senior) {
      const { subject, html } = missedCallEmail(senior.seniorName);
      await sendEmail({ to: senior.familyEmail, subject, html }).catch((err) =>
        console.error("Failed to send missed check-in call email:", err),
      );
    }
  }

  return new NextResponse("", { status: 200 });
}
