import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { isValidTimeZone } from "@/lib/time";
import { LANGUAGES } from "@/lib/i18n";

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const body = await request.json();
  const {
    seniorId,
    seniorName,
    seniorPhone,
    preferredCallTime,
    timezone,
    language,
    faithPreference,
    emergencyContact,
    familyPhone,
    familyEmail,
    notes,
  } = body;

  if (typeof seniorId !== "string") {
    return NextResponse.json({ error: "Missing seniorId." }, { status: 400 });
  }

  const senior = await prisma.seniorProfile.findUnique({ where: { id: seniorId } });
  if (!senior || senior.userId !== userId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const data: Record<string, string | null> = {};
  if (typeof seniorName === "string" && seniorName.trim()) data.seniorName = seniorName.trim();
  if (typeof seniorPhone === "string" && seniorPhone.trim()) data.seniorPhone = seniorPhone.trim();
  if (typeof preferredCallTime === "string" && /^\d{2}:\d{2}$/.test(preferredCallTime)) {
    data.preferredCallTime = preferredCallTime;
  }
  if (typeof timezone === "string" && isValidTimeZone(timezone)) data.timezone = timezone;
  if (typeof language === "string" && language in LANGUAGES) data.language = language;
  if (faithPreference === null || typeof faithPreference === "string") {
    data.faithPreference = faithPreference || null;
  }
  if (typeof emergencyContact === "string" && emergencyContact.trim()) {
    data.emergencyContact = emergencyContact.trim();
  }
  if (typeof familyPhone === "string" && familyPhone.trim()) data.familyPhone = familyPhone.trim();
  if (typeof familyEmail === "string" && familyEmail.trim()) data.familyEmail = familyEmail.trim();
  if (typeof notes === "string") data.notes = notes || null;

  const updated = await prisma.seniorProfile.update({ where: { id: seniorId }, data });
  return NextResponse.json({ senior: updated });
}
