
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Notification = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const variants = {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    const accentColor = colors[type] || colors.info;

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                translateX: '-50%',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 16px',
                borderRadius: '8px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                zIndex: 1000,
                fontWeight: 500,
                maxWidth: 'calc(100vw - 2rem)',
                width: 'max-content',
                minWidth: 'min(280px, calc(100vw - 2rem))',
                justifyContent: 'center',
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
            }}
        >
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: accentColor,
                boxShadow: `0 0 10px ${accentColor}`
            }} />
            {message}
        </motion.div>
    );
};

export default Notification;
