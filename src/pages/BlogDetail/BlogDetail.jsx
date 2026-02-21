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
            </div>
        </div>
    );
};

export default BlogDetail;
