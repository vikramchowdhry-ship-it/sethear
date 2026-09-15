import { prisma } from "@/lib/prisma";
import { addStory } from "./actions";
import { storyPrompts } from "@/lib/storyPrompts";
import { getSessionUserId } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Stories() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const senior = await prisma.seniorProfile.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      familyMembers: { orderBy: { createdAt: "asc" } },
      stories: {
        orderBy: { createdAt: "desc" },
        include: { taggedPeople: true },
      },
    },
  });

  if (!senior) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No profile yet</h1>
        <p className="mt-3 text-slate-600">
          Sign up a loved one first, then come back to start collecting
          their stories.
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-baseline justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-slate-900">
          {senior.seniorName}&apos;s Stories
        </h1>
        <Link href="/life-book" className="text-sm font-medium text-amber-700 underline">
          Preview the Life Book &rarr;
        </Link>
      </div>
      <p className="mt-2 text-slate-600">
        A growing collection of memories, in their own words, for the next
        generation.
      </p>

      <div className="mt-10 space-y-6">
        {senior.stories.length === 0 && (
          <p className="text-slate-500 italic">No stories saved yet — add the first one below.</p>
        )}
        {senior.stories.map((s) => (
          <div key={s.id} className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-slate-900">{s.prompt}</p>
              {s.isPrivate && (
                <span className="flex-none rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                  Private
                </span>
              )}
            </div>
            <p className="mt-2 text-slate-700 whitespace-pre-wrap">{s.answer}</p>
            {s.taggedPeople.length > 0 && (
              <p className="mt-3 text-xs text-slate-500">
                About: {s.taggedPeople.map((p) => p.name).join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Add a story</h2>
        <form action={addStory} className="mt-4 space-y-4">
          <input type="hidden" name="seniorId" value={senior.id} />

          <label className="block text-sm font-medium text-slate-700">
            Choose a prompt
            <select name="promptChoice" className={inputClass} defaultValue="">
              <option value="">— pick one —</option>
              {storyPrompts.map((p) => (
                <option key={p.question} value={p.question}>
                  [{p.theme}] {p.question}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            ...or write your own question
            <input name="customPrompt" className={inputClass} placeholder="e.g. What was our old house like?" />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            The story
            <textarea name="answer" required rows={5} className={inputClass} />
          </label>

          {senior.familyMembers.length > 0 && (
            <fieldset>
              <legend className="text-sm font-medium text-slate-700">
                Who is this story about?
              </legend>
              <div className="mt-2 flex flex-wrap gap-3">
                {senior.familyMembers.map((m) => (
                  <label key={m.id} className="flex items-center gap-1.5 text-sm text-slate-600">
                    <input type="checkbox" name="taggedPeople" value={m.id} />
                    {m.name}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isPrivate" />
            Keep this one private, just between us
          </label>

          <button
            type="submit"
            className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Save Story
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
