/**
 * A senior's preferredCallTime/reminder scheduledTime is a plain "HH:MM" wall-clock
 * value in THEIR timezone, not UTC. These helpers convert between that and real
 * instants so the cron (which only knows server/UTC time) compares correctly.
 */

export function isValidTimeZone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** The calendar date (YYYY-MM-DD) as seen from inside `timeZone` at instant `now`. */
export function localDateKeyInTz(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * The real instant (UTC Date) at which "HH:MM" occurs, on today's date in `timeZone`,
 * where "today" is also determined from `timeZone` (not the server's UTC date) so
 * this stays correct right around midnight.
 */
export function scheduledInstant(hhmm: string, timeZone: string, now: Date): Date {
  const dateKey = localDateKeyInTz(now, timeZone);
  const assumedUtc = new Date(`${dateKey}T${hhmm}:00Z`);

  // Find how far "assumedUtc" actually is from that same wall-clock time in
  // `timeZone`, and shift by the difference — this naturally accounts for DST.
  const asLocalWallClock = new Date(assumedUtc.toLocaleString("en-US", { timeZone }));
  const asUtcWallClock = new Date(assumedUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMs = asUtcWallClock.getTime() - asLocalWallClock.getTime();

  return new Date(assumedUtc.getTime() + offsetMs);
}
