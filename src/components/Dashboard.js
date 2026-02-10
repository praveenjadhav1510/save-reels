
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from '../firebase';
import { auth } from '../firebase';
import Profile from './Profile';
import ReelDownloader from './ReelDownloader';
import Notification from './Notification';

const useIsMobile = (breakpoint = 600) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        setIsMobile(mq.matches);
        return () => mq.removeEventListener('change', handler);
    }, [breakpoint]);
    return isMobile;
};

const Dashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('downloader');
    const [notification, setNotification] = useState(null);
    const isMobile = useIsMobile();

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
    };

    const handleLogout = () => {
        signOut(auth).catch((error) => console.error("Sign out error", error));
    };

    const variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    return (
        <div style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1
        }}>
            <AnimatePresence>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: isMobile ? '1rem' : '1.5rem 2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255,255,255,0.8)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    gap: isMobile ? '0.5rem' : '1rem'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <div style={{ width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px', background: 'black', borderRadius: '6px' }} />
                    <span style={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.2rem', letterSpacing: '-0.5px' }}>SaveReels</span>
                </div>

                <div style={{ display: 'flex', gap: isMobile ? '1rem' : '2rem', alignItems: 'center' }}>
                    <TabButton
                        active={activeTab === 'downloader'}
                        onClick={() => setActiveTab('downloader')}
                        label={isMobile ? 'Download' : 'Downloader'}
                        isMobile={isMobile}
                    />
                    <TabButton
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                        label="Profile"
                        isMobile={isMobile}
                    />
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: isMobile ? '6px 12px' : '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: 'transparent',
                        fontSize: isMobile ? '0.75rem' : '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                    }}
                >
                    Log Out
                </button>
            </motion.nav>

            {/* Content Area */}
            <main style={{ flex: 1, padding: isMobile ? '1rem' : '2rem', display: 'flex', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'downloader' ? (
                        <motion.div
                            key="downloader"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{ width: '100%', maxWidth: '800px' }}
                        >
                            <ReelDownloader showNotification={showNotification} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="profile"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{ width: '100%' }}
                        >
                            <Profile user={user} showNotification={showNotification} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const TabButton = ({ active, onClick, label, isMobile }) => (
    <button
        onClick={onClick}
        style={{
            background: 'none',
            border: 'none',
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            fontWeight: active ? 600 : 500,
            color: active ? 'black' : 'rgba(0,0,0,0.5)',
            cursor: 'pointer',
            padding: '8px 0',
            position: 'relative',
            whiteSpace: 'nowrap'
        }}
    >
        {label}
        {active && (
            <motion.div
                layoutId="underline"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'black',
                    borderRadius: '2px'
                }}
            />
        )}
    </button>
);

export default Dashboard;
