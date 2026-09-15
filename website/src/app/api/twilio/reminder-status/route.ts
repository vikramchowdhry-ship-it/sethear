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
  const reminderId = url.searchParams.get("reminderId") || "";
  const callStatus = params.CallStatus || "";

  if (reminderId && UNANSWERED_STATUSES.includes(callStatus)) {
    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
      include: { senior: true },
    });

    if (reminder) {
      const { subject, html } = missedCallEmail(reminder.senior.seniorName);
      await sendEmail({ to: reminder.senior.familyEmail, subject, html }).catch(
        (err) => console.error("Failed to send missed-call email:", err),
      );
    }
  }

  return new NextResponse("", { status: 200 });
}
