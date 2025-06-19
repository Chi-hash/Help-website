import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerifyNotice = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const handleResend = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-verification`, {
        email: user.email,
      });
      setStatus("Verification email has been resent. Please check your inbox.");
      setSecondsLeft(60); // start countdown
    } catch (err) {
      setStatus(err.response?.data?.message || "Error sending email. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [secondsLeft]);

  return (
    <div className="verify-notice">
      <h2>Verify Your Email</h2>
      <p>We’ve sent a verification link to <b>{user.email}</b>. Please check your inbox.</p>

      <button onClick={handleResend} disabled={loading || secondsLeft > 0}>
        {loading
          ? "Resending..."
          : secondsLeft > 0
          ? `Resend in ${secondsLeft}s`
          : "Resend Verification Email"}
      </button>

      {status && <p>{status}</p>}
    </div>
  );
};

export default VerifyNotice;
