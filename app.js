const e = React.createElement;
const { useState, useEffect } = React;

const App = () => {
    const initialState = {
        name: '', title: '', email: '', phone: '', city: '', country: '',
        summary: '', skills: '', education: '', experience: '', 
        image: null 
    };
    
    const [data, setData] = useState(initialState);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const update = (key, val) => setData({ ...data, [key]: val });

    const handleImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => update('image', reader.result);
            reader.readAsDataURL(file);
        }
    };

    const styles = `
        :root {
            --bg: ${isDarkMode ? '#050505' : '#f8fafc'};
            --card-bg: ${isDarkMode ? '#111111' : '#ffffff'};
            --text: ${isDarkMode ? '#ffffff' : '#0f172a'};
            --border: ${isDarkMode ? '#222222' : '#e2e8f0'};
            --input-bg: ${isDarkMode ? '#000000' : '#ffffff'};
            --accent: #3b82f6;
            --header-bg: ${isDarkMode ? 'rgba(17, 17, 17, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
        }

        body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; margin: 0; transition: all 0.3s ease; }
        
        .header-wrapper {
            position: sticky;
            top: 0;
            z-index: 100;
            background: var(--header-bg);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            margin-bottom: 20px;
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo { 
            font-weight: 900; 
            font-size: 1.2rem; 
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-btns { display: flex; gap: 8px; }

        .btn { 
            padding: 8px 16px; 
            border-radius: 8px; 
            cursor: pointer; 
            font-weight: 600; 
            font-size: 12px; 
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 5px;
            border: none;
        }

        .btn-theme {
            background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
            color: var(--text);
            border: 1px solid var(--border);
        }

        .btn-primary { background: #fff; color: #000; }

        .app-container { max-width: 1200px; margin: 0 auto; padding: 0 15px 40px; }
        
        .main-layout { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 30px; 
        }

        /* Responsive Fix: Mobile and Tablet */
        @media (max-width: 1024px) {
            .main-layout { grid-template-columns: 1fr; display: flex; flex-direction: column; }
            .form-side { max-height: none !important; overflow: visible !important; order: 1; }
            .preview-side { position: relative !important; top: 0 !important; order: 2; margin-top: 20px; }
            .logo { font-size: 1rem; }
            .btn { padding: 6px 10px; font-size: 10px; }
        }
        
        .form-side { 
            background: var(--card-bg); 
            padding: 25px; 
            border-radius: 15px; 
            border: 1px solid var(--border); 
            max-height: 85vh; 
            overflow-y: auto; 
        }

        @media (max-width: 600px) {
            .form-side { padding: 15px; }
            .grid-2 { grid-template-columns: 1fr; }
        }

        .section-title { 
            color: #64748b; 
            font-size: 11px; 
            text-transform: uppercase; 
            margin: 20px 0 10px; 
            font-weight: 700; 
            border-left: 3px solid var(--accent); 
            padding-left: 10px; 
        }
        
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        
        .file-upload-wrapper { 
            border: 2px dashed var(--border); 
            border-radius: 12px; 
            padding: 20px; 
            text-align: center; 
            margin-bottom: 20px; 
            cursor: pointer; 
            position: relative;
        }

        input, textarea { 
            width: 100%; padding: 12px; 
            background: var(--input-bg); 
            border: 1px solid var(--border); 
            color: var(--text); 
            border-radius: 8px; 
            margin-bottom: 10px; 
            box-sizing: border-box; 
            font-size: 14px; 
        }
        
        .preview-side { 
            background: #fff; 
            color: #000; 
            padding: 30px; 
            border-radius: 4px; 
            min-height: 800px; 
            position: sticky; 
            top: 80px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            overflow-x: hidden;
        }

        .resume-header { display: flex; gap: 20px; align-items: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
        .profile-img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        
        @media print {
            .header-wrapper, .form-side { display: none; }
            .preview-side { width: 100%; border: none; box-shadow: none; padding: 0; position: static; }
            .main-layout { display: block; }
            body { background: white; }
        }
    `;

    return e('div', null,
        e('style', null, styles),
        e('div', { className: 'header-wrapper' },
            e('div', { className: 'header-content' },
                e('div', { className: 'logo' }, 'RESUME.PRO'),
                e('div', { className: 'nav-btns' },
                    e('button', { className: 'btn btn-theme', onClick: () => setIsDarkMode(!isDarkMode) }, isDarkMode ? '☀️ LIGHT' : '🌙 DARK'),
                    e('button', { className: 'btn btn-primary', onClick: () => window.print() }, '📥 Download Resume')
                )
            )
        ),
        
        e('div', { className: 'app-container' },
            e('div', { className: 'main-layout' }, 
                e('div', { className: 'form-side' },
                    e('div', { className: 'section-title' }, 'Photo'),
                    e('div', { className: 'file-upload-wrapper' },
                        e('div', { style: { fontSize: '12px' } }, data.image ? '✅ Uploaded' : '📸 Profile Photo'),
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
                        e('input', { 
    placeholder: 'Full Address (House #, Street, Area)', 
    onChange: (e) => update('address', e.target.value) 
})
                    ),
                    e('div', { className: 'section-title' }, 'Content'),
                    e('textarea', { rows: 2, placeholder: 'Summary...', onChange: (e) => update('summary', e.target.value) }),
                    e('textarea', { rows: 4, placeholder: 'Work Experience...', onChange: (e) => update('experience', e.target.value) }),
                    e('input', { placeholder: 'Education', onChange: (e) => update('education', e.target.value) }),
                    e('input', { placeholder: 'Skills', onChange: (e) => update('skills', e.target.value) })
                ), 

                e('div', { className: 'preview-side' },
                    e('div', { className: 'resume-header' },
                        data.image && e('img', { src: data.image, className: 'profile-img' }),
                        e('div', null,
                            e('h1', { style: { margin: 0, fontSize: '24px' } }, data.name || 'YOUR NAME'),
                            e('p', { style: { margin: '2px 0', color: '#334155', fontWeight: '600', fontSize: '14px' } }, data.title || 'Title'),
                            e('div', { style: { fontSize: '10px', color: '#64748b', marginTop: '5px' } }, 
                                data.email && `${data.email} | `,
                                data.phone && `${data.phone} | `,
                                (data.city || data.country) && `${data.city}, ${data.country}`
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
        )
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App)); 