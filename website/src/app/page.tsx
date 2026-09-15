import Link from "next/link";

const features = [
  {
    icon: "📞",
    title: "Daily Check-In Calls",
    body: "A warm, familiar voice calls at a time you choose, just to chat and see how their day is going.",
  },
  {
    icon: "💊",
    title: "Medication & Appointment Reminders",
    body: "Friendly nudges for pills and appointments, set up once by family — and an email to you if a reminder call doesn't go through.",
  },
  {
    icon: "🙏",
    title: "Prayer, On Request",
    body: "A quiet moment of prayer or reflection, in the faith tradition they choose. Always optional.",
  },
  {
    icon: "🔑",
    title: "“Where Did I Put It?” Helper",
    body: "They can ask where they keep things — glasses, keys, medication — and SetHear remembers.",
  },
  {
    icon: "🧠",
    title: "Memory Games & Trivia",
    body: "Light, enjoyable conversation and games to keep the mind engaged.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family Peace of Mind",
    body: "If a scheduled call goes unanswered, you'll get an email. If you don't hear from us, that reflects what we know — not a guarantee that everything is fine.",
  },
  {
    icon: "🌳",
    title: "Family Tree",
    body: "Build out parents, siblings, children, and grandchildren — the people whose stories get passed down.",
  },
  {
    icon: "📖",
    title: "Stories, Passed Down",
    body: "Life stories, recipes, and advice for the next generation — collected over calls, compiled into a keepsake Life Book.",
  },
  {
    icon: "🌐",
    title: "Calls in Their Language",
    body: "English, French, Spanish, Hindi, Punjabi, or Mandarin — the whole call happens in whichever language they're most comfortable in.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-200/50 via-amber-100/30 to-transparent blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-900 leading-[1.05]">
            A friendly voice,
            <br className="hidden sm:block" /> every single day.
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-xl sm:text-2xl text-slate-600 leading-relaxed">
            SetHear calls the seniors you love for warm conversation, gentle
            reminders, and a daily check-in — so they feel less alone, and
            you feel more at ease.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto rounded-full bg-amber-600 px-10 py-4 text-lg font-semibold text-white shadow-md hover:bg-amber-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Sign Up a Loved One
            </Link>
            <Link
              href="/how-it-works"
              className="w-full sm:w-auto rounded-full border-2 border-slate-300 px-10 py-4 text-lg font-semibold text-slate-700 hover:border-amber-400 hover:text-amber-700 hover:-translate-y-0.5 transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-amber-50/80 to-amber-50/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl sm:text-4xl font-semibold text-slate-900">
            What SetHear does
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-lg hover:-translate-y-1 hover:ring-amber-200"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl transition-colors group-hover:bg-amber-200">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
          More than a check-in call — a family archive in the making
        </h2>
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Every call is a chance to capture a story, a recipe, or a piece of
          advice — tagged to the family member it&apos;s about, and quietly
          compiled into a Life Book your family will treasure.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/family-tree"
            className="w-full sm:w-auto rounded-full border-2 border-slate-300 px-8 py-3.5 text-lg font-semibold text-slate-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
          >
            Build a Family Tree
          </Link>
          <Link
            href="/life-book"
            className="w-full sm:w-auto rounded-full border-2 border-slate-300 px-8 py-3.5 text-lg font-semibold text-slate-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
          >
            See a Sample Life Book
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
          Not a crisis line. Not a medical device.
        </h2>
        <p className="mt-6 text-xl text-slate-600 leading-relaxed">
          SetHear is companionship, reminders, and peace of mind — nothing
          more, nothing less. It never gives medical or mental health advice,
          and any mention of a fall or emergency is met with one clear
          instruction: call 911. Read more in our{" "}
          <Link href="/faq" className="text-amber-700 underline">
            FAQ
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
