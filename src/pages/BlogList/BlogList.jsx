import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Tag } from 'lucide-react';
import themeStyles from './styles';
import { useStyles } from '../../hooks/useStyles';
import { blogService } from '../../services/blogService';

const BlogList = ({ type }) => {
    const styles = useStyles(themeStyles);
    const [searchQuery, setSearchQuery] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        blogService.getAllBlogs()
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const filteredBlogs = useMemo(() => {
        return blogs
            .filter(blog => blog.category === type)
            .filter(blog => {
                const query = searchQuery.toLowerCase();
                return (
                    blog.title?.toLowerCase().includes(query) ||
                    (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(query)))
                );
            });
    }, [blogs, type, searchQuery]);

    if (loading) return <div className={styles.blogListPage}><p style={{ textAlign: 'center', marginTop: '50px' }}>Loading Blogs...</p></div>;
    if (error) return <div className={styles.blogListPage}><p style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</p></div>;


    return (
        <div className={styles.blogListPage}>
            <header className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{type} Blog</h1>
                <p className={styles.pageDescription}>
                    Thoughts, tutorials, and snippets about {type === 'Tech' ? 'coding and software' : 'my personal journey'}.
                </p>

                <div className={`${styles.searchBar} glass-panel`}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by title or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchQuery && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => setSearchQuery('')}
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            <div className={styles.blogGrid}>
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map(blog => (
                        <Link to={`/blog/${blog.id}`} key={blog.id} className={`${styles.blogCard} glass-panel`}>
                            <div className={styles.blogDate}>{blog.date}</div>
                            <h3 className={styles.blogCardTitle}>{blog.title}</h3>
                            <p className={styles.blogSummary}>{blog.summary}</p>
                            <div className={styles.blogTags}>
                                {blog.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className={`glass-panel ${styles.blogCard} ${styles.placeholder}`}>
                        <h3>Coming Soon</h3>
                        <p>I'm currently busy writing some amazing content for you!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
