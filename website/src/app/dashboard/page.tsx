import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { LANGUAGES, langOf } from "@/lib/i18n";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const senior = await prisma.seniorProfile.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      reminders: { orderBy: { scheduledTime: "asc" } },
      _count: { select: { familyMembers: true, stories: true } },
    },
  });

  if (!senior) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome to SetHear
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          You&apos;re logged in, but you haven&apos;t added a loved one yet.
          Sign one up to start their daily calls, family tree, and story
          collection.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-full bg-amber-600 px-8 py-3.5 text-lg font-semibold text-white hover:bg-amber-700 transition-colors"
        >
          Sign Up a Loved One
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
        Welcome back
      </h1>
      <p className="mt-2 text-lg text-slate-600">
        Here&apos;s how things stand for {senior.seniorName}.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="📞"
          label="Daily call time"
          value={formatTime(senior.preferredCallTime)}
        />
        <StatCard
          icon="⏰"
          label="Active reminders"
          value={String(senior.reminders.length)}
        />
        <StatCard
          icon="🌳"
          label="Family members"
          value={String(senior._count.familyMembers)}
        />
        <StatCard
          icon="📖"
          label="Stories collected"
          value={String(senior._count.stories)}
        />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {senior.seniorName}
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Phone number</dt>
              <dd className="font-medium text-slate-900">{senior.seniorPhone}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Emergency contact</dt>
              <dd className="font-medium text-slate-900">{senior.emergencyContact}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Call language</dt>
              <dd className="font-medium text-slate-900">
                {LANGUAGES[langOf(senior.language)].label}
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Faith preference</dt>
              <dd className="font-medium text-slate-900">
                {senior.faithPreference ? capitalize(senior.faithPreference) : "None set"}
              </dd>
            </div>
            <div className="flex justify-between pb-2">
              <dt className="text-slate-500">Your relationship</dt>
              <dd className="font-medium text-slate-900">{senior.relationship}</dd>
            </div>
          </dl>

          {senior.reminders.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                Reminders
              </h3>
              <ul className="mt-3 space-y-2">
                {senior.reminders.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2.5 text-sm"
                  >
                    <span className="text-slate-700">{r.description}</span>
                    <span className="font-medium text-slate-500">
                      {formatTime(r.scheduledTime)} &middot; {r.recurrence}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <DashboardLink
            href="/family-tree"
            icon="🌳"
            title="Family Tree"
            body="Add and view family members"
          />
          <DashboardLink
            href="/stories"
            icon="📖"
            title="Stories"
            body="Read or add life stories"
          />
          <DashboardLink
            href="/life-book"
            icon="📔"
            title="Life Book"
            body="Preview the compiled keepsake"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function DashboardLink({
  href,
  icon,
  title,
  body,
}: {
  href: string;
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-slate-200 p-5 transition-all hover:border-amber-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-500">{body}</p>
        </div>
      </div>
    </Link>
  );
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
