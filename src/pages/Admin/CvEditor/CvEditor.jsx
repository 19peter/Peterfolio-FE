import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { cvService } from '../../../services/cvService';
import themeStyles from './styles';
import { useStyles } from '../../../hooks/useStyles';

const CvEditor = () => {
    const styles = useStyles(themeStyles);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [cv, setCv] = useState({
        personal: { title: '', email: '', github: '', linkedin: '' },
        summary: '',
        experience: [],
        skills: [],
        education: []
    });

    useEffect(() => {
        const fetchCv = async () => {
            try {
                const data = await cvService.getCv();
                if (data) {
                    setCv({
                        ...data,
                        experience: data.experience || [],
                        skills: data.skills || [],
                        education: data.education || []
                    });
                }
            } catch (err) {
                console.error("Failed to load CV:", err);
                setError("Failed to load CV data. Starting with blank template.");
            } finally {
                setLoading(false);
            }
        };
        fetchCv();
    }, []);

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setCv(prev => ({
            ...prev,
            personal: { ...prev.personal, [name]: value }
        }));
    };

    const handleSummaryChange = (e) => {
        setCv(prev => ({ ...prev, summary: e.target.value }));
    };

    const handleArrayChange = (category, index, field, value) => {
        setCv(prev => {
            const newArray = [...prev[category]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [category]: newArray };
        });
    };

    // Generic Add to Array
    const addArrayItem = (category, template) => {
        setCv(prev => ({
            ...prev,
            [category]: [...prev[category], template]
        }));
    };

    // Generic Remove from Array
    const removeArrayItem = (category, index) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setCv(prev => ({
                ...prev,
                [category]: prev[category].filter((_, i) => i !== index)
            }));
        }
    };

    // Helpers for Highlights array within Experience
    const handleHighlightGroupTitleChange = (expIndex, groupIndex, value) => {
        setCv(prev => {
            const newExp = [...prev.experience];
            const newHighlights = [...newExp[expIndex].highlights];
            newHighlights[groupIndex] = { ...newHighlights[groupIndex], title: value };
            newExp[expIndex] = { ...newExp[expIndex], highlights: newHighlights };
            return { ...prev, experience: newExp };
        });
    };

    const handleHighlightItemChange = (expIndex, groupIndex, itemIndex, value) => {
        setCv(prev => {
            const newExp = [...prev.experience];
            const newHighlights = [...newExp[expIndex].highlights];
            const newItems = [...newHighlights[groupIndex].items];
            newItems[itemIndex] = value;
            newHighlights[groupIndex] = { ...newHighlights[groupIndex], items: newItems };
            newExp[expIndex] = { ...newExp[expIndex], highlights: newHighlights };
            return { ...prev, experience: newExp };
        });
    };

    const addHighlightGroup = (expIndex) => {
        setCv(prev => {
            const newExp = [...prev.experience];
            const newHighlights = [...newExp[expIndex].highlights, { title: '', items: [''] }];
            newExp[expIndex] = { ...newExp[expIndex], highlights: newHighlights };
            return { ...prev, experience: newExp };
        });
    };

    const removeHighlightGroup = (expIndex, groupIndex) => {
        if (window.confirm("Are you sure you want to delete this highlight group?")) {
            setCv(prev => {
                const newExp = [...prev.experience];
                const newHighlights = newExp[expIndex].highlights.filter((_, i) => i !== groupIndex);
                newExp[expIndex] = { ...newExp[expIndex], highlights: newHighlights };
                return { ...prev, experience: newExp };
            });
        }
    };

    const addHighlightItem = (expIndex, groupIndex) => {
        setCv(prev => {
            const newExp = [...prev.experience];
            const newHighlights = [...newExp[expIndex].highlights];
            const newItems = [...newHighlights[groupIndex].items, ''];
            newHighlights[groupIndex] = { ...newHighlights[groupIndex], items: newItems };
            newExp[expIndex] = { ...newExp[expIndex], highlights: newHighlights };
            return { ...prev, experience: newExp };
        });
    };

    const removeHighlightItem = (expIndex, groupIndex, itemIndex) => {
        if (window.confirm("Are you sure you want to delete this highlight item?")) {
            setCv(prev => {
                const newExp = [...prev.experience];
                const newHighlights = [...newExp[expIndex].highlights];
                const newItems = newHighlights[groupIndex].items.filter((_, i) => i !== itemIndex);
                newHighlights[groupIndex] = { ...newHighlights[groupIndex], items: newItems };
                newExp[expIndex] = { ...newExp[expIndex], highlights: newHighlights };
                return { ...prev, experience: newExp };
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await cvService.updateCv(cv);
            setSuccess("CV successfully updated!");
            setTimeout(() => setSuccess(""), 3000); // Clear after 3 seconds
        } catch (err) {
            console.error(err);
            setError("Failed to save CV modifications.");
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading CV Editor...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className={styles.backLink}
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <h1 className={styles.title}>CV Editor</h1>
            </div>

            {error && (
                <div className={styles.errorBox}>
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className={styles.successBox}>
                    <p>{success}</p>
                </div>
            )}

            <form onSubmit={handleSave} className={styles.form}>

                {/* Personal Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={cv.personal?.title || ''}
                                onChange={handlePersonalChange}
                                className={styles.input}
                                placeholder="e.g. Frontend Developer"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={cv.personal?.email || ''}
                                onChange={handlePersonalChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>GitHub URL</label>
                            <input
                                type="url"
                                name="github"
                                value={cv.personal?.github || ''}
                                onChange={handlePersonalChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedin"
                                value={cv.personal?.linkedin || ''}
                                onChange={handlePersonalChange}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Professional Summary</h2>
                    <div className={styles.formGroup}>
                        <textarea
                            value={cv.summary || ''}
                            onChange={handleSummaryChange}
                            className={styles.textarea}
                            placeholder="Write a brief professional summary..."
                        />
                    </div>
                </div>

                {/* Experience Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Experience</h2>
                    <div className={styles.arrayContainer}>
                        {cv.experience?.map((exp, index) => (
                            <div key={index} className={styles.arrayItem}>

                                <div className={styles.grid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Role</label>
                                        <input
                                            type="text"
                                            value={exp.role}
                                            onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Company</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Period</label>
                                        <input
                                            type="text"
                                            value={exp.period}
                                            onChange={(e) => handleArrayChange('experience', index, 'period', e.target.value)}
                                            className={styles.input}
                                            placeholder="e.g. 2022 - Present"
                                        />
                                    </div>
                                </div>
                                <div className={styles.highlightsContainer}>
                                    <label className={styles.label}>Highlights</label>
                                    <div className={styles.highlightsList}>
                                        {exp.highlights?.map((group, groupIndex) => (
                                            <div key={groupIndex} className={styles.highlightGroup}>

                                                <div className={styles.formGroup}>

                                                    <label className={styles.label}>Group Title</label>
                                                    <div className={styles.inputWithButton}>

                                                        <input
                                                            type="text"
                                                            value={group.title || ''}
                                                            onChange={(e) => handleHighlightGroupTitleChange(index, groupIndex, e.target.value)}
                                                            className={styles.input}
                                                            placeholder="e.g. Key Responsibilities"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => removeHighlightGroup(index, groupIndex)}
                                                            className={styles.removeGroupButton}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div >
                                                    <label className={styles.label}>Items</label>
                                                    {group.items?.map((item, itemIndex) => (
                                                        <div key={itemIndex} className={styles.highlightRow}>
                                                            <input
                                                                type="text"
                                                                value={item || ''}
                                                                onChange={(e) => handleHighlightItemChange(index, groupIndex, itemIndex, e.target.value)}
                                                                className={styles.input}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeHighlightItem(index, groupIndex, itemIndex)}
                                                                className={styles.iconButton}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addHighlightItem(index, groupIndex)}
                                                        className={styles.addHighlightBtn}
                                                    >
                                                        <Plus size={16} /> Add Item
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addHighlightGroup(index)}
                                            className={styles.addButton}
                                            style={{ padding: '0.75rem', fontSize: '0.9rem' }}
                                        >
                                            <Plus size={16} /> Add Highlight Group
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('experience', index)}
                                    className={styles.removeButton}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('experience', { role: '', company: '', period: '', highlights: [{ title: '', items: [''] }] })}
                            className={styles.addButton}
                        >
                            <Plus size={20} /> Add Experience
                        </button>
                    </div>
                </div>

                {/* Technical Skills Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Technical Skills</h2>
                    <div className={styles.arrayContainer}>
                        {cv.skills?.map((skill, index) => (
                            <div key={index} className={styles.arrayItem}>

                                <div className={styles.grid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Category</label>
                                        <input
                                            type="text"
                                            value={skill.category}
                                            onChange={(e) => handleArrayChange('skills', index, 'category', e.target.value)}
                                            className={styles.input}
                                            placeholder="e.g. Frontend"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            value={skill.items}
                                            onChange={(e) => handleArrayChange('skills', index, 'items', e.target.value)}
                                            className={styles.input}
                                            placeholder="React, Vue, Node.js..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('skills', index)}
                                    className={styles.removeButton}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('skills', { category: '', items: '' })}
                            className={styles.addButton}
                        >
                            <Plus size={20} /> Add Skill Category
                        </button>
                    </div>
                </div>

                {/* Education Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Education</h2>
                    <div className={styles.arrayContainer}>
                        {cv.education?.map((edu, index) => (
                            <div key={index} className={styles.arrayItem}>

                                <div className={styles.grid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Degree</label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Institution</label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Period</label>
                                        <input
                                            type="text"
                                            value={edu.period}
                                            onChange={(e) => handleArrayChange('education', index, 'period', e.target.value)}
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('education', index)}
                                    className={styles.removeButton}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('education', { degree: '', institution: '', period: '' })}
                            className={styles.addButton}
                        >
                            <Plus size={20} /> Add Education
                        </button>
                    </div>
                </div>

                <div className={styles.submitContainer}>
                    <button type="submit" className={styles.submitButton}>
                        <Save size={20} /> Save CV Document
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CvEditor;
