import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, ExternalLink, Eye, EyeOff } from 'lucide-react';
import themeStyles from './styles';
import { useStyles } from '../../../hooks/useStyles';
import { blogService } from '../../../services/blogService';

const PostManagement = () => {
    const styles = useStyles(themeStyles);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBlogs = () => {
        setLoading(true);
        blogService.getAllBlogsAdmin()
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load blogs", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await blogService.deleteBlog(id);
                setBlogs(blogs.filter(blog => blog.id !== id));
            } catch (error) {
                alert('Failed to delete post: ' + error.message);
            }
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            const updatedBlog = await blogService.toggleVisibility(id);
            setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog));
        } catch (error) {
            alert('Failed to toggle visibility: ' + error.message);
        }
    };

    return (
        <div className={styles.managementPage}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <Link to="/admin/dashboard" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1>Manage Posts</h1>
                    <p>Total posts: {blogs.length}</p>
                </div>
                <Link to="/admin/create" className={styles.createBtn}>
                    <Plus size={18} /> New Post
                </Link>
            </header>

            <div className={`${styles.tableContainer} glass-panel`}>
                <table className={styles.postTable}>
                    <thead>
                        <tr>
                            <th>Title & Date</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.length > 0 ? (
                            blogs.map((blog) => (
                                <tr key={blog.id} className={styles.postRow}>
                                    <td>
                                        <span className={styles.postTitle}>{blog.title}</span>
                                        <span className={styles.postMeta}>{blog.date} • {blog.author}</span>
                                    </td>
                                    <td>
                                        <span className={`${styles.categoryBadge} ${blog.category === 'Tech' ? styles.categoryTech : styles.categoryPersonal}`}>
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${blog.isVisible !== false ? styles.statusVisible : styles.statusHidden}`}>
                                            {blog.isVisible !== false ? 'Visible' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link to={`/blog/${blog.id}`} target="_blank" className={styles.actionBtn}>
                                                <ExternalLink size={16} />
                                            </Link>
                                            <Link to={`/admin/edit/${blog.id}`} className={`${styles.actionBtn} ${styles.editBtn}`}>
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleToggleVisibility(blog.id)}
                                                className={`${styles.actionBtn} ${blog.isVisible !== false ? styles.visibleBtn : styles.hiddenBtn}`}
                                                title={blog.isVisible !== false ? "Hide Post" : "Show Post"}
                                            >
                                                {blog.isVisible !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className={styles.emptyState}>No posts found. Start by creating one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostManagement;
