import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../lib/prisma";
import nodemailer from 'nodemailer'
// nodemailler
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },

    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`
            const info = await transporter.sendMail({
                from: '"prisma blog app" <prismablog@ph.com>',
                to: user.email,
                subject: "please verify your email",
                text: "Hello world?", // Plain-text version of the message
                html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #4f46e5;
      color: #ffffff;
      padding: 24px;
      text-align: center;
    }
    .content {
      padding: 32px;
      color: #333333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin: 24px 0;
      padding: 14px 28px;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>

    <div class="content">
      <p>Hi ${user.name},</p>

      <p>
        Thanks for signing up! Please confirm your email address by clicking the
        button below.
      </p>

      <p style="text-align: center;">
        <a href="${verificationURL}" class="button">
          Verify Email Address
        </a>
      </p>

      <p>
        If you didn’t create this account, you can safely ignore this email.
      </p>

      <p>
        This verification link ${verificationURL}.
      </p>

      <p>Best regards,<br />Your App Team</p>
    </div>

    <div class="footer">
      <p>
        © {{year}} Your App Name. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`, // HTML version of the message
            });

            console.log("Message sent:", info.messageId);
        },

    },
});