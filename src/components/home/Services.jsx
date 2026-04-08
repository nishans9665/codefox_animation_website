import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Code, Layout, Gauge, ShieldCheck, ShoppingCart, PenTool } from 'lucide-react';
import './Services.css';

const services = [
    {
        icon: <Monitor size={32} />,
        title: 'Web Development',
        description: 'We build fast, responsive, and fully customized web applications tailored to your business needs.',
        delay: '0s',
        link: '/services/custom-web-development'
    },
    {
        icon: <Code size={32} />,
        title: 'Software Solutions',
        description: 'Custom software development, POS implementations, and complete CRM tools to accelerate your enterprise.',
        delay: '0.1s',
        link: '/software-solutions'
    },
    {
        icon: <PenTool size={32} />,
        title: 'UI/UX & Graphic Design',
        description: 'Stunning user interfaces, print-ready brochures, flyers, and engaging marketing posts to elevate your brand.',
        delay: '0.2s',
        link: '/ui-ux-design'
    },
    {
        icon: <Gauge size={32} />,
        title: 'Web Optimization',
        description: 'Boost website performance, speed, and search visibility to drive better user experience and conversions.',
        delay: '0.3s',
        link: '/services/web-optimization'
    },
    {
        icon: <ShieldCheck size={32} />,
        title: 'IT Consulting',
        description: 'Strategic IT consulting to optimize your infrastructure and align technology with business goals.',
        delay: '0.4s',
        link: '/software-solutions'
    },
    {
        icon: <ShoppingCart size={32} />,
        title: 'E-commerce Solutions',
        description: 'Secure, scalable e-commerce platforms designed to maximize sales and streamline management.',
        delay: '0.5s',
        link: '/services/ecommerce-development'
    }
];

const Services = () => {
    return (
        <section className="section services-section" id="services">
            <div className="container">
                <div className="section-header reveal">
                    <span className="subtitle">What We Do</span>
                    <h2 className="section-title">Our <span className="text-gradient">Services</span></h2>
                    <p className="section-desc">
                        We offer comprehensive technology solutions to help your business thrive in the digital landscape.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, idx) => (
                        <div
                            className="service-card reveal glass-panel"
                            key={idx}
                            style={{ transitionDelay: service.delay }}
                        >
                            <div className="service-icon-wrapper">
                                {service.icon}
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-desc">{service.description}</p>
                            {service.link.startsWith('/') ? (
                                <Link to={service.link} className="service-link">
                                    Learn More <span className="arrow">→</span>
                                </Link>
                            ) : (
                                <a href={service.link} className="service-link">
                                    Learn More <span className="arrow">→</span>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
