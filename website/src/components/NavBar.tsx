import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/logout/actions";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";

const links = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/family-tree", label: "Family Tree" },
  { href: "/stories", label: "Stories" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default async function NavBar() {
  const user = await getCurrentUser();

  return (
    <header className="relative border-b border-amber-100 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <Link href={user ? "/dashboard" : "/"} className="flex min-w-0 items-center gap-2">
          <Logo size={30} />
          <span className="truncate text-lg font-semibold text-slate-800">
            SetHear
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-slate-600 hover:text-amber-700 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5 flex-none">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-base font-medium text-slate-600 hover:text-amber-700 transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-amber-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors whitespace-nowrap"
              >
                Add a Loved One
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-base font-medium text-slate-500 hover:text-slate-800 whitespace-nowrap"
                >
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-base font-medium text-slate-600 hover:text-amber-700 whitespace-nowrap"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-amber-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors whitespace-nowrap"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <MobileMenu links={links} loggedIn={Boolean(user)} logoutAction={logoutAction} />
      </div>
    </header>
  );
}
