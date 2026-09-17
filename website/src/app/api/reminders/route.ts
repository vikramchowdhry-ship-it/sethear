import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const body = await request.json();
  const { seniorId, type, description, scheduledTime, recurrence } = body;

  if (
    typeof seniorId !== "string" ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof scheduledTime !== "string" ||
    !/^\d{2}:\d{2}$/.test(scheduledTime) ||
    typeof recurrence !== "string"
  ) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const senior = await prisma.seniorProfile.findUnique({ where: { id: seniorId } });
  if (!senior || senior.userId !== userId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const reminder = await prisma.reminder.create({
    data: {
      seniorId,
      type: typeof type === "string" && type ? type : "other",
      description: description.trim(),
      scheduledTime,
      recurrence,
    },
  });

  return NextResponse.json({ reminder }, { status: 201 });
}
