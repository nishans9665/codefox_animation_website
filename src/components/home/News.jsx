import React from 'react';
import { Calendar, ArrowRight, User } from 'lucide-react';
import './News.css';

const newsItems = [
    {
        id: 1,
        title: "The Future of Web Development in 2026",
        excerpt: "Discover the latest trends and technologies shaping the future of custom web and application development.",
        date: "March 15, 2026",
        author: "Tech Team",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "Why Your Business Needs a Custom E-commerce Solution",
        excerpt: "Learn how a tailored Shopify or custom e-commerce platform can drastically increase your conversion rates.",
        date: "March 02, 2026",
        author: "Digital Strategy",
        category: "E-commerce",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "Maximizing ROI with Enterprise Software Systems",
        excerpt: "Custom software development isn't just an expense; it's a strategic investment that streamlines operations.",
        date: "February 18, 2026",
        author: "System Arch",
        category: "Software",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
];

const News = () => {
    return (
        <section className="section news-section" id="news">
            <div className="container">
                <div className="section-header reveal">
                    <span className="subtitle">News & Updates</span>
                    <h2 className="section-title">Latest <span className="text-gradient">Insights</span></h2>
                    <p className="section-desc">
                        Stay updated with the latest trends in custom web development, e-commerce, and software solutions.
                    </p>
                </div>

                <div className="news-grid">
                    {newsItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="news-card glass-panel reveal"
                            style={{ transitionDelay: `${index * 0.15}s` }}
                        >
                            <div className="news-image-wrapper">
                                <div className="news-category">{item.category}</div>
                                <img src={item.image} alt={item.title} className="news-image" />
                            </div>
                            <div className="news-content">
                                <div className="news-meta">
                                    <span><Calendar size={14} /> {item.date}</span>
                                    <span><User size={14} /> {item.author}</span>
                                </div>
                                <h3 className="news-title">
                                    <a href="#">{item.title}</a>
                                </h3>
                                <p className="news-excerpt">{item.excerpt}</p>
                                <a href="#" className="news-link">
                                    Read Article <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default News;
