import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: "Reach SetHear for support, to stop calls, delete your data, or request financial assistance.",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-bold text-slate-900">Contact &amp; Support</h1>
      <p className="mt-4 text-slate-600">
        Email us anytime at{" "}
        <a href="mailto:contact@sethear.com" className="text-amber-700 underline">
          contact@sethear.com
        </a>
        . This is a small, founder-run pilot — we don&apos;t have staffed 24/7
        support, but we read and respond to every message.
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">Stop calls or delete your data</h2>
          <p className="mt-2 text-sm text-slate-600">
            Email us with the account or phone number and what you&apos;d like
            done — pause calls, cancel, or delete all stored information. We
            confirm every request before acting on it.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">If you&apos;re the participant, not the payer</h2>
          <p className="mt-2 text-sm text-slate-600">
            You don&apos;t need to go through whoever signed you up. Email us
            directly, or say so on a call, and we&apos;ll follow up.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">Something urgent?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Email isn&apos;t monitored in real time. For anything urgent involving
            a person&apos;s safety, call 911 (or your local emergency number)
            directly — don&apos;t wait on a reply from us.
          </p>
        </div>
      </div>
    </div>
  );
}
