import { Link, useLocation } from 'react-router-dom';
import { Home, Book, User, FileText, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import themeStyles from './styles';
import { useStyles } from '../../hooks/useStyles';

const Navbar = () => {
    const styles = useStyles(themeStyles);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Tech Blog', path: '/tech-blog', icon: <Book size={18} /> },
        { name: 'About Me', path: '/about-blog', icon: <User size={18} /> },
        { name: 'CV', path: '/cv', icon: <FileText size={18} /> },
    ];

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`${styles.navbarContainer} glass-panel`}>
                <Link to="/" className={styles.navbarLogo}>
                    Peter<span className={styles.accentText}>folio</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.navbarLinks}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`${styles.navItem} ${location.pathname === link.path ? styles.active : ''}`}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} glass-panel ${isOpen ? styles.open : ''}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`${styles.mobileNavItem} ${location.pathname === link.path ? styles.active : ''}`}
                        onClick={() => setIsOpen(false)}
                    >
                        {link.icon}
                        <span>{link.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
