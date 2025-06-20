// utils/mailer.js
import nodemailer from 'nodemailer';

// Debug environment variables
console.log('🔍 Email Configuration Debug:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
console.log('EMAIL_USER length:', process.env.EMAIL_USER?.length || 0);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length || 0);

// Create transporter with better configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.trim(), // This should be an App Password, not regular password
    },
    // Add timeout and other settings
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  });
};

let transporter = null;

// Initialize transporter when environment variables are available
const initializeTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    console.log('🔍 Attempting to verify email transporter...');
    console.log('🔍 Using email:', process.env.EMAIL_USER?.trim());
    console.log('🔍 Password length:', process.env.EMAIL_PASS?.trim()?.length || 0);
    
    const currentTransporter = initializeTransporter();
    await currentTransporter.verify();
    console.log('✅ Email transporter verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error:', error);
    return false;
  }
};

export const sendEmail = async ({ to, subject, html }) => {
  // Check if environment variables are set
  if (!process.env.EMAIL_USER?.trim()) {
    console.error('❌ Email configuration missing: EMAIL_USER not set or empty');
    throw new Error('Email configuration missing: EMAIL_USER');
  }
  
  if (!process.env.EMAIL_PASS?.trim()) {
    console.error('❌ Email configuration missing: EMAIL_PASS not set or empty');
    throw new Error('Email configuration missing: EMAIL_PASS');
  }

  const currentTransporter = initializeTransporter();

  const mailOptions = {
    from: `"HELP! IT Support" <${process.env.EMAIL_USER.trim()}>`,
    to,
    subject,
    html,
  };

  try {
    console.log('📧 Attempting to send email to:', to);
    console.log('📧 Email subject:', subject);
    console.log('📧 From email:', process.env.EMAIL_USER.trim());
    
    const result = await currentTransporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    console.log('📧 Message ID:', result.messageId);
    
    return result;
  } catch (err) {
    console.error('❌ Failed to send email to:', to);
    console.error('❌ Error details:', err.message);
    console.error('❌ Error code:', err.code);
    
    // Provide specific error messages for common issues
    if (err.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Check your EMAIL_USER and EMAIL_PASS');
      console.error('💡 Make sure you\'re using an App Password, not your regular Gmail password');
    } else if (err.code === 'ECONNECTION') {
      console.error('🌐 Connection failed. Check your internet connection');
    } else if (err.code === 'ETIMEDOUT') {
      console.error('⏰ Connection timed out');
    }
    
    throw err; // Re-throw the error so calling functions can handle it
  }
};

// Export the verification function
export { verifyTransporter };
