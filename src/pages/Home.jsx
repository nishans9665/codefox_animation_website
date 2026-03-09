import React from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Portfolio from '../components/home/Portfolio';
import News from '../components/home/News';
import CTA from '../components/home/CTA';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Home = () => {
    useScrollReveal();

    return (
        <main>
            <Hero />
            <Services />
            <Portfolio />
            <News />
            <CTA />
        </main>
    );
};

export default Home;
