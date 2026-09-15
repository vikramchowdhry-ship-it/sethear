"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();

  if (!email || !password || password.length < 8) {
    return { error: "Please enter a valid email and a password of at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Try logging in instead." };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name || null },
  });

  await createSession(user.id);
  redirect("/signup");
}
