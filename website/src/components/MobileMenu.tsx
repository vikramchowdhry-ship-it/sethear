"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LinkItem = { href: string; label: string };

export default function MobileMenu({
  links,
  loggedIn,
  logoutAction,
}: {
  links: LinkItem[];
  loggedIn: boolean;
  logoutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-amber-50"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-amber-100 bg-white shadow-lg">
          <nav className="flex flex-col px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-slate-700 border-b border-slate-100 last:border-none"
              >
                {link.label}
              </Link>
            ))}
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="py-3 text-base font-medium text-slate-700 border-b border-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-full bg-amber-600 px-6 py-2.5 text-center text-base font-semibold text-white hover:bg-amber-700"
                >
                  Add a Loved One
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="mt-3 py-2 text-left text-base font-medium text-slate-500"
                  >
                    Log Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="py-3 text-base font-medium text-slate-700 border-b border-slate-100"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-full bg-amber-600 px-6 py-2.5 text-center text-base font-semibold text-white hover:bg-amber-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
