import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-100 bg-amber-50/50">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-800">SetHear</p>
            <p className="mt-2 text-slate-500">
              A friendly daily phone call for seniors who live alone.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Links</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/how-it-works" className="hover:text-amber-700">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-amber-700">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-amber-700">FAQ</Link></li>
              <li><Link href="/signup" className="hover:text-amber-700">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Legal</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/privacy" className="hover:text-amber-700">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-amber-700">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 rounded-lg border border-amber-200 bg-white p-4 text-xs text-slate-500">
          SetHear is a companionship and reminder service. It is not a
          medical device, a crisis line, or a substitute for professional
          medical or mental health care. In an emergency, always call 911.
        </div>
        <p className="mt-6 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SetHear. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
