import nodemailer from "nodemailer";

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = getTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your StaySync Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
        <h2 style="color: #4f46e5; text-align: center;">StaySync</h2>
        <p>Hello,</p>
        <p>You requested a password reset. Please use the following code to verify your account. This code is valid for 10 minutes.</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Best regards,<br>The StaySync Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendBookingStatusEmail = async (email: string, name: string, status: string, hostelName: string) => {
  const transporter = getTransporter();
  
  const isApproved = status.toLowerCase() === "approved";
  const subject = isApproved ? "Booking Approved - StaySync" : "Booking Update - StaySync";
  const statusColor = isApproved ? "#10b981" : "#ef4444";
  const message = isApproved 
    ? `Great news! Your booking at <strong>${hostelName}</strong> has been approved. You can now access your dashboard and manage your stay.`
    : `We regret to inform you that your booking request at <strong>${hostelName}</strong> has been rejected. Please contact the hostel for more information.`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4f46e5; text-align: center;">StaySync</h2>
        <p>Hello ${name},</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-left: 4px solid ${statusColor}; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px; color: #374151;">
            ${message}
          </p>
        </div>
        <p>If you have any questions, please don't hesitate to reach out.</p>
        <p>Best regards,<br>The StaySync Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
