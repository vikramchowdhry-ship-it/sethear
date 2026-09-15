"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "./actions";

export default function ForgotPassword() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, undefined);

  if (state?.done) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
        <p className="mt-3 text-slate-600">
          If an account exists for that email, we&apos;ve sent a link to reset your password. It works for 1 hour.
        </p>
        <Link href="/login" className="mt-6 inline-block text-amber-700 underline">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold text-slate-900">Reset your password</h1>
      <p className="mt-2 text-slate-600">
        Enter your account email and we&apos;ll send you a reset link.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        <Link href="/login" className="text-amber-700 underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
