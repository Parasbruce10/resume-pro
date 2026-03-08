const e = React.createElement;
const { useState, useEffect } = React;

const App = () => {
    const [currentPage, setCurrentPage] = useState('home'); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('modern'); // Template state
    
    const initialState = {
        name: '', title: '', email: '', phone: '', city: '', address: '',
        summary: '', skills: '', education: '', experience: '', 
        image: null 
    };
    
    const [data, setData] = useState(initialState);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isConverting, setIsConverting] = useState(false);

    const update = (key, val) => setData({ ...data, [key]: val });

    const handleImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => update('image', reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleWordToPdf = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setIsConverting(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            try {
                const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                const html = result.value; 
                const opt = {
                    margin: 1,
                    filename: 'converted-document.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().from(html).set(opt).save().then(() => {
                    setIsConverting(false);
                    alert("Conversion Successful!");
                });
            } catch (err) {
                console.error(err);
                alert("Error converting file.");
                setIsConverting(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const styles = `
        :root {
            --bg: ${isDarkMode ? '#050505' : '#f8fafc'};
            --card-bg: ${isDarkMode ? '#111111' : '#ffffff'};
            --text: ${isDarkMode ? '#ffffff' : '#0f172a'};
            --border: ${isDarkMode ? '#222222' : '#e2e8f0'};
            --input-bg: ${isDarkMode ? '#000000' : '#ffffff'};
            --accent: #3b82f6;
            --header-bg: ${isDarkMode ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        }

        body { 
            background: var(--bg); 
            color: var(--text); 
            font-family: 'Inter', system-ui, sans-serif; 
            margin: 0; 
            transition: all 0.3s ease;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .header-wrapper {
            position: sticky; top: 0; z-index: 1000;
            background: var(--header-bg);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
        }

        .header-content {
            max-width: 1200px; margin: 0 auto; padding: 12px 20px;
            display: flex; justify-content: space-between; align-items: center;
        }

        .logo { 
            font-weight: 900; font-size: 1.2rem; 
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            cursor: pointer; z-index: 1001;
        }

        .nav-links { display: flex; gap: 20px; align-items: center; }
        .nav-link { color: var(--text); text-decoration: none; font-size: 13px; font-weight: 600; cursor: pointer; opacity: 0.7; }
        .nav-link:hover { opacity: 1; }
        .nav-link.active { color: var(--accent); opacity: 1; }

        .nav-btns { display: flex; gap: 8px; align-items: center; z-index: 1001; }

        .btn { padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.2s; display: flex; align-items: center; gap: 5px; border: none; }
        .btn-theme { background: ${isDarkMode ? '#1e293b' : '#f1f5f9'}; color: var(--text); border: 1px solid var(--border); }
        .btn-primary { background: #fff; color: #000; }

        .hamburger {
            display: none; flex-direction: column; gap: 4px; cursor: pointer; padding: 5px; z-index: 1001;
        }
        .hamburger span { width: 20px; height: 2px; background: var(--text); transition: 0.3s; }

        .mobile-menu {
            position: fixed; top: 0; right: ${isMenuOpen ? '0' : '-100%'};
            width: 80%; max-width: 300px; height: 100vh; background: var(--card-bg);
            box-shadow: -10px 0 30px rgba(0,0,0,0.5);
            display: flex; flex-direction: column; padding: 20px; gap: 20px;
            transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2000;
        }

        .close-menu { align-self: flex-end; font-size: 24px; cursor: pointer; opacity: 0.7; padding: 10px; color: var(--text); }

        .app-container { 
            max-width: 1200px; margin: 0 auto; padding: 20px 15px 100px;
            flex: 1; width: 100%; box-sizing: border-box;
        }
        
        .main-layout { 
            display: grid; 
            grid-template-columns: 0.8fr 1.2fr; 
            gap: 30px; 
            align-items: start; 
        }

        .form-side { 
            background: var(--card-bg); 
            padding: 20px; 
            border-radius: 15px; 
            border: 1px solid var(--border); 
            max-height: 85vh; 
            overflow-y: auto; 
        }

        .preview-side { 
            background: #fff; 
            color: #000; 
            padding: 30px; 
            border-radius: 4px; 
            min-height: 600px; 
            height: fit-content; 
            position: sticky; 
            top: 100px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); 
            width: 100%; 
            box-sizing: border-box;
        }

        /* Template Switcher Buttons */
        .template-selector {
            display: flex; gap: 10px; margin-bottom: 15px; justify-content: center;
        }
        .t-btn { 
            padding: 5px 12px; font-size: 11px; border-radius: 20px; border: 1px solid #ddd;
            cursor: pointer; background: #fff; color: #333; transition: 0.3s;
        }
        .t-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }

        /* Template Styles */
        .resume-content.classic { text-align: center; }
        .resume-content.classic .resume-header { flex-direction: column; text-align: center; }
        .resume-content.minimalist { font-family: 'Georgia', serif; }
        .resume-content.minimalist .resume-header { border-bottom: 4px solid #000; }

 @media (max-width: 900px) {
    .nav-links, .btn-theme { display: none; }
    .hamburger { display: flex; }

    /* Layout ko control karne ke liye - Simple vertical stack */
    .main-layout { 
        display: flex !important; 
        flex-direction: column !important; 
        gap: 20px !important;
        height: auto !important;
    }

    /* Form Section */
    .form-side { 
        order: 1 !important; 
        width: 93% !important; 
        max-height: none !important; 
        position: relative !important;
        overflow: visible !important;
        margin-bottom: 20px;
    }

    /* Resume Preview Section */
    .preview-side { 
        order: 2 !important; 
        width: 103% !important; 
        position: relative !important; 
        top: 0 !important;
        margin-top: 20px !important;
        margin-bottom: 40px !important; /* Taake Download button aur Footer se gap rahe */
        min-height: 500px !important; 
        height: auto !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        display: block !important;
    }

    /* Footer Fix - Isay hamesha niche rakhne ke liye */
    .footer {
        position: relative !important;
        clear: both !important;
        margin-top: 60px !important;
        z-index: 100;
    }
}

        .section-title { color: #64748b; font-size: 11px; text-transform: uppercase; margin: 20px 0 10px; font-weight: 700; border-left: 3px solid var(--accent); padding-left: 10px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .file-upload-wrapper { border: 2px dashed var(--border); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px; cursor: pointer; position: relative; }
        input, textarea { width: 100%; padding: 12px; background: var(--input-bg); border: 1px solid var(--border); color: var(--text); border-radius: 8px; margin-bottom: 10px; box-sizing: border-box; font-size: 14px; }
        .profile-img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .resume-header { display: flex; gap: 20px; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }

        @media print {
            .header-wrapper, .form-side, .footer, .hamburger, .mobile-menu, .template-selector, .btn-primary { display: none !important; }
            .preview-side { width: 100%; border: none; box-shadow: none; padding: 0; position: static; margin: 0; }
            .main-layout { display: block; }
            body { background: white; }
        }

        .footer { background: var(--card-bg); border-top: 1px solid var(--border); padding: 30px 20px; text-align: center; margin-top: auto; }
        .footer-text { font-size: 12px; color: #64748b; margin: 0; }
    `;

    const navigate = (page) => {
        setCurrentPage(page);
        setIsMenuOpen(false);
    };

    return e('div', { style: { display: 'flex', flexDirection: 'column', minHeight: '100vh' } },
        e('style', null, styles),
        
        e('div', { className: 'mobile-menu' },
            e('div', { className: 'close-menu', onClick: () => setIsMenuOpen(false) }, '✕'),
            e('div', { className: `nav-link ${currentPage === 'home' ? 'active' : ''}`, style: {fontSize: '18px'}, onClick: () => navigate('home') }, 'Resume Maker'),
            e('div', { className: `nav-link ${currentPage === 'wordToPdf' ? 'active' : ''}`, style: {fontSize: '18px'}, onClick: () => navigate('wordToPdf') }, 'Word to PDF'),
            e('div', { className: `nav-link ${currentPage === 'about' ? 'active' : ''}`, style: {fontSize: '18px'}, onClick: () => navigate('about') }, 'About'),
            e('button', { className: 'btn btn-theme', style: {marginTop: '20px', display: 'flex', justifyContent: 'center'}, onClick: () => setIsDarkMode(!isDarkMode) }, isDarkMode ? '☀️ Light' : '🌙 Dark')
        ),

        e('div', { className: 'header-wrapper' },
            e('div', { className: 'header-content' },
                e('div', { className: 'logo', onClick: () => navigate('home') }, 'RESUME.PRO'),
                e('div', { className: 'nav-links' },
                    e('div', { className: `nav-link ${currentPage === 'home' ? 'active' : ''}`, onClick: () => navigate('home') }, 'Resume Maker'),
                    e('div', { className: `nav-link ${currentPage === 'wordToPdf' ? 'active' : ''}`, onClick: () => navigate('wordToPdf') }, 'Word to PDF'),
                    e('div', { className: `nav-link ${currentPage === 'about' ? 'active' : ''}`, onClick: () => navigate('about') }, 'About')
                ),
                e('div', { className: 'nav-btns' },
                    e('button', { className: 'btn btn-theme', onClick: () => setIsDarkMode(!isDarkMode) }, isDarkMode ? '☀️' : '🌙'),
                    e('div', { className: 'hamburger', onClick: () => setIsMenuOpen(true) },
                        e('span', null), e('span', null), e('span', null)
                    )
                )
            )
        ),
        
        e('div', { className: 'app-container' },
            currentPage === 'home' && e('div', { className: 'main-layout' }, 
                e('div', { className: 'form-side' },
                    e('div', { className: 'section-title' }, 'Photo'),
                    e('div', { className: 'file-upload-wrapper' },
                        e('div', { style: { fontSize: '12px' } }, data.image ? '✅ Uploaded' : '📷 Profile Photo'),
                        e('input', { type: 'file', accept: 'image/*', onChange: handleImage, style: { opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' } })
                    ),
                    e('div', { className: 'section-title' }, 'Identity'),
                    e('div', { className: 'grid-2' },
                        e('input', { placeholder: 'Name', onChange: (e) => update('name', e.target.value) }),
                        e('input', { placeholder: 'Title', onChange: (e) => update('title', e.target.value) })
                    ),
                    e('div', { className: 'section-title' }, 'Contact'),
                    e('div', { className: 'grid-2' },
                        e('input', { placeholder: 'Email', onChange: (e) => update('email', e.target.value) }),
                        e('input', { placeholder: 'Phone', onChange: (e) => update('phone', e.target.value) })
                    ),
                    e('div', { className: 'grid-2' },
                        e('input', { placeholder: 'City', onChange: (e) => update('city', e.target.value) }),
                        e('input', { placeholder: 'Full Address', onChange: (e) => update('address', e.target.value) }),
                    ),
                    e('div', { className: 'section-title' }, 'Content'),
                    e('textarea', { rows: 2, placeholder: 'Summary...', onChange: (e) => update('summary', e.target.value) }),
                    e('textarea', { rows: 4, placeholder: 'Work Experience...', onChange: (e) => update('experience', e.target.value) }),
                    e('input', { placeholder: 'Education', onChange: (e) => update('education', e.target.value) }),
                    e('input', { placeholder: 'Skills', onChange: (e) => update('skills', e.target.value) })
                ), 

                e('div', { className: 'preview-side' },
                    // TEMPLATE SWITCHER
                    e('div', { className: 'template-selector' },
                        e('button', { className: `t-btn ${selectedTemplate === 'modern' ? 'active' : ''}`, onClick: () => setSelectedTemplate('modern') }, 'Modern'),
                        e('button', { className: `t-btn ${selectedTemplate === 'classic' ? 'active' : ''}`, onClick: () => setSelectedTemplate('classic') }, 'Classic'),
                        e('button', { className: `t-btn ${selectedTemplate === 'minimalist' ? 'active' : ''}`, onClick: () => setSelectedTemplate('minimalist') }, 'Minimalist')
                    ),

                    e('div', { className: `resume-content ${selectedTemplate}` },
                        e('div', { className: 'resume-header' },
                            data.image && e('img', { src: data.image, className: 'profile-img' }),
                            e('div', null,
                                e('h1', { style: { margin: 0, fontSize: '24px' } }, data.name || 'YOUR NAME'),
                                e('p', { style: { margin: '2px 0', color: '#334155', fontWeight: '600', fontSize: '14px' } }, data.title || 'Title'),
                                e('div', { style: { fontSize: '10px', color: '#64748b', marginTop: '5px' } }, 
                                    data.email && `${data.email} | `,
                                    data.phone && `${data.phone} | `,
                                    (data.city || data.address) && `${data.city} ${data.address}`
                                )
                            )
                        ),
                        data.summary && e('div', { style: { marginBottom: '15px' } },
                            e('h4', { style: { borderBottom: '1px solid #eee', fontSize: '12px', paddingBottom: '3px' } }, 'SUMMARY'),
                            e('p', { style: { fontSize: '12px', lineHeight: '1.4' } }, data.summary)
                        ),
                        data.experience && e('div', { style: { marginBottom: '15px' } },
                            e('h4', { style: { borderBottom: '1px solid #eee', fontSize: '12px', paddingBottom: '3px' } }, 'EXPERIENCE'),
                            e('p', { style: { fontSize: '12px', whiteSpace: 'pre-line' } }, data.experience)
                        ),
                        data.education && e('div', { style: { marginBottom: '15px' } },
                            e('h4', { style: { borderBottom: '1px solid #eee', fontSize: '12px', paddingBottom: '3px' } }, 'EDUCATION'),
                            e('p', { style: { fontSize: '12px' } }, data.education)
                        ),
                        data.skills && e('div', null,
                            e('h4', { style: { borderBottom: '1px solid #eee', fontSize: '12px', paddingBottom: '3px' } }, 'SKILLS'),
                            e('p', { style: { fontSize: '12px' } }, data.skills)
                        )
                    )
                )
            ),

            currentPage === 'wordToPdf' && e('div', { style: {textAlign:'center', padding:'50px 20px', minHeight: '60vh'} },
                e('h2', null, 'Convert Word to PDF'),
                e('div', { className: 'file-upload-wrapper', style: { maxWidth: '400px', margin: '20px auto' } },
                    e('div', null, isConverting ? '⏳ Converting...' : '📂 Choose Word File'),
                    e('input', { type: 'file', accept: '.docx', onChange: handleWordToPdf, style: { opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' } })
                )
            ),

            currentPage === 'about' && e('div', { style: {textAlign:'left', maxWidth:'800px', margin:'0 auto', padding:'50px 20px', minHeight: '60vh', lineHeight:'1.6'} },
                e('h1', { style: {textAlign:'center', color:'var(--accent)'} }, 'Welcome to Resume Pro'),
                e('p', null, 'Your all-in-one solution for professional career branding. We believe that a great career starts with a great first impression, and we are here to help you make it count.'),
                e('h3', { style: {marginTop:'30px', color:'var(--accent)'} }, 'What We Offer:'),
                e('ul', null, 
                    e('li', { style: {marginBottom:'10px'} }, e('strong', null, 'Instant Resume Builder: '), 'No more struggling with formatting. Simply fill out our intuitive form, and our system will generate a polished, professional CV tailored to industry standards.'),
                    e('li', { style: {marginBottom:'10px'} }, e('strong', null, 'Seamless File Conversion: '), 'We provide a built-in Word-to-PDF converter, ensuring your documents are always in the right format for any job application.'),
                    e('li', { style: {marginBottom:'10px'} }, e('strong', null, 'Professional Templates: '), 'Choose from a variety of layouts designed to catch the eye of recruiters and hiring managers.')
                ),
                e('h3', { style: {marginTop:'30px', color:'var(--accent)'} }, 'Our Vision:'),
                e('p', null, 'At Resume Pro, we are constantly evolving. While we currently focus on making resume creation easy and efficient, we are committed to adding more advanced features in the future to help you navigate your professional journey with confidence.')
            )
        ),

        currentPage === 'home' && e('div', { 
            style: { textAlign: 'center', padding: '30px 20px', background: 'var(--card-bg)', borderTop: '1px solid var(--border)', marginTop: '20px' } 
        },
            e('button', { 
                className: 'btn btn-primary', 
                onClick: () => window.print(),
                style: { padding: '15px 50px', fontSize: '14px', borderRadius: '50px', margin: '0 auto', display: 'block', background: '#3b82f6', color: '#fff', cursor: 'pointer', border: 'none', fontWeight: 'bold' } 
            }, '💾 Download My Resume')
        ),

        e('footer', { className: 'footer' },
            e('div', null,
                e('div', { style: { fontWeight: '800', color: '#3b82f6' } }, 'RESUME.PRO'),
                e('p', { className: 'footer-text', style: { fontSize: '14px', fontWeight: '500', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' } }, 
                    'Created with ', e('span', { style: { color: '#ef4444', fontSize: '18px' } }, '♥'), ' by ', e('span', { style: { color: 'var(--accent)', fontWeight: '700' } }, 'Paras')
                ),
                e('p', { className: 'footer-text' }, `© ${new Date().getFullYear()} All Rights Reserved`)
            )
        )
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));