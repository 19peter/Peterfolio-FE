import { LayoutDashboard, FilePlus, Settings, LogOut, FileText, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import themeStyles from './styles';
import { useStyles } from '../../../hooks/useStyles';
import { blogService } from '../../../services/blogService';

const AdminDashboard = () => {
    const styles = useStyles(themeStyles);
    const { logout } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        blogService.getAllBlogs()
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard failed to load blogs", err);
                setLoading(false);
            });
    }, []);

    const stats = [
        { label: 'Total Posts', value: blogs.length },
        { label: 'Total Views', value: '1,234' }, // Views feature left to implement later
        { label: 'Tech Logs', value: blogs.filter(b => b.category === 'Tech').length },
    ];

    return (
        <div className={styles.dashboardPage}>
            <header className={styles.dashboardHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.pageDescription}>Welcome back, Admin</p>
                </div>
                <button onClick={logout} className={styles.logoutBtn}>
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div className={styles.statsGrid}>
                {stats.map(stat => (
                    <div key={stat.label} className={`${styles.statCard} glass-panel`}>
                        <span className={styles.statValue}>{stat.value}</span>
                        <span className={stat.statLabel}>{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className={styles.actionGrid}>
                <Link to="/admin/create" className={`${styles.actionCard} glass-panel`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.iconWrapper}><FilePlus size={24} /></div>
                    <h3>Create New Post</h3>
                    <p>Draft a new technical or personal blog post.</p>
                </Link>
                <Link to="/admin/posts" className={`${styles.actionCard} glass-panel`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.iconWrapper}><FileText size={24} /></div>
                    <h3>Manage Posts</h3>
                    <p>Edit, update, or delete your existing content.</p>
                </Link>
                <Link to="/admin/cv" className={`${styles.actionCard} glass-panel`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.iconWrapper}><FileCode size={24} /></div>
                    <h3>Manage CV</h3>
                    <p>Update your nested CV document structure.</p>
                </Link>
                <div className={`${styles.actionCard} glass-panel`}>
                    <div className={styles.iconWrapper}><Settings size={24} /></div>
                    <h3>Site Settings</h3>
                    <p>Configure themes, metadata, and site global state.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
