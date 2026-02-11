
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, provider } from '../firebase';


const googleIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.905 6.574 15.963 7.5095L18.7855 4.687C17.017 3.0405 14.6365 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFFFFF" />
        <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.905 6.574 15.963 7.5095L18.7855 4.687C17.017 3.0405 14.6365 2 12 2C8.15895 2 4.82795 4.1935 3.15295 7.3455Z" fill="#FF3D00" />
        <path d="M12 22C14.6605 22 17.0365 20.9325 18.8045 19.2545L15.688 16.6995C14.633 17.545 13.376 18 12 18C9.3735 18 7.1475 16.31 6.331 13.9615L3.0645 16.437C4.733 19.697 8.081 22 12 22Z" fill="#4CAF50" />
        <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.257 15.108 16.5725 16.073 15.689 16.6995L18.805 19.2545C20.7305 17.4815 21.874 14.9395 21.9905 12.181C21.996 11.4725 21.937 10.7485 21.8055 10.0415Z" fill="#1976D2" />
    </svg>
);

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle redirect result (when signInWithRedirect is used as fallback)
    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    console.log('Redirect sign-in successful');
                }
            })
            .catch((err) => {
                console.error('Redirect sign-in error:', err);
                setError(`Auth Error (${err.code}): ${err.message}`);
            });
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error('Popup sign-in error:', err.code, err.message);

            // If popup was blocked or closed, try redirect as fallback
            if (err.code === 'auth/popup-blocked' ||
                err.code === 'auth/popup-closed-by-user' ||
                err.code === 'auth/cancelled-popup-request') {
                console.log('Popup failed, trying redirect...');
                try {
                    await signInWithRedirect(auth, provider);
                    return; // Page will redirect, no need to setLoading(false)
                } catch (redirectErr) {
                    setError(`Redirect Auth Error (${redirectErr.code}): ${redirectErr.message}`);
                }
            } else if (err.code === 'auth/unauthorized-domain') {
                setError(`❌ This domain is not authorized in Firebase. Go to Firebase Console → Authentication → Settings → Authorized domains and add your Vercel domain.`);
            } else if (err.code === 'auth/invalid-api-key') {
                setError(`❌ Invalid Firebase API key. Check your environment variables on Vercel.`);
            } else if (err.code === 'auth/configuration-not-found' || !process.env.REACT_APP_FIREBASE_API_KEY) {
                setError(`❌ Firebase config is missing. Environment variables were not set at build time. Add them in Vercel Dashboard → Settings → Environment Variables, then REDEPLOY.`);
            } else {
                setError(`Auth Error (${err.code}): ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100dvh',
                width: '100vw',
                position: 'relative',
                background: 'transparent',
                padding: '1rem'
            }}>
                <motion.div
                    className="glass-card"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.25rem',
                        width: '100%',
                        maxWidth: '380px',
                        textAlign: 'center',
                        color: 'var(--text-main)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Subtle top highlight */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                    }} />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div style={{
                            width: '40px', height: '40px', background: 'white', borderRadius: '8px',
                            margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '-0.5px' }}>Save Your Reels</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}>Download high quality reels instantly</p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{ color: '#ef4444', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '6px', width: '100%' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        onClick={handleLogin}
                        disabled={loading}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,1)', color: 'black' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '14px 16px',
                            minHeight: '48px',
                            fontSize: '1rem',
                            fontWeight: 500,
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.08)',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            marginTop: '1rem'
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'block', width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid currentColor', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                        ) : (
                            <>
                                {googleIcon}
                                <span>Continue with Google</span>
                            </>
                        )}
                    </motion.button>

                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <p>Fast • Secure • High Quality</p>
                    </div>
                </motion.div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        </>
    );
};

export default Login;
