import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "About",
  description: "SetHear was founded by Khushi Chowdhary to help seniors feel less alone and keep family stories from being lost.",
};

export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="flex justify-center">
        <Logo size={56} />
      </div>
      <h1 className="mt-6 text-center text-3xl font-bold text-slate-900">
        About SetHear
      </h1>

      <div className="mt-10 space-y-5 text-slate-700 leading-relaxed">
        <p>
          SetHear was founded by <strong>Khushi Chowdhary</strong>, who
          started this project after seeing how much a short daily phone
          call can mean to an older person living alone — and how easily
          family stories and small everyday details get lost when no one is
          there to ask about them.
        </p>
        <p>
          The idea was simple: build something that calls, listens, and
          remembers — carefully, honestly, and without overstepping what
          technology should be trusted to do. SetHear never gives medical
          advice, never pretends to replace a real emergency response, and
          is upfront that it&apos;s an AI on the other end of the line, not a
          person.
        </p>
        <p>
          It&apos;s still an early, independent pilot — not a funded company —
          built and tested carefully, one feature at a time, with real calls
          and real safeguards rather than promises that outrun what&apos;s
          actually built.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-600">
        Questions, feedback, or want to help test SetHear?{" "}
        <a href="/contact" className="text-amber-700 underline">
          Get in touch
        </a>
        .
      </div>
    </div>
  );
}
