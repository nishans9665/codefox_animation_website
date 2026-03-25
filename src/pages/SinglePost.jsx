import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, User, Tag, Loader, Heart, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './SinglePost.css';

const SinglePost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError('');
        window.scrollTo(0, 0); // Reset scroll position when loading a new post
        
        // Fetch exactly one post based on the slug URL
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/article/${slug}`)
            .then(res => {
                setPost(res.data);
                // After getting the post, fetch all posts
                return axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts`);
            })
            .then(res => {
                if (res && res.data) {
                    const filtered = res.data.filter(p => p.slug !== slug).slice(0, 4);
                    setRelatedPosts(filtered);
                }
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
        ? (post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${post.image}`)
        : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

    // Split text by newlines and create paragraphs cleanly.
    const textParagraphs = post.content ? post.content.split('\n').filter(p => p.trim() !== '') : [];

    const toggleLike = () => {
        setLiked(!liked);
        if (!liked) toast.success("You liked this post!");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: `Check out this post: ${post.title}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    return (
        <article className="single-post-page">
            <div className="post-hero">
                <div className="container post-hero-container">
                    <nav className="post-breadcrumbs">
                        <Link to="/" className="breadcrumb-link">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-link">{post.category || 'News'}</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">{post.title}</span>
                    </nav>
                    
                    <h1 className="post-title-simple">{post.title}</h1>
                    <p className="post-date-simple">
                        Last reviewed on {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="container post-body-container with-sidebar">
                <div className="post-main-column">
                    <div className="post-featured-image-wrapper glass-panel mb-4">
                        <img src={imageUrl} alt={post.title} className="post-featured-image" />
                    </div>

                    <div className="post-content glass-panel">
                        {textParagraphs.map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}

                        <div className="post-actions">
                            <button className={`action-btn like-btn ${liked ? 'liked' : ''}`} onClick={toggleLike}>
                                <Heart size={20} fill={liked ? 'currentColor' : 'none'} color={liked ? '#ef4444' : 'currentColor'} /> 
                                {liked ? 'Unlike' : 'Like'}
                            </button>
                            <button className="action-btn share-btn" onClick={handleShare}>
                                <Share2 size={20} /> Share
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="post-sidebar">
                    <div className="related-posts-widget glass-panel">
                        <h3 className="widget-title">Related Posts</h3>
                        <div className="related-posts-list">
                            {relatedPosts.length > 0 ? (
                                relatedPosts.map(rp => (
                                    <Link to={`/post/${rp.slug}`} key={rp.id} className="related-post-card">
                                        <div 
                                            className="rp-image" 
                                            style={{ backgroundImage: `url(${rp.image?.startsWith('http') ? rp.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${rp.image}`})` }}
                                        ></div>
                                        <div className="rp-content">
                                            <h4 className="rp-title">{rp.title}</h4>
                                            <span className="rp-date">{new Date(rp.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>No related posts found.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </article>
    );
};

export default SinglePost;
