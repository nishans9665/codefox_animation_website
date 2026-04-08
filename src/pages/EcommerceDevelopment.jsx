import React, { useEffect, useRef } from 'react';
import { 
    ShoppingCart, 
    ShieldCheck, 
    Zap, 
    BarChart3, 
    Smartphone, 
    Globe,
    CreditCard,
    Package,
    Users,
    CheckCircle2,
    TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './EcommerceDevelopment.css';

const GlobalStarfield = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const stars = Array.from({ length: 400 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            color: ['rgba(255, 255, 255, ', 'rgba(255, 123, 0, ', 'rgba(255, 165, 0, '][Math.floor(Math.random() * 3)]
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
                
                star.y -= 0.1;
                if(star.y < 0) star.y = height;
            });
            animId = requestAnimationFrame(render);
        };
        render(); 
        
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
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
                zIndex: -1,
                pointerEvents: 'none' 
            }} 
        />
    );
};

const EcommerceDevelopment = () => {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const coreServices = [
        {
            icon: <CreditCard size={30} />,
            title: 'Secure Payment Systems',
            desc: 'Integrating reliable payment gateways to provide customers with safe, encrypted, and smooth transaction processes.'
        },
        {
            icon: <TrendingUp size={30} />,
            title: 'Scalability for Growth',
            desc: 'Building platforms that adapt effortlessly to your growing business, adding products and handling high traffic spikes.'
        },
        {
            icon: <Package size={30} />,
            title: 'Inventory Management',
            desc: 'Incorporating advanced tools to efficiently track stock levels, monitor sales, and streamline your supply chain.'
        },
        {
            icon: <Users size={30} />,
            title: 'Customer Engagement',
            desc: 'Features like wish lists, personalized recommendations, and reward systems to boost customer loyalty.'
        }
    ];

    const ecommerceFunctions = [
        {
            title: "Product Catalog Management",
            desc: "Easily manage thousands of products with variant support (size, color, etc.), stock tracking, and bulk import/export capabilities."
        },
        {
            title: "Shopping Cart & Checkout",
            desc: "Optimized multi-step or single-page checkout processes designed to reduce cart abandonment and increase conversion rates."
        },
        {
            title: "Payment Gateway Integration",
            desc: "Full support for local and international payment methods including Credit Cards, PayPal, Stripe, and local bank transfers."
        },
        {
            title: "Order Tracking & Notifications",
            desc: "Automated email and SMS alerts for order confirmation, shipping updates, and delivery tracking for your customers."
        },
        {
            title: "Sales Analytics & Reporting",
            desc: "Deep insights into customer behavior, best-selling products, and revenue trends via an integrated dashboard."
        },
        {
            title: "Marketing & Discounts",
            desc: "Powerful coupon management, flash sales, and cross-selling features to drive more revenue from every visitor."
        }
    ];

    const industries = [
        "Fashion & Apparel", "Electronics", "Groceries & Food", "Beauty & Cosmetics", "Home & Decor", "B2B Wholesaling", "Jewelry", "Health & Wellness"
    ];

    return (
        <main className="ecommerce-page">
            <GlobalStarfield />
            
            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <span className="subtitle animate-fade-in">Grow Your Online Sales</span>
                    <h1 className="page-title animate-fade-in-up">
                        Expert <span className="text-gradient">eCommerce Development</span> Excellence
                    </h1>
                    <p className="page-desc animate-fade-in-up delay-1">
                        Building secure, scalable, and high-converting online stores that turn visitors 
                        into loyal customers. We specialize in custom B2B and B2C platforms.
                    </p>
                    <Link to="/contact" className="btn btn-primary animate-fade-in-up delay-2">Build Your Store</Link>
                </div>
            </section>

            {/* Core Services Grid */}
            <section className="section services-section">
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">What We Offer</span>
                        <h2 className="section-title">Comprehensive <span className="text-gradient">eCommerce Solutions</span></h2>
                    </div>

                    <div className="grid-4">
                        {coreServices.map((s, i) => (
                            <div className="service-box reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="service-icon-wrapper">
                                    {s.icon}
                                </div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow / Functions Description */}
            <section className="section workflow-section">
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">How It Works</span>
                        <h2 className="section-title">Core <span className="text-gradient">eCommerce Functions</span></h2>
                        <p className="section-desc mx-auto" style={{maxWidth: '700px'}}>
                            We integrate essential modules that simplify your business operations and provide a seamless shopping journey.
                        </p>
                    </div>

                    <div className="workflow-grid">
                        {ecommerceFunctions.map((fn, i) => (
                            <div className="workflow-item reveal" key={i}>
                                <div className="step-number">0{i+1}</div>
                                <div className="step-content">
                                    <h4>{fn.title}</h4>
                                    <p>{fn.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industries */}
            <section className="section industries-section">
                <div className="container">
                    <div className="section-header text-center reveal">
                        <span className="subtitle">Our Expertise</span>
                        <h2 className="section-title">Industries <span className="text-gradient">We Empower</span></h2>
                    </div>

                    <div className="industry-tags reveal">
                        {industries.map((tag, i) => (
                            <span className="industry-tag" key={i}>{tag}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="page-cta section">
                <div className="container">
                    <div className="cta-box reveal">
                        <h2>Your Digital Success <span className="text-gradient">Starts Here</span></h2>
                        <p>
                            We build eCommerce platforms that deliver exceptional user experiences, 
                            streamlined purchasing processes, and seamless integration, ensuring your business thrives online.
                        </p>
                        <Link to="/contact" className="btn btn-primary btn-lg">Discuss Your Store</Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default EcommerceDevelopment;
