import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LifeBook() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const senior = await prisma.seniorProfile.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      stories: {
        where: { isPrivate: false },
        orderBy: { createdAt: "asc" },
        include: { taggedPeople: true },
      },
    },
  });

  if (!senior || senior.stories.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          The Life Book is empty so far
        </h1>
        <p className="mt-3 text-slate-600">
          As stories are saved, they&apos;ll be compiled here into a keepsake
          your family can revisit for years.
        </p>
        <Link
          href="/stories"
          className="mt-6 inline-block rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
        >
          Add the First Story
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf6] min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="text-center border-b-2 border-amber-200 pb-10">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-amber-700">
            The Life Book of
          </p>
          <h1 className="mt-3 font-serif text-4xl text-slate-900">
            {senior.seniorName}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {senior.stories.length} {senior.stories.length === 1 ? "story" : "stories"}, told in their own words
          </p>
        </div>

        <div className="mt-14 space-y-16">
          {senior.stories.map((s, i) => (
            <div key={s.id}>
              <p className="font-serif text-xs text-amber-700">
                Chapter {i + 1}
              </p>
              <h2 className="mt-1 font-serif text-2xl text-slate-900">
                {s.prompt}
              </h2>
              <p className="mt-4 font-serif text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                {s.answer}
              </p>
              {s.taggedPeople.length > 0 && (
                <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
                  Featuring {s.taggedPeople.map((p) => p.name).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 text-center border-t-2 border-amber-200 pt-10">
          <p className="font-serif text-slate-500 italic">
            To be continued, one call at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
