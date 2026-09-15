import { prisma } from "@/lib/prisma";
import { addFamilyMember } from "./actions";
import { getSessionUserId } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const groupOrder = ["Spouse", "Parent", "Sibling", "Child", "Grandchild", "Other"];

export default async function FamilyTree() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const senior = await prisma.seniorProfile.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { familyMembers: { orderBy: { createdAt: "asc" } } },
  });

  if (!senior) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          No profile yet
        </h1>
        <p className="mt-3 text-slate-600">
          Sign up a loved one first, then come back to start building their
          family tree.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
        >
          Sign Up a Loved One
        </Link>
      </div>
    );
  }

  const grouped = groupOrder
    .map((group) => ({
      group,
      members: senior.familyMembers.filter((m) => m.relationship === group),
    }))
    .filter((g) => g.members.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">
        {senior.seniorName}&apos;s Family Tree
      </h1>
      <p className="mt-2 text-slate-600">
        The people whose stories get passed down. Tag them in{" "}
        <Link href="/stories" className="text-amber-700 underline">
          stories
        </Link>{" "}
        as they come up.
      </p>

      <div className="mt-12 space-y-10">
        {grouped.length === 0 && (
          <p className="text-slate-500 italic">
            No family members added yet — start below.
          </p>
        )}
        {grouped.map(({ group, members }) => (
          <div key={group}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
              {group}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="font-semibold text-slate-900">
                    {m.name}
                    {(m.birthYear || m.deathYear) && (
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        ({m.birthYear ?? "?"}
                        {m.deathYear ? `–${m.deathYear}` : ""})
                      </span>
                    )}
                  </p>
                  {m.bio && (
                    <p className="mt-1 text-sm text-slate-600">{m.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Add a family member
        </h2>
        <form action={addFamilyMember} className="mt-4 space-y-4">
          <input type="hidden" name="seniorId" value={senior.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input name="name" required className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Relationship
              <select name="relationship" required className={inputClass}>
                <option value="">Select...</option>
                {groupOrder.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Birth year
              <input
                name="birthYear"
                type="number"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Death year (if applicable)
              <input
                name="deathYear"
                type="number"
                className={inputClass}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Short bio
            <textarea name="bio" rows={2} className={inputClass} />
          </label>
          <button
            type="submit"
            className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Add to Family Tree
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
