// utils/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
  
});

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"IT Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(' Email sent to:', to);
  } catch (err) {
    console.error(' Failed to send email:', err.message);
  }
};
