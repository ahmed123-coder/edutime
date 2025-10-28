// Email service utility
// For now, this is a placeholder. In production, you would integrate with
// services like Resend, SendGrid, or AWS SES

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // For development, we'll just log the email
  console.log("📧 Email would be sent:");
  console.log("To:", options.to);
  console.log("Subject:", options.subject);
  console.log("Content:", options.text || options.html);

  // In production, implement actual email sending:
  /*
  try {
    // Example with Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
  */

  return true; // Simulate success for development
}

export function generateVerificationEmailHtml(verificationUrl: string, userName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { 
          display: inline-block; 
          background: #4F46E5; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 20px 0; 
        }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Formation Space</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Hello ${userName || "there"},</p>
          <p>Thank you for creating an account with Formation Space. To complete your registration, please verify your email address by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
          <p>This verification link will expire in 24 hours for security reasons.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Formation Space. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateWelcomeEmailHtml(userName: string, userRole: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to EduTime</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button {
          display: inline-block;
          background: #10B981;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to EduTime!</h1>
        </div>
        <div class="content">
          <h2>Your account is now active</h2>
          <p>Hello ${userName},</p>
          <p>Welcome to EduTime! Your email has been verified and your account is now active.</p>
          <p>As a <strong>${userRole.toLowerCase()}</strong>, you can now:</p>
          ${
            userRole === "TEACHER"
              ? `
            <ul>
              <li>Search and discover training centers</li>
              <li>Book rooms and spaces for your classes</li>
              <li>Manage your bookings and payments</li>
              <li>Leave reviews for training centers</li>
              <li>Order additional services</li>
            </ul>
          `
              : userRole === "CENTER_OWNER"
                ? `
            <ul>
              <li>Manage your training center profile</li>
              <li>Add and manage rooms and spaces</li>
              <li>Handle booking requests</li>
              <li>Set pricing and availability</li>
              <li>View analytics and reports</li>
            </ul>
          `
                : `
            <ul>
              <li>Access your dashboard</li>
              <li>Manage your profile</li>
              <li>Use all platform features</li>
            </ul>
          `
          }
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Go to Dashboard</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EduTime. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmailHtml(resetUrl: string, userName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button {
          display: inline-block;
          background: #EF4444;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .warning { background: #FEF2F2; border: 1px solid #FECACA; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EduTime</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Hello ${userName || "there"},</p>
          <p>We received a request to reset your password for your EduTime account. Click the button below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #EF4444;">${resetUrl}</p>

          <div class="warning">
            <p><strong>Important:</strong></p>
            <ul>
              <li>This password reset link will expire in 1 hour for security reasons</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your password will not be changed until you click the link and set a new password</li>
            </ul>
          </div>

          <p>If you have any questions or concerns, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EduTime. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetConfirmationEmailHtml(userName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset Successfully</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button {
          display: inline-block;
          background: #10B981;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .success { background: #F0FDF4; border: 1px solid #BBF7D0; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Successfully</h1>
        </div>
        <div class="content">
          <h2>Your password has been changed</h2>
          <p>Hello ${userName || "there"},</p>

          <div class="success">
            <p><strong>✅ Password Reset Completed</strong></p>
            <p>Your EduTime account password has been successfully reset.</p>
          </div>

          <p>You can now login to your account with your new password.</p>

          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/auth/login" class="button">Login to Your Account</a>
          </p>

          <p><strong>Security Note:</strong></p>
          <ul>
            <li>You have been logged out from all other devices</li>
            <li>Your new password should be unique and secure</li>
            <li>Never share your password with anyone</li>
          </ul>

          <p>If you didn't reset your password, please contact our support team immediately.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 EduTime. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
