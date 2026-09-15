import { Resend } from "resend";

const FROM_ADDRESS = process.env.EMAIL_FROM || "SetHear <onboarding@resend.dev>";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!emailConfigured()) {
    console.warn("RESEND_API_KEY not set — skipping email:", params.subject);
    return { skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: FROM_ADDRESS,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}

export function missedCallEmail(seniorName: string) {
  return {
    subject: `SetHear: a call to ${seniorName} wasn't answered`,
    html: `
      <p>Hi,</p>
      <p><strong>${escapeHtml(seniorName)}</strong> didn't pick up their scheduled call from SetHear.</p>
      <p>This can happen for lots of harmless reasons — worth a quick check-in call yourself if you're not sure why.</p>
      <p style="color:#888;font-size:12px;margin-top:24px;">This is an automated message from SetHear.</p>
    `,
  };
}

export function signupConfirmationEmail(seniorName: string, callTime: string) {
  return {
    subject: `You're all set — SetHear will start calling ${seniorName}`,
    html: `
      <p>Hi,</p>
      <p>Thanks for signing up <strong>${escapeHtml(seniorName)}</strong> for SetHear.</p>
      <p>Daily calls are set for <strong>${escapeHtml(callTime)}</strong>. You can manage reminders, the family tree, and stories anytime from your dashboard.</p>
      <p style="color:#888;font-size:12px;margin-top:24px;">This is an automated message from SetHear.</p>
    `,
  };
}

export function resetPasswordEmail(resetUrl: string) {
  return {
    subject: "Reset your SetHear password",
    html: `
      <p>Hi,</p>
      <p>We got a request to reset your SetHear password. This link works for 1 hour:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
      <p style="color:#888;font-size:12px;margin-top:24px;">This is an automated message from SetHear.</p>
    `,
  };
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
