"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function resetPasswordAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  const valid = resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date();

  if (!valid) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } }),
  ]);

  await createSession(resetToken.userId);
  redirect("/dashboard");
}
