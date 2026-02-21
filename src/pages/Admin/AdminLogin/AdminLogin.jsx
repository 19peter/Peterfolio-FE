import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import themeStyles from './styles';
import { useStyles } from '../../../hooks/useStyles';

const AdminLogin = () => {
    const styles = useStyles(themeStyles);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(username, password);
        if (success) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid credentials.');
        }
        setLoading(false);
    };

    return (
        <div className={styles.loginPage}>
            <div className={`${styles.loginCard} glass-panel`}>
                <div className={styles.loginHeader}>
                    <h1 className={styles.loginTitle}>Admin Access</h1>
                    <p className={styles.loginSubtitle}>Please sign in to manage your content</p>
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Username</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            className={styles.inputField}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.loginBtn} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
