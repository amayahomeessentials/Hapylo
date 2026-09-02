import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, type } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Initialize Supabase admin client
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

    // Generate the magic link / OTP using the admin API
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        data: name ? { full_name: name } : undefined,
      },
    });

    if (linkError) {
      console.error('Error generating link:', linkError);
      return NextResponse.json({ error: linkError.message }, { status: 500 });
    }

    const otpCode = linkData.properties.email_otp;

    if (!otpCode) {
      return NextResponse.json({ error: 'Failed to generate OTP code' }, { status: 500 });
    }

    // Send the OTP via Resend
    // By default, if the domain is not verified, use onboarding@resend.dev
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: `Hapylo <${fromEmail}>`,
      to: email,
      subject: 'Your Hapylo Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hapylo Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #1a1a1a;">${otpCode}</h1>
          <p>Enter this code to complete your ${type === 'signup' ? 'registration' : 'sign in'}.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (resendError) {
      console.error('Error sending email via Resend:', resendError);
      return NextResponse.json({ error: 'Error sending email: ' + resendError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (err: any) {
    console.error('Unexpected error in send-otp:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
