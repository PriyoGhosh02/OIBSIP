const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host: host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
    });
    console.log(`📧 Nodemailer configured with host: ${host}`);
  } else {
    // Generate an Ethereal test account for development
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`📧 Ethereal Test Email service activated for development: ${testAccount.user}`);
    } catch (err) {
      console.warn('⚠️ Could not initialize Ethereal test account, using console logging fallback.');
      transporter = {
        sendMail: async (options) => {
          console.log(`\n=================== [SIMULATED EMAIL] ===================`);
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Text: ${options.text}`);
          console.log(`=========================================================\n`);
          return { messageId: 'simulated-' + Date.now() };
        },
      };
    }
  }

  return transporter;
};

// Send Verification Email
const sendVerificationEmail = async (email, token, name) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyUrl = `${clientUrl}/verify-email/${token}`;

  const mailOptions = {
    from: `"PizzaHub Support" <${process.env.SMTP_USER || 'no-reply@pizzahub.test'}>`,
    to: email,
    subject: 'Verify your PizzaHub account 🍕',
    text: `Hello ${name},\n\nPlease verify your email for PizzaHub by clicking the link below:\n${verifyUrl}\n\nThank you for choosing PizzaHub!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #E63946; margin-top: 0;">🍕 Welcome to PizzaHub!</h2>
        <p style="color: #1F2937; font-size: 16px;">Hello <strong>${name}</strong>,</p>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">Thank you for registering at PizzaHub. Please click the button below to verify your email address and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #E63946; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #6b7280; font-size: 13px;">Or copy and paste this link in your browser:</p>
        <p style="color: #3b82f6; font-size: 13px; word-break: break-all;">${verifyUrl}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">PizzaHub Delivery &bull; Fresh & Hot to your Doorstep</p>
      </div>
    `,
  };

  const transport = await getTransporter();
  const info = await transport.sendMail(mailOptions);
  console.log(`\n📨 [Email Sent] Verification link generated:`);
  console.log(`👉 Link: ${verifyUrl}`);
  if (info.messageId && nodemailer.getTestMessageUrl) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log(`👉 Ethereal Preview: ${previewUrl}`);
  }
  return info;
};

// Send Password Reset Email
const sendPasswordResetEmail = async (email, token, name) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password/${token}`;

  const mailOptions = {
    from: `"PizzaHub Security" <${process.env.SMTP_USER || 'no-reply@pizzahub.test'}>`,
    to: email,
    subject: 'Password Reset Request — PizzaHub 🔒',
    text: `Hello ${name},\n\nYou requested a password reset. Please click the link below within 15 minutes to reset your password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #E63946; margin-top: 0;">🔒 Reset Your PizzaHub Password</h2>
        <p style="color: #1F2937; font-size: 16px;">Hello <strong>${name}</strong>,</p>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">We received a request to reset your password. This link is valid for <strong>15 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #F97316; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #6b7280; font-size: 13px;">Or copy and paste this link in your browser:</p>
        <p style="color: #3b82f6; font-size: 13px; word-break: break-all;">${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you did not request a password reset, you can safely ignore this message.</p>
      </div>
    `,
  };

  const transport = await getTransporter();
  const info = await transport.sendMail(mailOptions);
  console.log(`\n📨 [Email Sent] Password reset link generated:`);
  console.log(`👉 Link: ${resetUrl}`);
  if (info.messageId && nodemailer.getTestMessageUrl) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log(`👉 Ethereal Preview: ${previewUrl}`);
  }
  return info;
};

// Send Low Stock Alert Email to Admin
const sendLowStockAlert = async (adminEmail, lowStockItems) => {
  const itemsListText = lowStockItems
    .map((item) => `- ${item.name} (${item.category}): ${item.stock} remaining (Threshold: ${item.threshold})`)
    .join('\n');

  const itemsListHtml = lowStockItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px; font-weight: bold; color: #1F2937;">${item.name}</td>
        <td style="padding: 10px; color: #64748B;">${item.category}</td>
        <td style="padding: 10px; font-weight: bold; color: #DC2626;">${item.stock} units</td>
        <td style="padding: 10px; color: #64748B;">${item.threshold}</td>
      </tr>`
    )
    .join('');

  const mailOptions = {
    from: `"PizzaHub Inventory Monitor" <${process.env.SMTP_USER || 'no-reply@pizzahub.test'}>`,
    to: adminEmail,
    subject: 'Low Stock Alert — PizzaHub ⚠️',
    text: `Attention Admin,\n\nThe following items have fallen below their configured stock threshold:\n\n${itemsListText}\n\nPlease update inventory promptly.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #DC2626; margin-top: 0;">⚠️ Low Stock Alert — PizzaHub</h2>
        <p style="color: #1F2937; font-size: 15px;">The following ingredients have fallen below their configured threshold. Please replenish stock soon:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <thead>
            <tr style="background: #F8FAFC; text-align: left; border-bottom: 2px solid #E5E7EB;">
              <th style="padding: 10px; color: #475569;">Item Name</th>
              <th style="padding: 10px; color: #475569;">Category</th>
              <th style="padding: 10px; color: #475569;">Current Stock</th>
              <th style="padding: 10px; color: #475569;">Threshold</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>
        <p style="color: #4b5563; font-size: 14px;">Please update inventory via the Admin Inventory Dashboard.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">PizzaHub Automated Stock Monitor</p>
      </div>
    `,
  };

  const transport = await getTransporter();
  const info = await transport.sendMail(mailOptions);
  console.log(`⚠️ [Low Stock Alert Sent] to ${adminEmail} for ${lowStockItems.length} items`);
  return info;
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLowStockAlert,
};
