import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  return handle(request);
}
export async function GET(request: Request) {
  return handle(request);
}

async function handle(request: Request) {
  const url = new URL(request.url);
  const reminderId = url.searchParams.get("reminderId") || "";

  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
    include: { senior: true },
  });

  const message = reminder
    ? `Hello ${escapeXml(reminder.senior.seniorName)}, this is your reminder: ${escapeXml(reminder.description)}.`
    : "Hello, this was a reminder call, but the details couldn't be found.";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${message}</Say>
  <Say voice="Polly.Joanna">That's all for now. Goodbye.</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
