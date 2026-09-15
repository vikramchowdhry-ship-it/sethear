# SetHear

A friendly daily phone call for seniors who live alone — companionship,
reminders, and a growing family archive of stories passed down the
generations. See project chat history for the full design discussion (scope,
safety guardrails, Canadian privacy considerations).

**Live at:** https://sethear-companion-hub.vercel.app (and https://sethear.com
once DNS finishes pointing at Vercel — see below).

## Status

**Phase 1: Website — done and deployed.**
- Marketing site: home, how it works, FAQ, pricing, privacy, terms
- **Real accounts** — email/password login, each family's data is private to them
- Sign-up form (family registers a senior + optional reminders)
- **Family Tree** — add family members, grouped by relationship
- **Stories** — capture life stories against a prompt library, tag people from the family tree
- **Life Book** — a compiled, book-styled view of the (non-private) stories
- Installable as an app on Android/iOS (Add to Home Screen) — see note on native apps below
- Real database: Supabase Postgres

**Phase 2: Twilio phone integration — code written, not yet activated.**
All the webhook/call-flow code exists and is deployed, but it does nothing
until a real Twilio account's credentials are added (see below). Once active:
- Incoming calls: greets the caller by name (matched by phone number), reads
  today's reminders, offers to record a story from the prompt library
- Outbound reminder calls: a daily job calls anyone with a reminder due and
  reads it aloud
- Stories told over the phone are transcribed and saved into the same
  Family Tree / Stories / Life Book system as the website

**Phase 3: Subscription billing (Stripe)** — not started yet.

**Native iOS/Android App Store apps** — not something any amount of code
changes this: Apple ($99/year developer account + review) and Google Play
($25 account + review) both require their own paid accounts and review time
measured in days, regardless of who builds the app. The installable
"Add to Home Screen" version is the real, working answer for "an app on the
phone" today.

## Project structure

```
SeniorCompanionLine/
  website/
    src/app/
      /, /how-it-works, /pricing, /faq, /privacy, /terms   <- public marketing pages
      /register, /login, /logout                            <- account system
      /signup, /family-tree, /stories, /life-book            <- require login (see middleware.ts)
      /api/signup                                            <- sign-up form backend
      /api/twilio/voice, /voice/gather, /voice/recording,
        /voice/transcription                                 <- incoming call flow (needs Twilio creds)
      /api/twilio/reminder-twiml                              <- what a reminder call says
      /api/cron/reminders                                     <- daily job that places reminder calls
    src/lib/
      auth.ts        <- password hashing + signed session cookies
      twilio.ts       <- Twilio client + webhook signature validation
      prisma.ts       <- database client
      storyPrompts.ts <- the story prompt library
    src/middleware.ts <- redirects logged-out users to /login on protected pages
    prisma/schema.prisma <- User, SeniorProfile, Reminder, FamilyMember, Story
    vercel.json          <- the daily reminder-check cron job
  .claude/launch.json    <- lets Claude Code preview the site in-app
```

## Running it yourself

```bash
cd website
npm install
npm run dev
```

Then open http://localhost:3000. The `.env` file (gitignored) holds the
Supabase `DATABASE_URL`/`DIRECT_URL` and `SESSION_SECRET` — ask whoever set
this up for a copy, or create your own Supabase project and generate a new
session secret.

## What's needed to activate the phone line

Add three values (from the Twilio Console, after creating a free-trial
account) to `.env` locally and to the Vercel project's environment variables:

```
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1..."   # the number you bought in Twilio, E.164 format
```

Then in the Twilio Console, set the phone number's **"A call comes in"**
webhook to `https://sethear.com/api/twilio/voice` (POST).

**One known limitation:** the reminder-calling cron only runs once a day
(`vercel.json`) because Vercel's free Hobby plan caps cron jobs at once/day.
To actually check reminders every 15 minutes, the practical free fix is a
GitHub Actions scheduled workflow (`cron: '*/15 * * * *'`) that just curls
`/api/cron/reminders` with the `CRON_SECRET` bearer token — worth setting up
once this repo is pushed to GitHub.

Also worth doing once the phone line is real: swap the simple yes/no +
prompt-library conversation for a genuine LLM-driven conversation (needs an
Anthropic or OpenAI API key) — the current version works without one by
leaning on Twilio's own speech-to-text, but a real AI conversation is a
natural next upgrade.
