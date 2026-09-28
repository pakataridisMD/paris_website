import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { TOPICS, type Topic } from '@/lib/site';

const TOPIC_LABELS: Record<Topic, string> = {
  medical: 'Medical appointment request',
  academic: 'Mentoring request',
  business: 'Business',
  other: 'Appointment request',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form values are untrusted; escape them before putting them into the email HTML.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function text(value: unknown, max: number) {
  return String(value ?? '').trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Bots fill the hidden "company" field; pretend success and drop the request.
  if (text(body.company, 200)) {
    return NextResponse.json({ success: true });
  }

  const name = text(body.name, 120);
  const email = text(body.email, 200);
  const phone = text(body.phone, 40);
  const message = text(body.message, 4000);
  const topic: Topic = TOPICS.includes(body.topic as Topic) ? (body.topic as Topic) : 'other';
  const locale = body.locale === 'el' ? 'Greek' : 'English';

  if (!name || !message || !EMAIL_PATTERN.test(email) || body.consent !== true) {
    return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL;
  if (!apiKey || !toEmail) {
    console.error('Contact form is not configured: set RESEND_API_KEY and CONTACT_EMAIL.');
    return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 });
  }

  const row = (label: string, value: string) =>
    `<tr><td style="padding: 8px 0; color: #8b867d; width: 130px; vertical-align: top;">${label}</td><td style="padding: 8px 0;">${value}</td></tr>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: 'Website Appointments <onboarding@resend.dev>',
      to: [toEmail],
      replyTo: email,
      subject: `${TOPIC_LABELS[topic]} — ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #0c0c0c;">
          <p style="font-family: monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #b89a68; margin: 0 0 8px;">
            drpakataridis.com
          </p>
          <h2 style="font-weight: 400; font-size: 26px; margin: 0 0 16px; border-bottom: 1px solid #b89a68; padding-bottom: 16px;">
            ${TOPIC_LABELS[topic]}
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-family: sans-serif; font-size: 14px;">
            ${row('Name', escapeHtml(name))}
            ${row('Email', `<a href="mailto:${escapeHtml(email)}" style="color: #0c0c0c;">${escapeHtml(email)}</a>`)}
            ${phone ? row('Phone', escapeHtml(phone)) : ''}
            ${row('Language', locale)}
          </table>
          <div style="background: #f1ede5; padding: 20px; margin-top: 16px; font-family: sans-serif;">
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; font-size: 14px;">${escapeHtml(message)}</p>
          </div>
          <p style="margin-top: 24px; font-family: sans-serif; font-size: 12px; color: #8b867d;">
            Reply to this email to answer ${escapeHtml(name)} directly. The sender consented to being contacted about this request.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send.' }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
