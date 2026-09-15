import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about SetHear: privacy, recording, the memory helper, emergencies, languages, and how to stop or delete your data.",
};

const faqs = [
  {
    q: "Is this a medical device or a health monitoring service?",
    a: "No. SetHear is a companionship, reminder, and conversation service. It does not diagnose, monitor, or treat any medical or cognitive condition, and it should never be relied on as someone's only safety check-in.",
  },
  {
    q: "What happens if my loved one mentions a fall or a medical emergency?",
    a: "SetHear is designed to respond the same way every time: it tells the caller to hang up and call 911 immediately, and it does not attempt to assess or advise on the situation itself.",
  },
  {
    q: "Are calls recorded?",
    a: "No. SetHear does not record calls. We keep only what's needed to provide the service: contact info, reminder details, and anything the caller explicitly asks us to remember (like where they keep their glasses).",
  },
  {
    q: "Who can hear what my loved one says on a call?",
    a: "No one hears the raw call, and we don't keep a transcript — the conversation itself is discarded as soon as the call ends. The one exception: if your loved one shares a story during a call, that specific story (not the surrounding conversation) is saved and visible on the account, unless they mark it private. Family also gets an email if a scheduled call goes unanswered.",
  },
  {
    q: "How does the “where did I put it” memory feature work?",
    a: "When someone tells SetHear where they keep something, it reads the item and location back to confirm before saving it. Later, they can ask where it is and get back exactly what they said — never a guess. If nothing was saved, it says so honestly instead of making something up.",
  },
  {
    q: "Is the memory data safe?",
    a: "Yes — it's treated as sensitive data and stored encrypted. It's also only ever shared back with the exact phone number that recorded it, so no one else can call in and ask about someone else's belongings.",
  },
  {
    q: "Can my loved one opt out or stop service anytime?",
    a: "Yes, at any time, by asking during a call or by emailing us. All stored information is deleted on request.",
  },
  {
    q: "Can multiple family members see the account?",
    a: "Right now, one login per family sees everything on that account. We don't yet support giving different relatives different levels of access — if that matters to you, let us know.",
  },
  {
    q: "Does it push religion on people?",
    a: "Never unprompted. Prayer is entirely opt-in, chosen once at sign-up (or skipped entirely), and drawn only from public-domain texts of the tradition selected.",
  },
];

export default function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
        Frequently Asked Questions
      </h1>
      <div className="mt-14 space-y-8">
        {faqs.map((f) => (
          <div key={f.q} className="border-b border-slate-100 pb-8">
            <h2 className="font-semibold text-slate-900">{f.q}</h2>
            <p className="mt-2 text-slate-600">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
