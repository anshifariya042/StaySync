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
export const sendHostelApprovalEmail = async (email: string, name: string, status: string, hostelName: string) => {
  const transporter = getTransporter();
  
  const isApproved = status === "approved";
  const subject = isApproved ? "StaySync - Hostel Approved!" : "StaySync - Hostel Registration Update";
  const statusColor = isApproved ? "#10b981" : "#ef4444";
  
  const message = isApproved 
    ? `Congratulations! Your hostel <strong>${hostelName}</strong> has been approved by the StaySync Super Admin. You can now log in to your admin dashboard and manage your rooms and residents.`
    : `We regret to inform you that your request for registering <strong>${hostelName}</strong> has been rejected by the Super Admin. Please contact support if you have any questions.`;

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
        ${isApproved ? `<div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Dashboard</a>
        </div>` : ''}
        <p>Best regards,<br>The StaySync Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewHostelRegistrationEmail = async (adminEmail: string, ownerName: string, hostelName: string, location: string) => {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "Alert: New Hostel Registration - StaySync",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">StaySync</h2>
          <p>Hello Super Admin,</p>
          <p>A new hostel registration request has been submitted by <strong>${ownerName}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Hostel Name:</strong> ${hostelName}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Pending Approval</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/superadmin/approvals" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Registration</a>
          </div>
          <p>Best regards,<br>The StaySync Team</p>
        </div>
      `,
    };
  
    await transporter.sendMail(mailOptions);
  };
  
  export const sendRegistrationReceivedEmail = async (userEmail: string, ownerName: string, hostelName: string) => {
      const transporter = getTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Safe & Received: Your Hostel Registration - StaySync",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #4f46e5; text-align: center;">StaySync</h2>
            <p>Hello ${ownerName},</p>
            <p>Thank you for choosing StaySync! We've successfully received your registration request for <strong>${hostelName}</strong>.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Status:</strong> Pending Manual Approval</p>
              <p style="margin: 5px 0;"><strong>Next Steps:</strong> Our Super Admin team will review your application and documents. This typically takes 24-48 hours.</p>
            </div>
            <p>Once approved, you will receive another email with your access credentials and dashboard link.</p>
            <p>Best regards,<br>The StaySync Team</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    };

export const sendNewBookingAlertToAdmin = async (adminEmail: string, studentName: string, hostelName: string, roomType: string) => {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Booking Request: ${studentName} - StaySync`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">StaySync Admin</h2>
          <p>Hello Admin,</p>
          <p>A new booking request has been received for <strong>${hostelName}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
            <p style="margin: 5px 0;"><strong>Room Type:</strong> ${roomType}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Pending Approval</p>
          </div>
          <p>Please log in to your dashboard to review and manage this request.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/residents" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Request</a>
          </div>
          <p>Best regards,<br>The StaySync Team</p>
        </div>
      `,
    };
  
    await transporter.sendMail(mailOptions);
};
