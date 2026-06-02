import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ArrowRight, User } from 'lucide-react';
import '../components/home/News.css';
import './BlogPage.css';

const fallbackNewsItems = [
    {
        id: 'fallback-1',
        title: "The Future of Web Development in 2026",
        content: "Discover the latest trends and technologies shaping the future of custom web and application development.",
        created_at: "2026-03-15T00:00:00Z",
        category: "Technology",
        slug: "future-web-dev",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 'fallback-2',
        title: "Why Your Business Needs a Custom E-commerce Solution",
        content: "Learn how a tailored Shopify or custom e-commerce platform can drastically increase your conversion rates.",
        created_at: "2026-03-02T00:00:00Z",
        category: "E-commerce",
        slug: "custom-ecommerce-solution",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 'fallback-3',
        title: "Maximizing ROI with Enterprise Software Systems",
        content: "Custom software development isn't just an expense; it's a strategic investment that streamlines operations.",
        created_at: "2026-02-18T00:00:00Z",
        category: "Software",
        slug: "maximize-roi",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
];

const BlogPage = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`${(import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}/api/posts`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setNewsItems(res.data);
                } else {
                    setNewsItems(fallbackNewsItems);
                }
            })
            .catch(err => {
                console.log('CRM Offline. Using default fallback posts.');
                setNewsItems(fallbackNewsItems);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const resolveImage = (imgSrc) => {
        if (!imgSrc) return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
        if (imgSrc.startsWith('http')) return imgSrc;
        return `${(import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))}${imgSrc}`; 
    };

    return (
        <div className="page blog-full-page">
            <section className="page-header" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
                <div className="container text-center">
                    <span className="subtitle animate-fade-in-up">News & Updates</span>
                    <h1 className="page-title animate-fade-in-up delay-1">Our <span className="text-gradient">Blog</span></h1>
                    <p className="page-desc animate-fade-in-up delay-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Explore all our articles, guides, and updates about the latest in tech and business.
                    </p>
                </div>
            </section>

            <section className="section blog-section" style={{ minHeight: '60vh' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading articles...</div>
                    ) : (
                        <div className="news-grid">
                            {newsItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="news-card glass-panel reveal"
                                    style={{ opacity: 1, transform: 'none', transitionDelay: `${(index % 3) * 0.15}s` }}
                                >
                                    <div className="news-image-wrapper">
                                        <div className="news-category">{item.category}</div>
                                        <img src={resolveImage(item.image)} alt={item.title} className="news-image" />
                                    </div>
                                    <div className="news-content">
                                        <div className="news-meta">
                                            <span><Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                            <span><User size={14} /> Admin</span>
                                        </div>
                                        <h3 className="news-title">
                                            <Link to={`/post/${item.slug}`}>{item.title}</Link>
                                        </h3>
                                        <p className="news-excerpt">
                                            {item.content ? item.content.replace(/<[^>]+>/g, '').substring(0, 110) + (item.content.replace(/<[^>]+>/g, '').length > 110 ? '...' : '') : 'No description provided.'}
                                        </p>
                                        <Link to={`/post/${item.slug}`} className="news-link">
                                            Read Article <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
