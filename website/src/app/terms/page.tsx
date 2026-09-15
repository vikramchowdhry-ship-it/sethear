import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using SetHear's AI phone companion service.",
};

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 prose prose-slate">
      <h1>Terms of Use</h1>
      <p className="text-sm text-slate-500">
        This describes the actual pilot service, not a finished commercial
        offer. It will be reviewed by a lawyer before any paid public launch.
      </p>

      <h2>What this service is</h2>
      <p>
        SetHear provides an AI phone companion — daily check-in calls,
        medication/appointment reminders, an optional memory helper, and
        optional story collection. It is intended to reduce loneliness and
        give families peace of mind — nothing more.
      </p>

      <h2>What this service is not</h2>
      <ul>
        <li>Not a medical device, diagnostic tool, or health monitor</li>
        <li>Not a crisis line or emergency response service</li>
        <li>Not a substitute for professional medical, mental health, or legal advice</li>
        <li>
          Not a guaranteed safety system — calls and notifications can be
          delayed or fail; keep your usual family contact and emergency
          arrangements in place regardless
        </li>
      </ul>

      <h2>What we can&apos;t promise yet</h2>
      <p>
        This is an early, unfunded pilot. We do our best to deliver calls and
        notifications reliably, but we can&apos;t guarantee 24/7 uptime, staffed
        support, or that every call attempt succeeds. If a scheduled call
        isn&apos;t answered, we email the account holder — but the absence of
        that email is not a guarantee that everything is fine, only that we
        haven&apos;t detected a problem.
      </p>

      <h2>Emergencies</h2>
      <p>
        In any emergency, call 911 (or your local emergency number)
        immediately. If the AI conversation detects language suggesting
        self-harm or a medical emergency, it gives a fixed instruction to
        call 911 or contact the 988 Suicide &amp; Crisis Lifeline — it does not
        attempt to assess, diagnose, or handle the situation itself, and no
        human is monitoring calls in real time.
      </p>

      <h2>AI disclosure</h2>
      <p>
        Calls are answered by an AI, not a human. We aim to make that clear
        at the start of every call. The AI does not have memory of anything
        beyond what&apos;s explicitly saved as a reminder, memory item, or
        story — it does not retain a full relationship history between calls.
      </p>

      <h2>Cancellation and deletion</h2>
      <p>
        You may pause calls, cancel, or request deletion of all stored data
        at any time by emailing <a href="/contact">contact@sethear.com</a>.
        There is no paid billing yet, so there is nothing to refund — the
        pilot is currently free.
      </p>
    </div>
  );
}
