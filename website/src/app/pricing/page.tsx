import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "SetHear starts with a free 1-month trial, then $1.99/month. Financial assistance is available for families who need it.",
};

export default function Pricing() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
        Pricing
      </h1>
      <p className="mt-4 text-slate-600">
        Simple, honest pricing — try it free, and if it helps, stay for less
        than a cup of coffee a month.
      </p>

      <div className="mt-14 mx-auto max-w-sm rounded-2xl border-2 border-amber-300 bg-amber-50 p-8 text-left relative">
        <span className="absolute -top-3 right-6 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
          1 Month Free
        </span>
        <h2 className="text-lg font-semibold text-slate-900">SetHear</h2>
        <p className="mt-1 text-3xl font-bold text-slate-900">
          $1.99<span className="text-base font-normal text-slate-500">/month</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Free for the first month. Cancel anytime, no questions asked.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-slate-600">
          <li>1 senior profile</li>
          <li>Daily check-in call, in their language</li>
          <li>Medication &amp; appointment reminders</li>
          <li>Memory helper &amp; prayer on request</li>
          <li>Family tree &amp; story collection</li>
          <li>Missed-call family alert by email</li>
        </ul>
      </div>

      <div className="mt-12 mx-auto max-w-xl rounded-2xl border border-slate-200 p-6 text-left">
        <h2 className="font-semibold text-slate-900">Can&apos;t afford it right now?</h2>
        <p className="mt-2 text-sm text-slate-600">
          Money should never be the reason someone goes without a daily
          check-in. If $1.99/month isn&apos;t workable for your family, email{" "}
          <a href="/contact" className="text-amber-700 underline">
            contact@sethear.com
          </a>{" "}
          and ask — we set aside free 6-month subscriptions for households who
          request one. No forms, no proof of income required.
        </p>
      </div>

      <p className="mt-8 text-xs text-slate-500 max-w-xl mx-auto">
        We haven&apos;t built automated billing yet, so nothing is charged
        without us reaching out to set it up with you directly first.
      </p>
    </div>
  );
}
