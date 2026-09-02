import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    });

    if (linkError) {
      console.error('Error generating recovery link:', linkError);
      return NextResponse.json({ error: linkError.message }, { status: 500 });
    }

    const otpCode = linkData.properties.email_otp;

    if (!otpCode) {
      return NextResponse.json({ error: 'Failed to generate OTP code' }, { status: 500 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing');
      return NextResponse.json({ error: 'Email service configuration error' }, { status: 500 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: `Hapylo <${fromEmail}>`,
      to: email,
      subject: 'Reset your Hapylo Password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hapylo Password Reset</h2>
          <p>Your password reset code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #1a1a1a;">${otpCode}</h1>
          <p>Enter this code to reset your password.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (resendError) {
      console.error('Error sending reset email via Resend:', resendError);
      return NextResponse.json({ error: 'Error sending email: ' + resendError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Reset OTP sent successfully' });
  } catch (err: any) {
    console.error('Unexpected error in send-reset:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
