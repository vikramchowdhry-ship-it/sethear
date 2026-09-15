import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formDataToParams, validateTwilioRequest } from "@/lib/twilio";

export async function POST(request: Request) {
  const params = await formDataToParams(request);
  if (!(await validateTwilioRequest(request, params))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const url = new URL(request.url);
  const seniorId = url.searchParams.get("seniorId") || "";
  const prompt = url.searchParams.get("prompt") || "A story shared by phone";
  const answer = params.TranscriptionText || "(Recording saved — transcription unavailable)";
  const recordingUrl = params.RecordingUrl || null;

  if (seniorId) {
    const senior = await prisma.seniorProfile.findUnique({ where: { id: seniorId } });
    if (senior) {
      await prisma.story.create({
        data: {
          seniorId,
          prompt,
          answer,
          recordingUrl,
          capturedVia: "phone",
        },
      });
    }
  }

  return new NextResponse("", { status: 200 });
}
