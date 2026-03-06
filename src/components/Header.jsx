import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoLight from '../assets/codefox-logo.png';
import logoDark from '../assets/codefox-write-logo.png';
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle cross-page hash routing
    useEffect(() => {
        if (location.hash) {
            let elem = document.getElementById(location.hash.slice(1));
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
            } else {
                // If element not immediately found, try after a short delay
                setTimeout(() => {
                    elem = document.getElementById(location.hash.slice(1));
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/#services' },
        { name: 'Portfolio', path: '/#portfolio' },
        { name: 'About Us', path: '/about' },
    ];

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <Link to="/" className="logo-link" onClick={closeMenu}>
                    <img src={isDarkMode ? logoDark : logoLight} alt="CodeFox IT" className="logo" style={{ height: '50px', width: 'auto' }} />
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav">
                    <ul className="nav-list">
                        {navLinks.map((link, idx) => (
                            <li key={idx}>
                                {link.path.startsWith('/#') && location.pathname === '/' ? (
                                    <a href={link.path.substring(1)} className="nav-link">
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link to={link.path} className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}>
                                        {link.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="/#contact" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                        Contact Us
                    </Link>
                </nav>

                {/* Mobile actions container */}
                <div className="mobile-actions">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="mobile-nav-list">
                        {navLinks.map((link, idx) => (
                            <li key={idx}>
                                <Link to={link.path} className="mobile-nav-link" onClick={closeMenu}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link to="/#contact" className="btn btn-primary mobile-btn" onClick={closeMenu}>
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
