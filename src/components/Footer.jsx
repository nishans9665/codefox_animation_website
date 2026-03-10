import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Footer.css';
import logoLight from '../assets/codefox-logo.png';
import logoDark from '../assets/codefox-write-logo.png';

const Footer = () => {
    const location = useLocation();
    const { isDarkMode } = useTheme();

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-col brand-col">
                        <Link to="/" className="logo-link" onClick={handleScrollToTop}>
                            <img src={isDarkMode ? logoDark : logoLight} alt="CodeFox IT" className="logo" style={{ height: '50px', width: 'auto', marginBottom: '8px' }} />
                        </Link>
                        <p className="footer-desc">
                            We build smart digital solutions, professional web, software & IT services to grow your business.
                            Based on cutting-edge technologies and modern design principles.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" className="social-link" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li>
                                {location.pathname === '/' ? (
                                    <a href="#services">Services</a>
                                ) : (
                                    <Link to="/#services">Services</Link>
                                )}
                            </li>
                            <li>
                                {location.pathname === '/' ? (
                                    <a href="#portfolio">Portfolio</a>
                                ) : (
                                    <Link to="/#portfolio">Portfolio</Link>
                                )}
                            </li>
                            <li><Link to="/about">About Us</Link></li>
                            <li>
                                <Link to="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div className="footer-col">
                        <h3 className="footer-title">Our Services</h3>
                        <ul className="footer-links">
                            <li><a href="#">Web Development</a></li>
                            <li><a href="#">Software Development</a></li>
                            <li><a href="#">UI/UX Design</a></li>
                            <li><a href="#">Mobile App Dev</a></li>
                            <li><a href="#">IT Consulting</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-col contact-col">
                        <h3 className="footer-title">Contact Info</h3>
                        <ul className="footer-contact-info">
                            <li>
                                <MapPin size={20} className="contact-icon" />
                                <span>123 Tech Avenue, Silicon Valley, CA 94025</span>
                            </li>
                            <li>
                                <Phone size={20} className="contact-icon" />
                                <span>+94 772435591</span>
                            </li>
                            <li>
                                <Mail size={20} className="contact-icon" />
                                <span>hello@codefoxit.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 CodeFox IT. All Rights Reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
