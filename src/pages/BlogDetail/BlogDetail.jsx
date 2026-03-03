import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import themeStyles from './styles';
import { useStyles } from '../../hooks/useStyles';
import { blogService } from '../../services/blogService';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const styles = useStyles(themeStyles);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        blogService.getBlogById(id)
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className={styles.blogDetailPage}><p style={{ textAlign: 'center', marginTop: '50px' }}>Loading Blog...</p></div>;
    if (error) return <div className={styles.blogDetailPage}><p style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</p></div>;

    if (!blog) {
        return (
            <div className={styles.blogDetailPage}>
                <h1>Post Not Found</h1>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={18} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className={styles.blogDetailPage}>
            <button onClick={() => navigate(-1)} className={styles.backBtn}>
                <ArrowLeft size={18} /> Back to Blog
            </button>

            <header className={styles.blogHeader}>
                {blog.thumbnail && (
                    <div className={styles.heroImageContainer}>
                        <img src={blog.thumbnail} alt={blog.title} className={styles.heroImage} />
                    </div>
                )}
                <div className={styles.blogMeta}>
                    <span><Calendar size={14} /> {blog.date}</span>
                    <span><User size={14} /> {blog.author}</span>
                    <span><Clock size={14} /> 5 min read</span>
                </div>
                <h1 className={styles.blogTitle}>{blog.title}</h1>
                <div className={styles.tagContainer}>
                    {blog.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                </div>
            </header>



            <div className={`${styles.blogContent} glass-panel`}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={atomDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        img({ node, ...props }) {
                            return (
                                <div className={styles.imageWrapper}>
                                    <img {...props} className={styles.blogImage} loading="lazy" />
                                    {props.alt && <span className={styles.imageCaption}>{props.alt}</span>}
                                </div>
                            );
                        },
                        a({ node, children, href, ...props }) {
                            let textContent = '';
                            if (typeof children === 'string') {
                                textContent = children;
                            } else if (Array.isArray(children)) {
                                textContent = children.find(c => typeof c === 'string') || '';
                            }
                            const label = textContent.trim().toLowerCase();

                            if (label === 'video') {
                                return (
                                    <div className={styles.videoWrapper}>
                                        <iframe
                                            className={styles.videoFrame}
                                            src={href}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                );
                            }
                            return <a href={href} {...props}>{children}</a>;
                        }
                    }}
                >
                    {blog.content}
                </ReactMarkdown>

                {/* Social Sharing Section */}
                <div className={styles.shareSection}>
                    <h3 className={styles.shareTitle}>Share this post</h3>
                    <div className={styles.shareButtons}>
                        <button
                            className={`${styles.shareBtn} ${styles.twitterBtn}`}
                            onClick={() => {
                                const shareUrl = `${window.location.origin.replace('5173', '5000')}/blog/${blog.id}`;
                                // Better: Use a relative path if possible, but social shares need absolute.
                                // We can construct it from the current script source or a config.
                                const absoluteShareUrl = `${window.location.protocol}//${window.location.host.includes('localhost') ? 'localhost:5000' : window.location.host}/blog/${blog.id}`;

                                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(absoluteShareUrl)}`;
                                window.open(twitterUrl, '_blank');
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            Twitter
                        </button>
                        <button
                            className={`${styles.shareBtn} ${styles.linkedinBtn}`}
                            onClick={() => {
                                const absoluteShareUrl = `${window.location.protocol}//${window.location.host.includes('localhost') ? 'localhost:5000' : window.location.host}/blog/${blog.id}`;
                                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteShareUrl)}`;
                                window.open(linkedinUrl, '_blank');
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            LinkedIn
                        </button>
                        <button
                            className={`${styles.shareBtn} ${styles.linkBtn}`}
                            onClick={() => {
                                const absoluteShareUrl = `${window.location.protocol}//${window.location.host.includes('localhost') ? 'localhost:5000' : window.location.host}/blog/${blog.id}`;
                                navigator.clipboard.writeText(absoluteShareUrl);
                                alert('Share link copied to clipboard!');
                            }}
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
