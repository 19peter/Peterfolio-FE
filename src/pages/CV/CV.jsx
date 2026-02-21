import { useState, useEffect } from 'react';
import { Download, Briefcase, GraduationCap, Code2, Award, Mail, Github, Linkedin } from 'lucide-react';
import themeStyles from './styles';
import { useStyles } from '../../hooks/useStyles';
import { ACTIVE_THEME } from '../../config/themeConfig';
import { cvService } from '../../services/cvService';

const CV = () => {
    const styles = useStyles(themeStyles);
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cvService.getCv()
            .then(data => {
                setCvData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className={styles.cvPage}><p style={{ textAlign: 'center', marginTop: '50px' }}>Loading CV Data...</p></div>;
    if (error) return <div className={styles.cvPage}><p style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</p></div>;
    if (!cvData) return null;

    return (
        <div className={styles.cvPage}>
            <header className={styles.pageHeader}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.pageTitle}>{cvData.personal.title}</h1>
                    <div className={styles.contactLinks}>
                        <a href={`mailto:${cvData.personal.email}`} className={styles.contactItem}><Mail size={14} /> {cvData.personal.email}</a>
                        <a href={cvData.personal.github} target="_blank" rel="noopener noreferrer" className={styles.contactItem}><Github size={14} /> GitHub</a>
                        <a href={cvData.personal.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactItem}><Linkedin size={14} /> LinkedIn</a>
                    </div>
                </div>
                <button className={`${styles.printBtn} glass-panel`}>
                    <Download size={16} /> Download PDF
                </button>
            </header>

            <div className={`${styles.cvContent} glass-panel`}>
                <section className={styles.cvSection}>
                    <h2 className={styles.sectionTitle}>Summary</h2>
                    <p className={styles.summaryText}>
                        {cvData.summary}
                    </p>
                </section>

                <section className={styles.cvSection}>
                    <h2 className={styles.sectionTitle}><Briefcase size={20} /> Professional Experience</h2>
                    {cvData.experience.map((job, index) => (
                        <div key={index} className={styles.experienceItem}>
                            <div className={styles.itemHeader}>
                                <h3>{job.role}</h3>
                                <span className={styles.itemDate}>{job.period}</span>
                            </div>
                            <p className={styles.itemOrg}>{job.company}</p>
                            <div className={styles.itemList}>
                                {job.highlights?.map((group, groupIndex) => (
                                    <div key={groupIndex} style={{ marginBottom: '1rem' }}>
                                        {group.title && <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1rem' }}>{group.title}</h5>}
                                        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                            {group.items?.map((item, i) => (
                                                <li key={i} style={{
                                                    listStyleType: 'none',
                                                    color: 'var(--text-dim)',
                                                    marginBottom: '0.25rem',
                                                    lineHeight: '1.6'
                                                }}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <section className={styles.cvSection}>
                    <h2 className={styles.sectionTitle}><Code2 size={20} /> Technical Skills</h2>
                    <div className={styles.skillsGrid}>
                        {cvData.skills.map((skill, index) => (
                            <div key={index} className={styles.skillCategory}>
                                <h4>{skill.category}</h4>
                                <p>{skill.items}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.cvSection}>
                    <h2 className={styles.sectionTitle}><GraduationCap size={20} /> Education</h2>
                    {cvData.education.map((edu, index) => (
                        <div key={index} className={styles.educationItem}>
                            <div className={styles.itemHeader}>
                                <h3>{edu.degree}</h3>
                                <span className={styles.itemDate}>{edu.period}</span>
                            </div>
                            <p className={styles.itemOrg}>{edu.institution}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default CV;
