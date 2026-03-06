import React from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Portfolio from '../components/home/Portfolio';
import Contact from '../components/home/Contact';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Home = () => {
    useScrollReveal();

    return (
        <main>
            <Hero />
            <Services />
            <Portfolio />
            <Contact />
        </main>
    );
};

export default Home;
