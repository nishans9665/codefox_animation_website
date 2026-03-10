import React, { useEffect } from 'react';
import Contact from '../components/home/Contact';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ContactUs = () => {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="contact-page" style={{ paddingTop: '100px' }}>
            {/* Page Header */}
            <section className="page-header" style={{ paddingBottom: '2rem' }}>
                <div className="container">
                    <h1 className="page-title animate-fade-in-up">Contact <span className="text-gradient">Us</span></h1>
                    <p className="page-desc animate-fade-in-up delay-1">
                        We're here to help and answer any question you might have. We look forward to hearing from you.
                    </p>
                </div>
            </section>

            {/* Reusing the Contact component */}
            <Contact />
        </main>
    );
};

export default ContactUs;
