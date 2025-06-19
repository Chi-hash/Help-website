import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
    const [status, setStatus] = useState("Verifying...");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('useEffect running');
        console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

        const token = searchParams.get("token");
        const email = searchParams.get("email");

        console.log('Token:', token);
        console.log('Email:', email);

        if (!token || !email) {
            console.log('Missing token or email:', { token, email });
            setStatus("Invalid link. Please check the verification email.");
            return;
        }

        const verifyUrl = `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email?token=${token}&email=${email}`;
        console.log('Verification URL:', verifyUrl);

        axios
            .get(verifyUrl)
            .then((res) => {
                console.log('Verification response:', res.data);
                setStatus(res.data.message);
                setTimeout(() => {
                    console.log('Navigating to /login');
                    navigate("/"); // Changed to /login for clarity
                }, 3000);
            })
            .catch((err) => {
                console.error('Verification error:', err.response?.data || err.message);
                const message = err.response?.data?.message || "Verification failed or expired.";
                setStatus(`${message} <a href="/resend-verification?email=${encodeURIComponent(email)}">Resend verification email</a>`);
            });
    }, [searchParams, navigate]);

    return (
        <div className="verify-email-page">
            <h2 dangerouslySetInnerHTML={{ __html: status }} />
        </div>
    );
};

export default VerifyEmail;