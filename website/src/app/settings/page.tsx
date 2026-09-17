import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
  description: "Change the daily call time, time zone, and reminders for your loved one.",
};

export default async function Settings() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/settings");

  const senior = await prisma.seniorProfile.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { reminders: { orderBy: { scheduledTime: "asc" } } },
  });

  if (!senior) redirect("/signup");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
      <p className="mt-2 text-slate-600">
        Change {senior.seniorName}&apos;s call time, time zone, or reminders anytime.
      </p>

      <SettingsForm senior={senior} reminders={senior.reminders} />
    </div>
  );
}
