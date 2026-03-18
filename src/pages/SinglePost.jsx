import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, User, Tag, Loader } from 'lucide-react';
import './SinglePost.css';

const SinglePost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0); // Reset scroll position when loading a new post
        
        // Fetch exactly one post based on the slug URL
        axios.get(`http://localhost:5000/api/posts/article/${slug}`)
            .then(res => {
                setPost(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Sorry, we could not find this article. It may have been unpublished or deleted.');
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="single-post-page flex-center" style={{minHeight: '60vh'}}>
                <Loader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="single-post-page error-container">
                <div className="container" style={{textAlign: 'center', paddingTop: '100px', paddingBottom: '100px'}}>
                    <h2 className="mb-4">{error}</h2>
                    <Link to="/" className="btn btn-primary">Return to Homepage</Link>
                </div>
            </div>
        );
    }

    const imageUrl = post.image 
        ? (post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`)
        : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

    // Split text by newlines and create paragraphs cleanly.
    const textParagraphs = post.content ? post.content.split('\n').filter(p => p.trim() !== '') : [];

    return (
        <article className="single-post-page">
            <div className="post-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${imageUrl})` }}>
                <div className="container post-hero-container">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={16} style={{marginRight: '8px'}} /> Back to Home
                    </Link>
                    <span className="category-badge">{post.category}</span>
                    <h1 className="post-title reveal">{post.title}</h1>
                    <div className="post-meta reveal" style={{ transitionDelay: '0.1s' }}>
                        <span className="meta-item"><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="meta-item"><User size={16} /> CodeFox IT Team</span>
                        <span className="meta-item"><Tag size={16} /> CRM Published</span>
                    </div>
                </div>
            </div>

            <div className="container post-body-container">
                <div className="post-content glass-panel">
                    {textParagraphs.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default SinglePost;
