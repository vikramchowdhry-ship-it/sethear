"use client";

import { useState } from "react";

type Reminder = {
  type: string;
  description: string;
  scheduledTime: string;
  recurrence: string;
};

const emptyReminder = (): Reminder => ({
  type: "medication",
  description: "",
  scheduledTime: "09:00",
  recurrence: "daily",
});

export default function SignUp() {
  const [reminders, setReminders] = useState<Reminder[]>([emptyReminder()]);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function updateReminder(index: number, patch: Partial<Reminder>) {
    setReminders((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  }

  function addReminder() {
    setReminders((prev) => [...prev, emptyReminder()]);
  }

  function removeReminder(index: number) {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      seniorName: form.get("seniorName"),
      seniorPhone: form.get("seniorPhone"),
      preferredCallTime: form.get("preferredCallTime"),
      faithPreference: form.get("faithPreference"),
      familyName: form.get("familyName"),
      familyPhone: form.get("familyPhone"),
      familyEmail: form.get("familyEmail"),
      relationship: form.get("relationship"),
      emergencyContact: form.get("emergencyContact"),
      notes: form.get("notes"),
      consentGiven: form.get("consentGiven") === "on",
      reminders,
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="text-4xl">🎉</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          You&apos;re all set!
        </h1>
        <p className="mt-3 text-slate-600">
          We&apos;ve saved your loved one&apos;s profile. Once the phone
          service is live, calls will begin at the time you selected.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">
        Sign Up a Loved One
      </h1>
      <p className="mt-2 text-slate-600">
        Takes about two minutes. You can update or remove this information
        anytime.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-10">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            About your loved one
          </h2>

          <Field label="Full name">
            <input name="seniorName" required className={inputClass} />
          </Field>

          <Field label="Phone number" hint="The number SetHear will call">
            <input
              name="seniorPhone"
              type="tel"
              required
              placeholder="(555) 555-5555"
              className={inputClass}
            />
          </Field>

          <Field label="Preferred daily call time">
            <input
              name="preferredCallTime"
              type="time"
              required
              defaultValue="09:00"
              className={inputClass}
            />
          </Field>

          <Field
            label="Faith tradition for optional prayer"
            hint="Only offered if selected here — never assumed"
          >
            <select name="faithPreference" className={inputClass} defaultValue="">
              <option value="">No prayer / prefer not to say</option>
              <option value="christian">Christian</option>
              <option value="muslim">Muslim</option>
              <option value="jewish">Jewish</option>
              <option value="hindu">Hindu</option>
              <option value="buddhist">Buddhist</option>
              <option value="other">Other (we&apos;ll follow up)</option>
            </select>
          </Field>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Your contact info
          </h2>

          <Field label="Your name">
            <input name="familyName" required className={inputClass} />
          </Field>

          <Field label="Your relationship to them">
            <input
              name="relationship"
              required
              placeholder="e.g. daughter, son, neighbour"
              className={inputClass}
            />
          </Field>

          <Field label="Your phone number">
            <input name="familyPhone" type="tel" required className={inputClass} />
          </Field>

          <Field label="Your email">
            <input name="familyEmail" type="email" required className={inputClass} />
          </Field>

          <Field
            label="Emergency contact"
            hint="Name and number to notify for anything urgent"
          >
            <input name="emergencyContact" required className={inputClass} />
          </Field>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Reminders (optional)
            </h2>
            <button
              type="button"
              onClick={addReminder}
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              + Add another
            </button>
          </div>

          {reminders.map((r, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 p-4 space-y-3 relative"
            >
              {reminders.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReminder(i)}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-red-600"
                >
                  Remove
                </button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-slate-700">
                  Type
                  <select
                    value={r.type}
                    onChange={(e) => updateReminder(i, { type: e.target.value })}
                    className={inputClass}
                  >
                    <option value="medication">Medication</option>
                    <option value="appointment">Appointment</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="text-sm text-slate-700">
                  Time
                  <input
                    type="time"
                    value={r.scheduledTime}
                    onChange={(e) =>
                      updateReminder(i, { scheduledTime: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="text-sm text-slate-700 block">
                Description
                <input
                  value={r.description}
                  onChange={(e) =>
                    updateReminder(i, { description: e.target.value })
                  }
                  placeholder="e.g. Take blood pressure medication"
                  className={inputClass}
                />
              </label>
              <label className="text-sm text-slate-700 block">
                Recurrence
                <select
                  value={r.recurrence}
                  onChange={(e) =>
                    updateReminder(i, { recurrence: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="once">Once</option>
                </select>
              </label>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <Field label="Anything else we should know?">
            <textarea name="notes" rows={3} className={inputClass} />
          </Field>

          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="consentGiven"
              required
              className="mt-1"
            />
            <span>
              I confirm my loved one has agreed to be called by SetHear, and
              I have read the{" "}
              <a href="/privacy" className="text-amber-700 underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-amber-700 underline">
                Terms of Use
              </a>
              .
            </span>
          </label>
        </section>

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-amber-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting..." : "Complete Sign Up"}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
      {hint && <p className="mt-1 text-xs font-normal text-slate-500">{hint}</p>}
    </label>
  );
}
