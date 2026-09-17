import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

async function loadOwnedReminder(id: string, userId: string) {
  const reminder = await prisma.reminder.findUnique({
    where: { id },
    include: { senior: true },
  });
  if (!reminder || reminder.senior.userId !== userId) return null;
  return reminder;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { id } = await params;
  const reminder = await loadOwnedReminder(id, userId);
  if (!reminder) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json();
  const data: Record<string, string> = {};
  if (typeof body.description === "string" && body.description.trim()) {
    data.description = body.description.trim();
  }
  if (typeof body.scheduledTime === "string" && /^\d{2}:\d{2}$/.test(body.scheduledTime)) {
    data.scheduledTime = body.scheduledTime;
  }
  if (typeof body.recurrence === "string" && body.recurrence) data.recurrence = body.recurrence;
  if (typeof body.type === "string" && body.type) data.type = body.type;

  const updated = await prisma.reminder.update({ where: { id }, data });
  return NextResponse.json({ reminder: updated });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { id } = await params;
  const reminder = await loadOwnedReminder(id, userId);
  if (!reminder) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.reminder.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
