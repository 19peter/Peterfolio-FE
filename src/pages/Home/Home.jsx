import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import themeStyles from './styles';
import { useStyles } from '../../hooks/useStyles';
import { ACTIVE_THEME } from '../../config/themeConfig';

const Home = () => {
    const styles = useStyles(themeStyles);

    return (
        <div className={styles.homePage}>
            <section className={styles.hero}>
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className={styles.heroTitle}>
                        Hi, I'm <span className={styles.accentText}>Peter</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Welcome to my personal pocket of the internet. I'm a developer,
                        writer, and tech enthusiast exploring the edges of modern web design.
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/tech-blog">
                            <button className={`${styles.primaryBtn} glass-panel`}>Browse Tech Blog</button>
                        </Link>
                        <Link to="/about-blog">
                            <button className={styles.secondaryBtn}>About Me</button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
