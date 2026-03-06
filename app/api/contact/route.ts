import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 },
      );
    }

    const toEmail = process.env.CONTACT_EMAIL || 'pakataridis@example.com';

    const { data, error } = await resend.emails.send({
      from: 'Consultation Request <onboarding@resend.dev>',
      to: [toEmail],
      replyTo: email,
      subject: `New Consultation Request from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D6A4F; border-bottom: 2px solid #2D6A4F; padding-bottom: 12px;">
            New Consultation Request
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px; vertical-align: top;">Name:</td>
              <td style="padding: 8px 0; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; vertical-align: top;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2D6A4F;">${email}</a></td>
            </tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Phone:</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
          </table>
          <div style="background: #f8f6f2; border-radius: 12px; padding: 20px; margin-top: 16px;">
            <p style="margin: 0 0 8px; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            This message was sent from the drpakataridis.com consultation form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}
