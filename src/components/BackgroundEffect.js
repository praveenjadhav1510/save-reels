
import React, { useEffect, useRef } from 'react';

const BackgroundEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: -1000, y: -1000 };

        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createParticles();
        };

        const createParticles = () => {
            particles = [];
            const gap = 30; // Distance between pixels
            const rows = Math.floor(height / gap);
            const cols = Math.floor(width / gap);

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    particles.push({
                        x: x * gap + gap / 2,
                        y: y * gap + gap / 2,
                        originX: x * gap + gap / 2,
                        originY: y * gap + gap / 2,
                        size: 1.5,
                        color: 'rgba(0, 0, 0, 0.1)', // Light grey for static
                        activeColor: 'rgba(0, 0, 0, 0.8)', // Dark/Black for active
                        vx: 0,
                        vy: 0,
                        force: 0,
                        angle: 0,
                        distance: 0
                    });
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Calculate distance from mouse
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 230;

                // Radiation effect logic
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);

                    // Push particles away slightly to create ripple/radiation feel
                    const moveForce = force * 2;
                    p.vx -= Math.cos(angle) * moveForce;
                    p.vy -= Math.sin(angle) * moveForce;

                    ctx.fillStyle = p.activeColor;
                    p.size = 2.5 + force * 2; // Grow when active
                } else {
                    ctx.fillStyle = p.color;
                    p.size = 1.5;
                }

                // Return to origin (spring)
                p.vx += (p.originX - p.x) * 0.1;
                p.vy += (p.originY - p.y) * 0.1;

                // Friction
                p.vx *= 0.8;
                p.vy *= 0.8;

                p.x += p.vx;
                p.y += p.vy;

                ctx.beginPath();
                // Draw as squares for "pixel" look
                ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                ctx.fill();
            }

            requestAnimationFrame(draw);
        };

        const handleResize = () => init();
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                background: '#ffffff', // White background
                pointerEvents: 'none'
            }}
        />
    );
};

export default BackgroundEffect;
