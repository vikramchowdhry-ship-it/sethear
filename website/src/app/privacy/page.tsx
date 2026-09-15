export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 prose prose-slate">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-slate-500">
        This is a placeholder policy for an early pilot. Have it reviewed by
        a lawyer before accepting real users or payments.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Senior&apos;s name and phone number</li>
        <li>Family/emergency contact name and phone number</li>
        <li>Optional preferences: faith tradition, reminder schedule</li>
        <li>
          Anything explicitly asked to be remembered (e.g. where an item is
          kept), confirmed with the caller before it is saved
        </li>
      </ul>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not record phone calls</li>
        <li>We do not store conversation transcripts</li>
        <li>We do not share information with anyone other than the account holder and the senior themselves</li>
        <li>We do not sell or share data with third parties for marketing</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can request a copy of what we have on file, correct it, or have
        it permanently deleted at any time, by phone or by contacting us
        directly. This service is intended to comply with Canada&apos;s
        Personal Information Protection and Electronic Documents Act
        (PIPEDA).
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted at rest. Memory items (where belongings are kept)
        are treated as especially sensitive and are only ever retrievable by
        the phone number that recorded them.
      </p>
    </div>
  );
}
