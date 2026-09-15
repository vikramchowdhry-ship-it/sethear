"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail, resetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

const TOKEN_DURATION_MS = 60 * 60 * 1000; // 1 hour

export async function forgotPasswordAction(
  _prevState: { done?: boolean } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  // Always report success either way — never reveal whether an account exists.
  if (!email) return { done: true };

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + TOKEN_DURATION_MS) },
    });

    const baseUrl = process.env.PUBLIC_BASE_URL || "";
    const { subject, html } = resetPasswordEmail(`${baseUrl}/reset-password?token=${token}`);
    await sendEmail({ to: email, subject, html }).catch((err) =>
      console.error("Failed to send password reset email:", err),
    );
  }

  return { done: true };
}
