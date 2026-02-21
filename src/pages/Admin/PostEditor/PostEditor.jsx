import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Code, HelpCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import themeStyles from './styles';
import { useStyles } from '../../../hooks/useStyles';
import { blogService } from '../../../services/blogService';

const PostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const styles = useStyles(themeStyles);
    const isEdit = Boolean(id);
    const [showHelp, setShowHelp] = useState(false);



    const [post, setPost] = useState({
        title: '',
        summary: '',
        content: '',
        category: 'Tech',
        tags: '',
        author: 'Peter',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    useEffect(() => {
        if (isEdit) {
            blogService.getBlogById(id)
                .then(existingPost => {
                    if (existingPost) {
                        setPost({
                            ...existingPost,
                            tags: Array.isArray(existingPost.tags) ? existingPost.tags.join(', ') : existingPost.tags
                        });
                    }
                })
                .catch(console.error);
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const postData = {
            ...post,
            tags: typeof post.tags === 'string' ? post.tags.split(',').map(tag => tag.trim()).filter(Boolean) : post.tags
        };

        try {
            if (isEdit) {
                await blogService.updateBlog(id, postData);
                alert('Post updated successfully!');
            } else {
                await blogService.createBlog(postData);
                alert('Post created successfully!');
            }
            navigate('/admin/posts');
        } catch (error) {
            alert('Failed to save post: ' + error.message);
        }
    };

    return (
        <div className={styles.editorPage}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <Link to="/admin/posts" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Management
                    </Link>
                    <h1>{isEdit ? 'Edit Post' : 'Create New Post'}</h1>
                </div>
                <div className={styles.headerActions}>
                    <button onClick={() => setShowHelp(true)} className={styles.helpToggleBtn}>
                        <HelpCircle size={18} /> syntax Help
                    </button>
                    <button onClick={handleSave} className={styles.saveBtn}>
                        <Save size={18} /> Save Post
                    </button>
                </div>
            </header>

            <div className={styles.editorMain}>
                <form className={`${styles.formPanel} glass-panel`} onSubmit={handleSave}>
                    <div className={styles.fieldGroup}>
                        <label>Post Title</label>
                        <input
                            type="text"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Enter catchy title..."
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.fieldGroup}>
                            <label>Category</label>
                            <select
                                name="category"
                                value={post.category}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="Tech">Tech</option>
                                <option value="Personal">Personal</option>
                            </select>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label>Tags (comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={post.tags}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="react, design, glass..."
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Summary</label>
                        <textarea
                            name="summary"
                            value={post.summary}
                            onChange={handleChange}
                            className={styles.textarea}
                            style={{ minHeight: '80px' }}
                            placeholder="Briefly describe the post..."
                        />
                    </div>

                    <div className={`${styles.fieldGroup} ${styles.contentGroup}`}>
                        <label>Content (Markdown)</label>
                        <textarea
                            name="content"
                            value={post.content}
                            onChange={handleChange}
                            className={styles.textarea}
                            placeholder="Write your markdown here..."
                            required
                        />
                    </div>
                </form>

                <div className={`${styles.previewPanel} glass-panel`}>
                    <div className={styles.previewTitle}>Live Preview</div>
                    <div className={styles.markdownContent}>
                        <h1>{post.title || 'Post Title'}</h1>
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
                                    )
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
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
            {/* Markdown Help Drawer */}
            <div className={`${styles.helpPanel} ${showHelp ? styles.helpPanelActive : ''}`}>
                <div className={styles.helpHeader}>
                    <h2>Markdown Guide</h2>
                    <button onClick={() => setShowHelp(false)} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.guideSection}>
                    <h3>Basic Formatting</h3>
                    <div className={styles.guideGrid}>
                        <div className={styles.guideItem}><span className={styles.syntax}># H1</span><span className={styles.result}>Main Heading</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>## H2</span><span className={styles.result}>Sub Heading</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>### H3</span><span className={styles.result}>Section</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>**bold**</span><span className={styles.result}>Emphasis</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>*italic*</span><span className={styles.result}>Emphasis</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>~~strike~~</span><span className={styles.result}>Strikethrough</span></div>
                    </div>
                </div>

                <div className={styles.guideSection}>
                    <h3>Lists & Blocks</h3>
                    <div className={styles.guideGrid}>
                        <div className={styles.guideItem}><span className={styles.syntax}>- item</span><span className={styles.result}>Bullet List</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>1. item</span><span className={styles.result}>Numbered List</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>- [ ] todo</span><span className={styles.result}>Checklist</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>&gt; quote</span><span className={styles.result}>Blockquote</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>---</span><span className={styles.result}>Horizontal Rule</span></div>
                    </div>
                </div>

                <div className={styles.guideSection}>
                    <h3>Links & Media</h3>
                    <div className={styles.guideGrid}>
                        <div className={styles.guideItem}><span className={styles.syntax}>[text](url)</span><span className={styles.result}>Hyperlink</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>![alt](url)</span><span className={styles.result}>Image</span></div>
                    </div>
                </div>

                <div className={styles.guideSection}>
                    <h3>Code & Data</h3>
                    <div className={styles.guideGrid}>
                        <div className={styles.guideItem}><span className={styles.syntax}>`code`</span><span className={styles.result}>Inline Code</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>```js ... ```</span><span className={styles.result}>Code Block</span></div>
                        <div className={styles.guideItem}><span className={styles.syntax}>| Table |</span><span className={styles.result}>Grid/Data</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostEditor;
