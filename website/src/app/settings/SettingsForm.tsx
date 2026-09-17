"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIMEZONES = [
  { value: "America/St_Johns", label: "Newfoundland Time" },
  { value: "America/Halifax", label: "Atlantic Time" },
  { value: "America/Toronto", label: "Eastern Time" },
  { value: "America/Winnipeg", label: "Central Time" },
  { value: "America/Edmonton", label: "Mountain Time" },
  { value: "America/Vancouver", label: "Pacific Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
  { value: "Europe/London", label: "UK Time" },
  { value: "Asia/Kolkata", label: "India Time" },
  { value: "Asia/Shanghai", label: "China Time" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French (Canadian)" },
  { value: "es", label: "Spanish" },
  { value: "hi", label: "Hindi" },
  { value: "pa", label: "Punjabi" },
  { value: "zh", label: "Mandarin Chinese" },
];

const FAITHS = [
  { value: "", label: "No prayer / prefer not to say" },
  { value: "christian", label: "Christian" },
  { value: "muslim", label: "Muslim" },
  { value: "jewish", label: "Jewish" },
  { value: "hindu", label: "Hindu" },
  { value: "buddhist", label: "Buddhist" },
  { value: "other", label: "Other" },
];

type Senior = {
  id: string;
  seniorName: string;
  preferredCallTime: string;
  timezone: string;
  language: string;
  faithPreference: string | null;
  emergencyContact: string;
};

type Reminder = {
  id: string;
  description: string;
  scheduledTime: string;
  recurrence: string;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default function SettingsForm({
  senior,
  reminders,
}: {
  senior: Senior;
  reminders: Reminder[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [preferredCallTime, setPreferredCallTime] = useState(senior.preferredCallTime);
  const [timezone, setTimezone] = useState(senior.timezone);
  const [language, setLanguage] = useState(senior.language);
  const [faithPreference, setFaithPreference] = useState(senior.faithPreference || "");
  const [emergencyContact, setEmergencyContact] = useState(senior.emergencyContact);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seniorId: senior.id,
          preferredCallTime,
          timezone,
          language,
          faithPreference: faithPreference || null,
          emergencyContact,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Couldn't save. Please try again.");
      }
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-10 space-y-12">
      <form onSubmit={handleSave} className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-900">Call settings</h2>

        <label className="block text-sm font-medium text-slate-700">
          Preferred daily call time
          <input
            type="time"
            value={preferredCallTime}
            onChange={(e) => setPreferredCallTime(e.target.value)}
            required
            className={inputClass}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Their time zone
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className={inputClass}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
            {!TIMEZONES.some((tz) => tz.value === timezone) && (
              <option value={timezone}>{timezone}</option>
            )}
          </select>
          <p className="mt-1 text-xs font-normal text-slate-500">
            The call time above is in this time zone.
          </p>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Call language
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={inputClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Faith tradition for optional prayer
          <select
            value={faithPreference}
            onChange={(e) => setFaithPreference(e.target.value)}
            className={inputClass}
          >
            {FAITHS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Emergency contact number
          <input
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            required
            className={inputClass}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-amber-600 px-6 py-2.5 font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {savedAt && !saving && (
            <span className="text-sm text-green-700">Saved.</span>
          )}
        </div>
      </form>

      <RemindersSection seniorId={senior.id} reminders={reminders} />
    </div>
  );
}

function RemindersSection({
  seniorId,
  reminders,
}: {
  seniorId: string;
  reminders: Reminder[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [newRecurrence, setNewRecurrence] = useState("daily");
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/reminders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Couldn't remove that reminder. Please try again.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't remove that reminder.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newDescription.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seniorId,
          type: "other",
          description: newDescription,
          scheduledTime: newTime,
          recurrence: newRecurrence,
        }),
      });
      if (!res.ok) throw new Error("Couldn't add that reminder. Please try again.");
      setNewDescription("");
      setNewTime("09:00");
      setNewRecurrence("daily");
      setAddOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add that reminder.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Reminders</h2>

      {reminders.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No reminders set yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {reminders.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-4 rounded-lg bg-amber-50 px-4 py-2.5 text-sm"
            >
              <span className="text-slate-700">
                {r.description}
                <span className="ml-2 text-slate-500">
                  &middot; {formatTime(r.scheduledTime)} &middot; {r.recurrence}
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                disabled={deletingId === r.id}
                className="shrink-0 text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
              >
                {deletingId === r.id ? "Removing…" : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {addOpen ? (
        <form
          onSubmit={handleAdd}
          className="mt-5 space-y-3 rounded-lg border border-slate-200 p-4"
        >
          <label className="block text-sm font-medium text-slate-700">
            Reminder
            <input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="e.g. Take blood pressure medication"
              required
              className={inputClass}
            />
          </label>
          <div className="flex gap-3">
            <label className="block flex-1 text-sm font-medium text-slate-700">
              Time
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                className={inputClass}
              />
            </label>
            <label className="block flex-1 text-sm font-medium text-slate-700">
              Recurrence
              <select
                value={newRecurrence}
                onChange={(e) => setNewRecurrence(e.target.value)}
                className={inputClass}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="once">Once</option>
              </select>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={adding}
              className="rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-60"
            >
              {adding ? "Adding…" : "Add reminder"}
            </button>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="mt-4 text-sm font-semibold text-amber-700 hover:text-amber-800"
        >
          + Add a reminder
        </button>
      )}
    </div>
  );
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
