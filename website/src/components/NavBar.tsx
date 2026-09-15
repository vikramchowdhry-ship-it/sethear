import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/logout/actions";
import Logo from "@/components/Logo";

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
    <header className="border-b border-amber-100 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <Logo size={34} />
          <span className="text-xl font-semibold text-slate-800">
            SetHear
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-9">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-slate-600 hover:text-amber-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="hidden sm:block text-base font-medium text-slate-600 hover:text-amber-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-amber-600 px-6 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
            >
              Add a Loved One
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-base font-medium text-slate-500 hover:text-slate-800"
              >
                Log Out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-base font-medium text-slate-600 hover:text-amber-700"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-amber-600 px-6 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
