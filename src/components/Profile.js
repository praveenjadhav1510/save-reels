import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { storage, ref, uploadBytes, getDownloadURL, updateProfile } from '../firebase';
import { User, Calendar, Clock, Key, Shield, Smartphone, Mail, AlertCircle, Copy, Check, Camera } from 'lucide-react';

const Profile = ({ user, showNotification }) => {
    const [uploading, setUploading] = useState(false);
    const [photoURL, setPhotoURL] = useState(user?.photoURL);
    // Notification state is now managed by parent Dashboard or we can use local if needed,
    // but the prop 'showNotification' was passed in previous dashboard code so we use that or fallback.
    // The previous code had local notification state, but the Dashboard passes showNotification.
    // I'll use the prop if available, or just log for now to match the user's request for design focus.
    // Actually, looking at Dashboard.js, it passes showNotification. I will use it.

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `users/${user.uid}/profile_${Date.now()}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            await updateProfile(user, { photoURL: url });
            setPhotoURL(url);
            showNotification && showNotification("Profile updated", "success");
        } catch (error) {
            console.error("Error uploading image: ", error);
            showNotification && showNotification("Upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            paddingBottom: '2rem'
        }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}
            >
                {/* 1. Identity Card */}
                <SectionCard title="Identity" icon={<User size={20} />} delay={0.1}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden',
                                border: '4px solid rgba(255,255,255,0.1)', cursor: 'pointer'
                            }}>
                                <img
                                    src={photoURL || "https://via.placeholder.com/100"}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <label htmlFor="profile-upload" style={{
                                position: 'absolute', bottom: 0, right: 0, background: 'white',
                                borderRadius: '50%', padding: '6px', cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Camera size={16} color="black" />
                            </label>
                            <input id="profile-upload" type="file" style={{ display: 'none' }} onChange={handleImageChange} disabled={uploading} />
                            {uploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%' }} />}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>{user.displayName || 'Anonymous'}</h3>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{user.email}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <InfoRow label="UID" value={user.uid} copyable icon={<Shield size={16} />} />
                        <InfoRow label="Email Verified" value={user.emailVerified ? 'Yes' : 'No'} type={user.emailVerified ? 'success' : 'warning'} icon={<Mail size={16} />} />
                        <InfoRow label="Phone Number" value={user.phoneNumber || 'Not linked'} icon={<Smartphone size={16} />} />
                        <InfoRow label="Anonymous" value={user.isAnonymous ? 'Yes' : 'No'} icon={<AlertCircle size={16} />} />
                    </div>
                </SectionCard>

                {/* 2. Account Dates */}
                <SectionCard title="Account Dates" icon={<Calendar size={20} />} delay={0.2}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <DateBox label="Account Created" date={user.metadata.creationTime} icon={<Clock size={16} />} />
                        <DateBox label="Last Login" date={user.metadata.lastSignInTime} icon={<Clock size={16} />} />
                    </div>
                </SectionCard>

                {/* 3. Login Info */}
                <SectionCard title="Login Information" icon={<Key size={20} />} delay={0.3}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {user.providerData.map((provider, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <ProviderIcon providerId={provider.providerId} />
                                    <span style={{ fontWeight: 600, color: 'white' }}>{getProviderName(provider.providerId)}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'grid', gap: '4px' }}>
                                    <div><span style={{ opacity: 0.6 }}>ID:</span> {provider.uid}</div>
                                    {provider.email && <div><span style={{ opacity: 0.6 }}>Email:</span> {provider.email}</div>}
                                    {provider.phoneNumber && <div><span style={{ opacity: 0.6 }}>Phone:</span> {provider.phoneNumber}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </motion.div>
        </div>
    );
};

const SectionCard = ({ title, icon, children, delay }) => (
    <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', height: 'fit-content' }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'white', display: 'flex' }}>{icon}</span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>
                {title}
            </h2>
        </div>
        {children}
    </motion.div>
);

const InfoRow = ({ label, value, copyable, type, icon }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        // Toast logic could go here
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', flexShrink: 0 }}>
                {icon}
                <span>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                    color: type === 'success' ? '#4ade80' : type === 'warning' ? '#fbbf24' : 'white',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    maxWidth: 'min(150px, 40vw)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-all'
                }}>
                    {value}
                </span>
                {copyable && (
                    <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(255,255,255,0.3)', display: 'flex' }} title="Copy">
                        <Copy size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

const DateBox = ({ label, date, icon }) => (
    <div style={{
        padding: '1rem',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {icon}
            {label}
        </div>
        <div style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
            {new Date(date).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
            })}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
            {new Date(date).toLocaleTimeString(undefined, {
                hour: '2-digit', minute: '2-digit'
            })}
        </div>
    </div>
);

const getProviderName = (providerId) => {
    switch (providerId) {
        case 'google.com': return 'Google';
        case 'password': return 'Email/Password';
        case 'github.com': return 'GitHub';
        case 'phone': return 'Phone';
        default: return providerId;
    }
};

const ProviderIcon = ({ providerId }) => {
    // Simple icon mapping
    if (providerId === 'google.com') {
        return (
            <div style={{ width: 24, height: 24, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.905 6.574 15.963 7.5095L18.7855 4.687C17.017 3.0405 14.6365 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#4285F4" />
                </svg>
            </div>
        );
    }
    return (
        <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
        </div>
    );
};

export default Profile;
