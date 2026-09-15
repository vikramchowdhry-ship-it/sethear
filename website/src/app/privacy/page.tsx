export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 prose prose-slate">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-slate-500">
        Last updated: this describes what SetHear actually does today, as a
        small independent pilot. It is not a substitute for legal advice, and
        it will be reviewed by a lawyer before any paid public launch.
      </p>

      <h2>Who operates SetHear</h2>
      <p>
        SetHear is currently an independent pilot project, not a registered
        company. A real operating entity, business address, and designated
        privacy contact will be established before this becomes a paid
        product. Until then, this page and{" "}
        <a href="/contact">contact@sethear.com</a> are the accurate contact
        points.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Senior&apos;s name, phone number, and language preference</li>
        <li>Family/account holder&apos;s name, phone number, and email</li>
        <li>Emergency contact name and phone number</li>
        <li>Optional preferences: faith tradition, reminder schedule</li>
        <li>
          Reminders, family tree entries, and stories you or your loved one
          choose to save
        </li>
        <li>
          Anything explicitly asked to be remembered (e.g. where an item is
          kept), read back and confirmed before it&apos;s saved
        </li>
      </ul>

      <h2>Calls, recording, and AI processing</h2>
      <ul>
        <li>We do not record phone calls.</li>
        <li>
          During a call, we temporarily hold the conversation-so-far so the
          AI can respond naturally to what was just said. That working copy
          is deleted as soon as the call ends, and automatically cleared
          within about an hour either way as a backstop — we do not keep
          transcripts of your conversations.
        </li>
        <li>
          To have the conversation at all, your speech is processed by our
          phone provider (Twilio) to convert it to text, and that text is
          sent to our AI provider (Anthropic) to generate a reply. This is
          necessary, real-time processing — we don&apos;t control exactly how
          briefly those providers themselves retain data in transit, and we
          link their own policies below.
        </li>
        <li>
          If a story is shared during a call, only the story itself — not
          the full conversation — is saved, in the words the AI understood
          you to say.
        </li>
      </ul>

      <h2>Who can see what</h2>
      <p>
        Right now, SetHear has one login per family — whoever created the
        account can see everything on it (profile, reminders, family tree,
        stories, and the Life Book). We don&apos;t yet support separate logins
        for other relatives with different access levels; if that matters to
        you, tell us at <a href="/contact">contact@sethear.com</a>.
      </p>
      <p>
        Stories marked &ldquo;private, just between us&rdquo; are saved but excluded from
        the Life Book view. We do not sell or share your data with third
        parties for marketing, and we don&apos;t use it to train AI models
        beyond the standard processing described above.
      </p>

      <h2>Where data is stored</h2>
      <p>
        Data is stored with Supabase (on AWS infrastructure in the United
        States). Email is sent via Resend. Phone calls run through Twilio.
        These are our subprocessors for the service to function — we don&apos;t
        sell your data to them or anyone else.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request a copy of what we have on file, correct it, or have
        it permanently deleted at any time — email{" "}
        <a href="/contact">contact@sethear.com</a> or ask during a call. We
        aim to build this in line with the principles of Canada&apos;s Personal
        Information Protection and Electronic Documents Act (PIPEDA) —
        consent, access, accountability — though as an early pilot we are not
        claiming formal certified compliance.
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted at rest and in transit. Memory items (where
        belongings are kept) are treated as sensitive and are only ever
        retrievable through the phone number that recorded them.
      </p>
    </div>
  );
}
