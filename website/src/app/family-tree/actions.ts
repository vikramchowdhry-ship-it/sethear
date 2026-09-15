"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addFamilyMember(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) return;

  const seniorId = String(formData.get("seniorId") || "");
  const name = String(formData.get("name") || "").trim();
  const relationship = String(formData.get("relationship") || "").trim();
  const birthYearRaw = String(formData.get("birthYear") || "").trim();
  const deathYearRaw = String(formData.get("deathYear") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  if (!seniorId || !name || !relationship) return;

  const senior = await prisma.seniorProfile.findFirst({ where: { id: seniorId, userId } });
  if (!senior) return;

  await prisma.familyMember.create({
    data: {
      seniorId,
      name,
      relationship,
      birthYear: birthYearRaw ? Number(birthYearRaw) : null,
      deathYear: deathYearRaw ? Number(deathYearRaw) : null,
      bio: bio || null,
    },
  });

  revalidatePath("/family-tree");
  revalidatePath("/stories");
}
