import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { sendEmail, signupConfirmationEmail } from "@/lib/email";
import { LANGUAGES } from "@/lib/i18n";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const body = await request.json();

  const {
    seniorName,
    seniorPhone,
    preferredCallTime,
    language,
    faithPreference,
    familyName,
    familyPhone,
    familyEmail,
    relationship,
    emergencyContact,
    notes,
    consentGiven,
    reminders,
  } = body;

  const required = {
    seniorName,
    seniorPhone,
    preferredCallTime,
    familyName,
    familyPhone,
    familyEmail,
    relationship,
    emergencyContact,
  };

  for (const [key, value] of Object.entries(required)) {
    if (!value || typeof value !== "string" || !value.trim()) {
      return NextResponse.json(
        { error: `Missing required field: ${key}` },
        { status: 400 },
      );
    }
  }

  if (!consentGiven) {
    return NextResponse.json(
      { error: "Consent from the senior (or their authorized representative) is required." },
      { status: 400 },
    );
  }

  const profile = await prisma.seniorProfile.create({
    data: {
      userId,
      seniorName,
      seniorPhone,
      preferredCallTime,
      language: language && language in LANGUAGES ? language : "en",
      faithPreference: faithPreference || null,
      familyName,
      familyPhone,
      familyEmail,
      relationship,
      emergencyContact,
      notes: notes || null,
      consentGiven: true,
      reminders: {
        create: Array.isArray(reminders)
          ? reminders
              .filter((r: { description?: string }) => r?.description?.trim())
              .map((r: { type: string; description: string; scheduledTime: string; recurrence: string }) => ({
                type: r.type,
                description: r.description,
                scheduledTime: r.scheduledTime,
                recurrence: r.recurrence,
              }))
          : [],
      },
    },
  });

  const { subject, html } = signupConfirmationEmail(seniorName, preferredCallTime);
  await sendEmail({ to: familyEmail, subject, html }).catch((err) =>
    console.error("Failed to send signup confirmation email:", err),
  );

  return NextResponse.json({ id: profile.id }, { status: 201 });
}
