export default function Pricing() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
        Pricing
      </h1>
      <p className="mt-4 text-slate-600">
        SetHear is currently in a free pilot. The plan below is what we&apos;re
        testing for a future paid version — sign up now and you won&apos;t be
        charged automatically when it launches; we&apos;ll ask first.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-8 text-left">
          <h2 className="text-lg font-semibold text-slate-900">Pilot (Free)</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">$0</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>1 senior profile</li>
            <li>Daily check-in call</li>
            <li>Medication &amp; appointment reminders</li>
            <li>Memory helper &amp; prayer on request</li>
            <li>Missed-call family alert by email</li>
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-8 text-left relative">
          <span className="absolute -top-3 right-6 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
            Planned — not yet billed
          </span>
          <h2 className="text-lg font-semibold text-slate-900">Family Plan</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            C$49<span className="text-base font-normal text-slate-500">/mo</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            A starting price we&apos;re testing, not a final offer.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>Everything in Pilot</li>
            <li>Up to 180 minutes of calls per month</li>
            <li>Multiple senior profiles per family</li>
            <li>Weekly summary (planned, not yet built)</li>
            <li>Priority support</li>
          </ul>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-500 max-w-xl mx-auto">
        We haven&apos;t built billing yet, so nothing is charged automatically —
        this page describes what we&apos;re planning to test, not a live offer.
        Final price, minute allowance, and terms may change before launch.
      </p>

      <p className="mt-6 text-sm text-slate-500">
        Want early access or a say in what the paid plan includes?{" "}
        <a href="/signup" className="text-amber-700 underline">
          Sign up now
        </a>{" "}
        and we&apos;ll keep you posted.
      </p>
    </div>
  );
}
