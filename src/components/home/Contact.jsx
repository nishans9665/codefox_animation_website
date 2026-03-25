import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contacts`, formData);
            toast.success('Your message has been sent successfully!');
            setFormData({ full_name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error) {
            const errMsgs = error.response?.data?.errors?.map(err => err.msg).join('\n') || 'Failed to send message. Please try again.';
            toast.error(errMsgs);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section contact-section" id="contact">
            <div className="container">
                <div className="section-header reveal">
                    <span className="subtitle">Contact Us</span>
                    <h2 className="section-title">Get In <span className="text-gradient">Touch</span></h2>
                    <p className="section-desc">
                        Have a project in mind? We'd love to hear about it. Let's discuss what we can achieve together.
                    </p>
                </div>

                <div className="contact-wrapper">
                    <div className="contact-info reveal" style={{ transitionDelay: '0.1s' }}>
                        <h3 className="contact-info-title">Contact Information</h3>
                        <p className="contact-info-desc">
                            Fill out the form and our team will get back to you within 24 hours.
                        </p>

                        <ul className="info-list">
                            <li className="info-item">
                                <div className="info-icon">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+94 772435591</p>
                                </div>
                            </li>

                            <li className="info-item">
                                <div className="info-icon">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <p>hello@codefoxit.com</p>
                                </div>
                            </li>

                            <li className="info-item">
                                <div className="info-icon">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4>Location</h4>
                                    <p>123 Tech Avenue, Silicon Valley, CA 94025</p>
                                </div>
                            </li>
                        </ul>

                        {/* Stylized geometric background shape instead of heavy iframe map */}
                        <div className="contact-info-shapes"></div>
                    </div>

                    <div className="contact-form-wrapper glass-panel reveal" style={{ transitionDelay: '0.2s' }}>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="full_name">Full Name *</label>
                                    <input type="text" id="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input type="email" id="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="tel" id="phone" placeholder="+94 772435591" value={formData.phone} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <input type="text" id="subject" placeholder="Project Inquiry" value={formData.subject} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea id="message" rows="5" placeholder="Tell us about your project..." value={formData.message} onChange={handleChange} required></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                                {loading ? (
                                    <>Sending... <Loader2 size={18} style={{ marginLeft: '8px' }} className="animate-spin" /></>
                                ) : (
                                    <>Send Message <Send size={18} style={{ marginLeft: '8px' }} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
