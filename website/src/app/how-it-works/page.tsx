import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How SetHear's daily phone companion works: sign up, receive a warm AI-powered call every day, and stay connected through reminders and family updates.",
};

const steps = [
  {
    step: "1",
    title: "Family signs up",
    body: "A family member registers their loved one: name, phone number, a preferred call time, an emergency contact, and any optional preferences like faith tradition for prayer.",
  },
  {
    step: "2",
    title: "SetHear calls, every day",
    body: "At the chosen time, a friendly AI voice calls to check in — how they're feeling, a bit of conversation, a reminder if one is due, a game or a prayer if they'd like.",
  },
  {
    step: "3",
    title: "Memories are saved by request",
    body: "If they mention where they keep something (“my glasses are on the kitchen table”), SetHear reads it back to confirm and remembers it — so they can ask again later.",
  },
  {
    step: "4",
    title: "Family stays in the loop",
    body: "If a scheduled call goes unanswered, family gets an email — never the conversation itself, which is discarded when the call ends. Stories your loved one chooses to share show up on the account too.",
  },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
        How SetHear works
      </h1>
      <p className="mt-4 text-center text-slate-600 max-w-2xl mx-auto">
        A simple, honest system: friendly conversation, gentle reminders, and
        a safety net for family — nothing that pretends to be a doctor or a
        crisis counselor.
      </p>

      <div className="mt-16 space-y-10">
        {steps.map((s) => (
          <div key={s.step} className="flex gap-6">
            <div className="flex-none flex h-12 w-12 items-center justify-center rounded-full bg-amber-600 text-lg font-bold text-white">
              {s.step}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {s.title}
              </h2>
              <p className="mt-1 text-slate-600">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 rounded-2xl border border-amber-200 bg-amber-50 p-8">
        <h2 className="text-xl font-semibold text-slate-900">
          What SetHear will never do
        </h2>
        <ul className="mt-4 space-y-2 text-slate-700 list-disc list-inside">
          <li>Give medical, mental health, or legal advice</li>
          <li>Diagnose memory loss, dementia, or any health condition</li>
          <li>Handle a medical emergency — it always redirects to 911</li>
          <li>Keep a transcript, or share the conversation itself with anyone — only stories your loved one chooses to share are saved</li>
          <li>Push a particular religion, or any religion at all, unprompted</li>
        </ul>
      </div>
    </div>
  );
}
