export default function Pricing() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
        Pricing
      </h1>
      <p className="mt-4 text-slate-600">
        SetHear is currently in a free pilot while we refine the
        service. Subscription plans are coming soon.
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
            <li>Missed-call family alert</li>
          </ul>
        </div>
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-8 text-left relative">
          <span className="absolute -top-3 right-6 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
            Coming Soon
          </span>
          <h2 className="text-lg font-semibold text-slate-900">Family Plan</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">TBD / mo</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>Everything in Pilot</li>
            <li>Multiple senior profiles per family</li>
            <li>Weekly well-being summary</li>
            <li>Priority support</li>
          </ul>
        </div>
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Want early access or a say in what the paid plan includes?{" "}
        <a href="/signup" className="text-amber-700 underline">
          Sign up now
        </a>{" "}
        and we&apos;ll keep you posted.
      </p>
    </div>
  );
}
