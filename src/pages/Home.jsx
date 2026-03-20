import React, { useEffect, useRef } from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Portfolio from '../components/home/Portfolio';
import News from '../components/home/News';
import CTA from '../components/home/CTA';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Global Starfield for the ENTIRE Homepage to give it a constant space look
const GlobalStarfield = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight; // Use window size for fixed background
        
        const stars = Array.from({ length: 400 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            color: ['rgba(255, 255, 255, ', 'rgba(255, 165, 0, ', 'rgba(255, 140, 0, '][Math.floor(Math.random() * 3)]
        }));

        let animId;
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => {
                star.alpha += (Math.random() - 0.5) * 0.05;
                if (star.alpha <= 0) star.alpha = 0;
                if (star.alpha >= 1) star.alpha = 1;
                
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${star.color}${star.alpha * 0.8})`; 
                ctx.fill();
                
                // Slow drift for space feel
                star.y -= 0.1;
                if(star.y < 0) star.y = height;
            });
            animId = requestAnimationFrame(render);
        };
        render(); 
        
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                zIndex: -1, // Sits permanently behind everything
                pointerEvents: 'none' 
            }} 
        />
    );
};

const Home = () => {
    useScrollReveal();

    return (
        <main style={{ position: 'relative' }}>
            <GlobalStarfield />
            <div style={{ position: 'relative', zIndex: 1, background: 'transparent' }}>
                <Hero />
                <Services />
                <Portfolio />
                <News />
                <CTA />
            </div>
        </main>
    );
};

export default Home;
