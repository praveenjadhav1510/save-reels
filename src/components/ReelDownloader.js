
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReelDownloader = ({ showNotification }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoData, setVideoData] = useState(null);

    const handleFetch = async () => {
        if (!url) {
            showNotification("Please paste a valid Instagram link", "error");
            return;
        }
        if (!url.includes("instagram.com")) {
            showNotification("That doesn't look like an Instagram link", "error");
            return;
        }

        setLoading(true);
        setVideoData(null);

        try {
            const response = await fetch(`/api/reel?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch video');
            }

            setVideoData({
                thumbnail: data.thumbnail,
                videoUrl: data.videoUrl,
                caption: data.caption
            });
            showNotification("Video fetched successfully", "success");
        } catch (error) {
            console.error(error);
            showNotification(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!videoData) return;
        const link = document.createElement('a');
        link.href = videoData.videoUrl;
        link.download = 'InstaReel.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification("Download started", "success");
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            <motion.div
                className="glass-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ padding: 'clamp(1.25rem, 4vw, 2rem)' }}
            >
                <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center' }}>
                    Download Reels
                </h2>

                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Paste Instagram Reel link..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'clamp(12px, 3vw, 16px) clamp(14px, 3vw, 20px)',
                                paddingRight: '50px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                                outline: 'none',
                                transition: 'border 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        </div>
                    </div>

                    <motion.button
                        onClick={handleFetch}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: '100%',
                            padding: 'clamp(12px, 3vw, 16px)',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'white',
                            color: 'black',
                            fontWeight: 600,
                            fontSize: '1rem',
                            marginTop: '0.5rem',
                            cursor: loading ? 'wait' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Fetching Video...' : 'Get Video'}
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence>
                {videoData && (
                    <motion.div
                        className="glass-card"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
                            <div style={{
                                width: '100%',
                                aspectRatio: '9/16',
                                maxHeight: '60vh',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '1.5rem',
                                position: 'relative',
                                background: 'black'
                            }}>
                                <video
                                    src={videoData.videoUrl}
                                    controls
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    poster={videoData.thumbnail}
                                />
                            </div>

                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                {videoData.caption}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.75rem' }}>
                                <a
                                    href={videoData.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        padding: '12px', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none',
                                        border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500, fontSize: '0.9rem'
                                    }}
                                >
                                    <span>Open Tab</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </a>
                                <button
                                    onClick={handleDownload}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        padding: '12px', borderRadius: '10px',
                                        background: 'white', color: 'black', border: 'none',
                                        fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer'
                                    }}
                                >
                                    <span>Download</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReelDownloader;
