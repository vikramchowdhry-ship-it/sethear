"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold text-slate-900">Log in</h1>

      <form action={formAction} className="mt-8 space-y-4">
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input name="email" type="email" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input name="password" type="password" required className={inputClass} />
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {pending ? "Logging in..." : "Log In"}
          </button>
          <Link href="/forgot-password" className="text-sm text-amber-700 underline">
            Forgot password?
          </Link>
        </div>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-amber-700 underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";
