"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addStory(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) return;

  const seniorId = String(formData.get("seniorId") || "");
  const promptChoice = String(formData.get("promptChoice") || "").trim();
  const customPrompt = String(formData.get("customPrompt") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  const isPrivate = formData.get("isPrivate") === "on";
  const taggedIds = formData.getAll("taggedPeople").map(String);

  const prompt = customPrompt || promptChoice;
  if (!seniorId || !prompt || !answer) return;

  const senior = await prisma.seniorProfile.findFirst({ where: { id: seniorId, userId } });
  if (!senior) return;

  await prisma.story.create({
    data: {
      seniorId,
      prompt,
      answer,
      isPrivate,
      taggedPeople: {
        connect: taggedIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/stories");
  revalidatePath("/life-book");
}
