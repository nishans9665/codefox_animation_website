import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import ctaBg from '../../assets/cta-section-bg-image.png';
import rocketImg from '../../assets/view-3d-space-rocket-model.webp';
import astronautImg from '../../assets/Space man astronaut flying.png';
import './CTA.css';

const CTA = () => {
    return (
        <section className="cta-section" id="cta" style={{ backgroundImage: `url(${ctaBg})` }}>
            <div className="cta-overlay"></div>
            <div className="cta-stars-bg"></div>

            {/* Decorative Stars matching the image vibe */}
            <Sparkles className="cta-sparkle s1" size={24} color="#FF7B00" fill="#FF7B00" />
            <Sparkles className="cta-sparkle s2" size={16} color="#a78bfa" fill="#a78bfa" />
            <Sparkles className="cta-sparkle s3" size={20} color="#FF7B00" fill="#FF7B00" />
            <Sparkles className="cta-sparkle s4" size={14} color="#3b82f6" fill="#3b82f6" />
            <Sparkles className="cta-sparkle s5" size={18} color="#FF7B00" fill="#FF7B00" />

            <div className="container relative z-10 cta-container">
                <div className="cta-content reveal">
                    <h3 className="cta-title">Ready to Get<br />Started?</h3>
                    <br />
                    <Link to="/contact" className="btn btn-primary cta-btn">
                        Discuss a Project
                    </Link>
                </div>
            </div>

            <div className="cta-rocket-wrapper delay-2">
                <img
                    src={rocketImg}
                    alt="Rocket"
                    className="cta-rocket-img"
                />
            </div>

            <div className="cta-astronaut-wrapper delay-1">
                <img
                    src={astronautImg}
                    alt="Astronaut"
                    className="cta-astronaut-img"
                />
            </div>
        </section>
    );
};

export default CTA;
