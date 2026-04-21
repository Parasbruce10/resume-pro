const e = React.createElement;
const { useState, useEffect } = React;

const App = () => {
    const [currentPage, setCurrentPage] = useState('landing');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [typewriterText, setTypewriterText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPrivacyDropdownOpen, setIsPrivacyDropdownOpen] = useState(false);
    const [editorContent, setEditorContent] = useState('');

// Word File Download karne ka function
const handleDownloadWord = () => {
    const content = `
        <html>
            <head><meta charset="utf-8"></head>
            <body>${editorContent}</body>
        </html>
    `;
    const converted = htmlDocx.asBlob(content);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(converted);
    link.download = "MyArticle.docx";
    link.click();
};

    // AB YAHAN TYPEWRITER WALA EFFECT RAKHEIN
    useEffect(() => {
        const phrases = [
            "Resume Pro: Build. Apply. Succeed.",
            "Professionalism Made Simple.",
            "Your Resume, Reimagined."
        ];

        const typeSpeed = isDeleting ? 50 : 100;
        const currentPhrase = phrases[phraseIndex];

        const timer = setTimeout(() => {
            if (!isDeleting && typewriterText === currentPhrase) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && typewriterText === '') {
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % phrases.length);
            } else {
                const nextText = isDeleting
                    ? currentPhrase.substring(0, typewriterText.length - 1)
                    : currentPhrase.substring(0, typewriterText.length + 1);
                setTypewriterText(nextText);
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [typewriterText, isDeleting, phraseIndex]);

    useEffect(() => {
    if (currentPage === 'wordEditor') {
        const container = document.getElementById('editor-container');
        if (container && !container.innerHTML) {
            const quill = new Quill('#editor-container', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['clean']
                    ]
                }
            });

            quill.on('text-change', () => {
                setEditorContent(quill.root.innerHTML);
            });
        }
    }
}, [currentPage]);
    // Baaqi sara code...

    // Purana 'education' delete karke ye teenon add karein
const initialState = {
    name: '', title: '', email: '', phone: '', city: '', address: '',
    summary: '', skills: '',
    // Matric
    matDeg: '', matYear: '', matStatus: '',
    // Inter
    intDeg: '', intYear: '', intStatus: '',
    // Graduation
    gradDeg: '', gradYear: '', gradStatus: '',
    // Masters
    masDeg: '', masYear: '', masStatus: '',
    // PhD
    phdDeg: '', phdYear: '', phdStatus: '',
    experience: '',
    image: null
};


    const [data, setData] = useState(initialState);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isConverting, setIsConverting] = useState(false);
    const [bannerText, setBannerText] = useState('Open for Opportunities');
    const [bannerColor, setBannerColor] = useState('#3b82f6');
    const [logoText, setLogoText] = useState('MY LOGO');
    const [logoColor, setLogoColor] = useState('#ffffff');
    const [logoBgColor, setLogoBgColor] = useState('#3b82f6');
    const [logoShape, setLogoShape] = useState('square');
    const [logoFont, setLogoFont] = useState('Inter'); // Font ke liye
    const [logoIcon, setLogoIcon] = useState('★'); // Icon ke liye
    const [logoLayout, setLogoLayout] = useState('vertical'); // vertical, horizontal, icon-only
const [logoBorder, setLogoBorder] = useState('none'); // none, solid, double
const [logoShadow, setLogoShadow] = useState('heavy'); // soft, heavy, none
    const [bannerTagline, setBannerTagline] = useState('Professional Profile');
    const [bannerGradient, setBannerGradient] = useState('linear-gradient(135deg, #3b82f6, #1d4ed8)');
    const [bannerPattern, setBannerPattern] = useState('dots'); // dots, lines, none

    // --- UNZIP STATES ---
    const [unzippedFiles, setUnzippedFiles] = useState([]);

    // --- UNZIP LOGIC ---
    const handleUnzip = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // JSZip instance (Make sure index.html mein script tag ho)
        const zip = new window.JSZip();
        try {
            const contents = await zip.loadAsync(file);
            const filesArray = [];

            for (let filename in contents.files) {
                const zipEntry = contents.files[filename];
                if (!zipEntry.dir) {
                    const blob = await zipEntry.async("blob");
                    filesArray.push({
                        name: filename,
                        url: URL.createObjectURL(blob)
                    });
                }
            }
            setUnzippedFiles(filesArray);
            alert("File Unzipped Successfully!");
        } catch (err) {
            console.error(err);
            alert("Error unzipping file.");
        }
    };
    // --- MAKE ZIP LOGIC ---
    const handleMakeZip = async (event) => {
        const files = event.target.files;
        if (files.length === 0) return;

        const zip = new window.JSZip();

        // Har select ki hui file ko zip mein add karna
        for (let i = 0; i < files.length; i++) {
            zip.file(files[i].name, files[i]);
        }

        // Zip file generate karna
        try {
            const content = await zip.generateAsync({ type: "blob" });
            const zipUrl = URL.createObjectURL(content);

            // Auto-download link banana
            const link = document.createElement('a');
            link.href = zipUrl;
            link.download = "ResumePro_Files.zip";
            link.click();

            alert("Zip File Created & Downloaded!");
        } catch (err) {
            console.error(err);
            alert("Error making zip.");
        }
    };
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

    const downloadBanner = () => {
        const canvas = document.getElementById('bannerCanvas');
        const link = document.createElement('a');
        link.download = 'linkedin-banner.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    useEffect(() => {
        if (currentPage === 'banner') {
            const canvas = document.getElementById('bannerCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');

                // 1. Advanced Background (Gradient)
                const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                grd.addColorStop(0, bannerColor);
                grd.addColorStop(1, '#000000'); // Dark depth effect
                ctx.fillStyle = grd;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 2. Patterns (Decorative Elements)
                if (bannerPattern === 'dots') {
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    for (let i = 0; i < canvas.width; i += 40) {
                        for (let j = 0; j < canvas.height; j += 40) {
                            ctx.beginPath(); ctx.arc(i, j, 2, 0, Math.PI * 2); ctx.fill();
                        }
                    }
                }

                // 3. Branding Text (Modern Look)
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';

                // Main Text
                ctx.font = 'bold 90px Inter, system-ui';
                ctx.fillText(bannerText.toUpperCase(), canvas.width / 2, canvas.height / 2);

                // Tagline
                ctx.font = '300 40px Inter';
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fillText(bannerTagline, canvas.width / 2, canvas.height / 2 + 70);

                // Corner Logo
                ctx.font = 'bold 25px Inter';
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillText('DESIGNED BY RESUME.PRO', canvas.width - 250, canvas.height - 40);
            }
        }
    }, [bannerText, bannerColor, bannerTagline, bannerPattern, currentPage]);

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
        width: 88% !important; 
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
            // NAYA HOME BUTTON MOBILE KE LIYE
    e('div', { className: `nav-link ${currentPage === 'landing' ? 'active' : ''}`, style: { fontSize: '18px', fontWeight: 'bold' }, onClick: () => navigate('landing') }, 'Home'),
            e('div', { className: `nav-link ${currentPage === 'home' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('home') }, 'Resume Maker'),
            e('div', { className: `nav-link ${currentPage === 'wordToPdf' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('wordToPdf') }, 'Word to PDF'),
            e('div', { className: `nav-link ${currentPage === 'wordEditor' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('wordEditor') }, 'Word Editor'),
            e('div', { className: `nav-link ${currentPage === 'banner' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('banner') }, 'LinkedIn Banner'),

            // NAYA LOGO LINK (Mobile Ke Liye)
            e('div', { className: `nav-link ${currentPage === 'logo' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('logo') }, 'Logo Maker'),
            // Ye add karein:
            e('div', { className: `nav-link ${currentPage === 'unzip' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('unzip') }, 'Unzip File'),
            e('div', { className: `nav-link ${currentPage === 'makeZip' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('makeZip') }, 'Make Zip'),
            // Mobile menu ke links mein ye dalo:
            e('div', { className: `nav-link ${currentPage === 'privacy' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('privacy') }, 'Privacy Policy'),
            e('div', { className: `nav-link ${currentPage === 'terms' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('terms') }, 'Terms & Conditions'),
            e('div', { className: `nav-link ${currentPage === 'about' ? 'active' : ''}`, style: { fontSize: '18px' }, onClick: () => navigate('about') }, 'About'),
            e('button', { className: 'btn btn-theme', style: { marginTop: '20px', display: 'flex', justifyContent: 'center' }, onClick: () => setIsDarkMode(!isDarkMode) }, isDarkMode ? '☀️ Light' : '🌙 Dark')
        ),

        e('div', { className: 'header-wrapper' },
            e('div', { className: 'header-content' },
                e('div', { className: 'logo', onClick: () => navigate('home') }, 'RESUME.PRO'),
                e('div', { className: 'nav-links' },
                    // NAYA HOME BUTTON DESKTOP KE LIYE
    e('div', { className: `nav-link ${currentPage === 'landing' ? 'active' : ''}`, onClick: () => navigate('landing'), style: { fontWeight: 'bold' } }, 'Home'),
                    e('div', { className: `nav-link ${currentPage === 'home' ? 'active' : ''}`, onClick: () => navigate('home') }, 'Resume Maker'),
                    e('div', { className: `nav-link ${currentPage === 'wordToPdf' ? 'active' : ''}`, onClick: () => navigate('wordToPdf') }, 'Word to PDF'),
                    e('div', { className: `nav-link ${currentPage === 'banner' ? 'active' : ''}`, onClick: () => navigate('banner') }, 'LinkedIn Banner'),
                    e('div', { className: `nav-link ${currentPage === 'wordEditor' ? 'active' : ''}`, onClick: () => navigate('wordEditor') }, 'Word Editor'),
                    e('div', { className: `nav-link ${currentPage === 'logo' ? 'active' : ''}`, onClick: () => navigate('logo') }, 'Logo Maker'),
                    e('div', { className: `nav-link ${currentPage === 'unzip' ? 'active' : ''}`, onClick: () => navigate('unzip') }, 'Unzip File'),
                    e('div', { className: `nav-link ${currentPage === 'makeZip' ? 'active' : ''}`, onClick: () => navigate('makeZip') }, 'Make Zip'),
                    // Nav links ke andar 'About' ke bilkul niche ye dalo:
                    e('div', {
                        className: 'dropdown-container',
                        onMouseEnter: () => setIsPrivacyDropdownOpen(true),
                        onMouseLeave: () => setIsPrivacyDropdownOpen(false),
                        style: { cursor: 'pointer' }
                    },
                        // Main Label
                        e('div', {
                            className: `nav-link ${currentPage === 'privacy' || currentPage === 'terms' ? 'active' : ''}`,
                            style: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }
                        },
                            'Legal',
                            e('span', { style: { fontSize: '10px', opacity: 0.7 } }, '▼')
                        ),

                        // Dropdown Box
                        isPrivacyDropdownOpen && e('div', { className: 'dropdown-menu' },
                            e('div', {
                                className: 'dropdown-item',
                                onClick: () => navigate('privacy')
                            }, e('span', null, '🛡️'), 'Privacy Policy'),

                            e('div', {
                                className: 'dropdown-item',
                                onClick: () => navigate('terms')
                            }, e('span', null, '📜'), 'Terms & Conditions')
                        )
                    ),
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

        // --- UNZIP PAGE UI ---
        currentPage === 'unzip' && e('div', { style: { textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '0 15px 100px' } },
            e('h2', { style: { color: 'var(--accent)', marginBottom: '10px', fontWeight: '800' } }, 'Zip to Unzip Extractor'),
            e('p', { style: { fontSize: '14px', opacity: 0.7, marginBottom: '20px' } }, 'Extract files instantly without any server upload.'),

            e('div', { style: { background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' } },

                e('label', { className: 'file-upload-wrapper', style: { display: 'block', cursor: 'pointer', padding: '40px' } },
                    e('div', { style: { fontSize: '16px', fontWeight: 'bold' } }, '📂 Click to Upload ZIP File'),
                    e('input', { type: 'file', accept: '.zip', onChange: handleUnzip, style: { display: 'none' } })
                ),

                unzippedFiles.length > 0 && e('div', { style: { marginTop: '30px', textAlign: 'left', width: '100%' } },
                    e('h4', { style: { fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', color: 'var(--accent)' } }, 'Extracted Files:'),
                    unzippedFiles.map((f, i) =>
                        e('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' } },
                            e('span', { style: { fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' } }, f.name),
                            e('a', {
                                href: f.url,
                                download: f.name,
                                className: 'btn-primary',
                                style: { padding: '5px 12px', borderRadius: '5px', textDecoration: 'none', fontSize: '11px', background: 'var(--accent)', color: '#fff' }
                            }, 'Download')
                        )
                    )
                )
            )
        ),
        // --- MAKE ZIP PAGE UI ---
        currentPage === 'makeZip' && e('div', { style: { textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '0 15px 100px' } },
            e('h2', { style: { color: 'var(--accent)', marginBottom: '10px', fontWeight: '800' } }, 'Create Zip File'),
            e('p', { style: { fontSize: '14px', opacity: 0.7, marginBottom: '20px' } }, 'Select multiple files to compress them into a single ZIP.'),

            e('div', { style: { background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' } },

                e('label', { className: 'file-upload-wrapper', style: { display: 'block', cursor: 'pointer', padding: '40px' } },
                    e('div', { style: { fontSize: '16px', fontWeight: 'bold' } }, '📁 Select Files to Zip'),
                    // 'multiple' attribute lazmi hai taake ek se zyada files select ho sakein
                    e('input', { type: 'file', multiple: true, onChange: handleMakeZip, style: { display: 'none' } })
                ),

                e('p', { style: { fontSize: '11px', marginTop: '15px', opacity: 0.5 } }, 'Note: After selecting files, your ZIP will download automatically.')
            )
        ),

        // Header wrapper ke baad aur app-container se pehle ye dalo:
        e('div', { className: 'typewriter-container' },
            e('span', null, typewriterText),
            e('span', { className: 'cursor' })
        ),

        e('div', { className: 'app-container' },
            // --- ULTRA-PREMIUM & UNIQUE LANDING PAGE ---
currentPage === 'landing' && e('div', { style: { padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", position: 'relative' } },
    
    // Background Glow (Slightly visible for depth)
    e('div', { style: { position: 'absolute', top: '-10%', left: '50%', width: '400px', height: '400px', background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1, transform: 'translateX(-50%)' } }),

    // 1. Hero Section
    e('div', { style: { textAlign: 'center', marginBottom: '100px' } },
        e('div', { style: { display: 'inline-flex', alignItems: 'center', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '6px 16px', borderRadius: '100px', marginBottom: '30px' } },
            e('span', { style: { fontSize: '12px', marginRight: '8px' } }, '🚀'),
            e('span', { style: { color: 'var(--accent)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' } }, 'Next-Gen Career Platform')
        ),
        e('h1', { style: { fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: '950', lineHeight: '1', margin: '0 0 25px 0', letterSpacing: '-2px', color: 'var(--text)' } }, 
            'Create Without ', 
            e('span', { style: { color: 'var(--accent)', fontStyle: 'italic', fontWeight: '400' } }, 'Limits.')
        ),
        e('p', { style: { fontSize: '19px', opacity: 0.7, maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6', fontWeight: '400' } }, 
            'Professional tools for the modern professional. Fast, secure, and built for results.'
        ),
        e('button', { 
            className: 'btn main-cta', 
            onClick: () => navigate('home'), 
            style: { 
                padding: '20px 50px', 
                fontSize: '18px', 
                borderRadius: '100px', 
                background: 'var(--accent)', 
                color: '#fff', 
                border: 'none', 
                fontWeight: '800', 
                cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            } 
        }, 'Get Started Now — It\'s Free')
    ),

    // 2. Feature Grid (Re-designed with Glassmorphism)
    e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' } },
        
        // Feature 1
        e('div', { className: 'premium-card', style: { background: 'linear-gradient(145deg, var(--card-bg), var(--bg))', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' } },
            e('div', { style: { background: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '25px' } }, '✍️'),
            e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Resume Builder'),
            e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7', marginBottom: '30px' } }, 'Industry-standard templates that capture attention. Export to PDF in seconds with pixel-perfect precision.'),
            e('img', { src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500', style: { width: '110%', marginLeft: '-5%', borderRadius: '20px', height: '180px', objectFit: 'cover', opacity: 0.9 } })
        ),

        // Feature 2
        e('div', { className: 'premium-card', style: { background: 'linear-gradient(145deg, var(--card-bg), var(--bg))', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' } },
            e('div', { style: { background: 'rgba(147, 51, 234, 0.1)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '25px' } }, '🖼️'),
            e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Social Canvas'),
            e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7', marginBottom: '30px' } }, 'Personalize your LinkedIn presence with high-fidelity banners. Custom ratios for all professional networks.'),
            e('img', { src: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=500', style: { width: '110%', marginLeft: '-5%', borderRadius: '20px', height: '180px', objectFit: 'cover', opacity: 0.9 } })
        ),

        // Feature 3
        e('div', { className: 'premium-card', style: { background: 'linear-gradient(145deg, var(--card-bg), var(--bg))', borderRadius: '32px', padding: '40px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' } },
            e('div', { style: { background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '25px' } }, '🛠️'),
            e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Power Utilities'),
            e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7', marginBottom: '30px' } }, 'One-click ZIP extraction and a distraction-free Word editor. Built for speed and local privacy.'),
            e('img', { src: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500', style: { width: '110%', marginLeft: '-5%', borderRadius: '20px', height: '180px', objectFit: 'cover', opacity: 0.9 } })
        )
    ),

    // 3. CTA Footer (Compact & Bold)
    e('div', { style: { marginTop: '120px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '60px' } },
        e('h2', { style: { fontSize: '36px', fontWeight: '900', marginBottom: '10px' } }, 'Ready to start?'),
        e('p', { style: { opacity: 0.5, marginBottom: '30px' } }, 'No credit card. No signup. Just tools.'),
        e('button', { 
            onClick: () => navigate('home'), 
            style: { background: 'var(--text)', color: 'var(--bg)', border: 'none', padding: '15px 40px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' } 
        }, 'Open Resume Pro')
    )
),
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
                    e('div', { className: 'section-title' }, 'Education Details'),
                    
// Education Section Header
e('div', { className: 'section-title' }, 'Education History'),

// Loop for 5 Education Boxes
['mat', 'int', 'grad', 'mas', 'phd'].map((key) => {
    const labels = { mat: 'Matric', int: 'Intermediate', grad: 'Graduation', mas: 'Masters', phd: 'PhD' };
    return e('div', { key: key, style: { marginBottom: '20px', padding: '15px', border: '1px solid var(--border)', borderRadius: '10px' } },
        e('label', { style: { fontWeight: 'bold', display: 'block', marginBottom: '5px' } }, labels[key]),
        e('input', { 
            placeholder: 'Degree Name (e.g. Computer Science)', 
            onChange: (e) => update(`${key}Deg`, e.target.value),
            style: { marginBottom: '10px' }
        }),
        e('div', { className: 'grid-2' },
            e('input', { 
                placeholder: 'Year', 
                onChange: (e) => update(`${key}Year`, e.target.value) 
            }),
            e('select', { 
                onChange: (e) => update(`${key}Status`, e.target.value),
                style: { width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px' }
            },
                e('option', { value: '' }, 'Status'),
                e('option', { value: 'Passed' }, 'Passed'),
                e('option', { value: 'Result Awaited' }, 'Result Awaited'),
                e('option', { value: 'Studying' }, 'Currently Studying')
            )
        )
    );
}),
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
     // Check agar kisi bhi box mein data bhara gaya hai
(data.matDeg || data.intDeg || data.gradDeg || data.masDeg || data.phdDeg) && e('div', { style: { marginBottom: '15px' } },
    e('h4', { style: { borderBottom: '1px solid #eee', fontSize: '12px', paddingBottom: '3px' } }, 'EDUCATION'),
    ['mat', 'int', 'grad', 'mas', 'phd'].map(key => (
        data[`${key}Deg`] && e('div', { key, style: { marginBottom: '8px' } },
            e('p', { style: { fontSize: '12px', fontWeight: 'bold', margin: '0' } }, data[`${key}Deg`]),
            e('p', { style: { fontSize: '11px', color: '#64748b', margin: '0' } }, 
                `${data[`${key}Year`]} | ${data[`${key}Status`]}`
            )
        )
    ))
),
                        data.skills && e('div', null,
                            e('h4', { style: { borderBottom: '1px solid #eee', fontSize: '12px', paddingBottom: '3px' } }, 'SKILLS'),
                            e('p', { style: { fontSize: '12px' } }, data.skills)
                        )
                    )
                )
            ),

            currentPage === 'wordToPdf' && e('div', {
                style: {
                    textAlign: 'center',
                    padding: '20px 15px', // Top padding mobile ke hisab se set ki
                    minHeight: '70vh',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px' // Sab items ke darmiyan barabar gap rakhega
                }
            },
                e('h2', {
                    style: {
                        marginTop: '20px', // Heading ko header se thora neechay kiya
                        marginBottom: '10px'
                    }
                }, 'Convert Word to PDF'),

                // 1. Upar Wala Dabba (Ab spacing ke sath)
                e('label', {
                    className: 'file-upload-wrapper',
                    style: {
                        maxWidth: '400px',
                        margin: '10px auto', // Auto margin centered rakhne ke liye
                        width: '90%', // Mobile par side se thori jagah chori
                        display: 'block',
                        padding: '40px 20px', // Dabbe ke andar ki space
                        cursor: 'pointer'
                    }
                },
                    e('div', { style: { fontSize: '15px' } }, isConverting ? '⏳ Converting...' : '📂 Choose Word File'),
                    e('input', {
                        type: 'file',
                        accept: '.docx',
                        onChange: handleWordToPdf,
                        style: { display: 'none' }
                    })
                ),

                // 2. Neechay Wala Button (Bilkul same position par)
                e('div', {
                    style: {
                        textAlign: 'center',
                        padding: '40px 0',
                        marginTop: 'auto' // Isay hamesha footer ke paas rakhega
                    }
                },
                    e('label', {
                        className: 'btn btn-primary',
                        style: {
                            margin: '0 auto',
                            background: '#3b82f6',
                            color: '#fff',
                            padding: '12px 30px',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            width: 'fit-content'
                        }
                    },
                        isConverting ? '⏳ Converting...' : '📄 Convert & Download PDF',
                        e('input', {
                            type: 'file',
                            accept: '.docx',
                            onChange: handleWordToPdf,
                            style: { display: 'none' }
                        })
                    )
                )
            ),
            currentPage === 'wordEditor' && e('div', { style: { maxWidth: '800px', margin: '0 auto', padding: '20px' } },
    e('h2', { style: { color: 'var(--accent)', textAlign: 'center', marginBottom: '10px' } }, 'Word Article Editor'),
    e('p', { style: { textAlign: 'center', opacity: 0.6, fontSize: '14px', marginBottom: '20px' } }, 'Write your essay or article and download it as a Word file.'),
    
    // Editor ka dabba
    e('div', { style: { background: '#fff', color: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' } },
        e('div', { id: 'editor-container', style: { height: '400px', fontSize: '16px' } })
    ),

    // Download Button
    e('button', {
        className: 'btn btn-primary',
        onClick: handleDownloadWord,
        style: { margin: '30px auto', display: 'block', background: '#3b82f6', color: '#fff', padding: '12px 30px', borderRadius: '8px' }
    }, '📥 Download .docx File')
),

            currentPage === 'about' && e('div', { style: { textAlign: 'left', maxWidth: '800px', margin: '0 auto', padding: '50px 20px', minHeight: '60vh', lineHeight: '1.6' } },
                e('h1', { style: { textAlign: 'center', color: 'var(--accent)' } }, 'Welcome to Resume Pro'),
                e('p', null, 'Your all-in-one solution for professional career branding. We believe that a great career starts with a great first impression, and we are here to help you make it count.'),
                e('h3', { style: { marginTop: '30px', color: 'var(--accent)' } }, 'What We Offer:'),
                e('ul', null,
                    e('li', { style: { marginBottom: '10px' } }, e('strong', null, 'Instant Resume Builder: '), 'No more struggling with formatting. Simply fill out our intuitive form, and our system will generate a polished, professional CV tailored to industry standards.'),
                    e('li', { style: { marginBottom: '10px' } }, e('strong', null, 'Seamless File Conversion: '), 'We provide a built-in Word-to-PDF converter, ensuring your documents are always in the right format for any job application.'),
                    e('li', { style: { marginBottom: '10px' } },
                        e('strong', null, 'LinkedIn Banner Designer: '),
                        'Elevate your professional profile with our high-impact banner maker. Create custom, high-definition LinkedIn covers with modern patterns and gradients to stand out to recruiters.'
                    ),
                    e('li', { style: { marginBottom: '10px' } },
                        e('strong', null, 'Logo Designer: '),
                        'Build your personal brand from scratch. Our intuitive logo maker allows you to design minimalist and professional logos with custom icons, fonts, and color schemes in seconds.'
                    ),
                    e('li', { style: { marginBottom: '10px' } },
                        e('strong', null, 'Advanced Zip Creator: '),
                        'Effortlessly bundle multiple documents and images into a single compressed ZIP file for easier sharing and organization.'
                    ),
                    e('li', { style: { marginBottom: '10px' } },
    e('strong', null, 'Professional Word Editor: '),
    'Write articles, essays, or any document using our built-in MS Word-style editor. Customize fonts, formatting, and download your work directly as a .docx file.'
),

                    e('li', { style: { marginBottom: '10px' } },
                        e('strong', null, 'Instant File Unzipper: '),
                        'Extract and view files from any ZIP archive directly in your browser with high-speed, local processing that keeps your data secure.'
                    ),
                    e('li', { style: { marginBottom: '10px' } }, e('strong', null, 'Professional Templates: '), 'Choose from a variety of layouts designed to catch the eye of recruiters and hiring managers.')
                ),
                e('h3', { style: { marginTop: '30px', color: 'var(--accent)' } }, 'Our Vision:'),
                e('p', null, 'At Resume Pro, we are constantly evolving. While we currently focus on making resume creation easy and efficient, we are committed to adding more advanced features in the future to help you navigate your professional journey with confidence.')
            )
        ),
        // --- UPDATED PRIVACY POLICY SECTION (Manually Replace This Block) ---
        currentPage === 'privacy' && e('div', { style: { maxWidth: '850px', margin: '0 auto', padding: '40px 20px', minHeight: '70vh', lineHeight: '1.7' } },
            e('h1', { style: { color: 'var(--accent)', textAlign: 'center', marginBottom: '10px', fontWeight: '800' } }, 'Privacy Policy for RESUME.PRO'),
            e('p', { style: { textAlign: 'center', opacity: 0.6, marginBottom: '30px', fontSize: '14px' } }, 'Latest Update'),

            e('div', { style: { background: 'var(--card-bg)', padding: '35px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } },

                e('p', { style: { marginBottom: '20px' } }, 'At ', e('strong', { style: { color: 'var(--accent)' } }, 'RESUME.PRO'), ', we prioritize the privacy of our visitors. This policy explains that we do not collect your personal data and how we process information locally.'),

                // Section 1
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '1. No Data Collection (Server-Side)'),
                e('p', null, 'Unlike traditional platforms, RESUME.PRO does not have a backend server or database.'),
                e('ul', { style: { paddingLeft: '20px', marginTop: '10px' } },
                    e('li', null, 'We do not collect, store, or share any personal information you enter.'),
                    e('li', null, 'All data stays within your own web browser and is cleared once you refresh or close the page.')
                ),

                // Section 2
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '2. Client-Side Processing'),
                e('p', null, 'Your personal details (Name, Email, Experience, etc.) and uploaded images remain on your device. We use JavaScript and HTML5 to process files locally. Your files are ', e('strong', null, 'never uploaded'), ' to our servers.'),

                // Section 3
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '3. Third-Party Libraries & Services'),
                e('p', null, 'We utilize trusted open-source libraries (such as html2pdf, html2canvas, and mammoth.js) to provide design features. These libraries operate entirely within your browser.'),

                // Section 4
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '4. Hosting & Analytics'),
                e('p', null, 'Our website is hosted on Vercel. Vercel may collect standard log files (like IP addresses and browser types) for security monitoring, which is not linked to your personal data.'),

                // Section 5
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '5. Cookies'),
                e('p', null, 'We do not use cookies for tracking. Your browser may only use "Local Storage" to remember your theme preference (Dark/Light mode).'),

                // Section 6
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '6. Children’s Information'),
                e('p', null, 'RESUME.PRO is safe for all age groups. We do not knowingly solicit or store any information from minors.'),

                // Section 7 & 8
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '7. Contact Us'),
                e('p', null, 'If you have any questions about our Privacy Policy, do not hesitate to contact us through our Email [resumeprohub1@gmail.com].')
            )
        ),

        currentPage === 'terms' && e('div', {
            style: {
                maxWidth: '850px',
                margin: '0 auto',
                padding: '20px 15px', // Mobile ke liye padding kam kar di
                minHeight: '80vh',
                color: 'var(--text)'
            }
        },
            e('h1', {
                style: {
                    color: 'var(--accent)',
                    textAlign: 'center',
                    fontSize: '24px', // Mobile par 32px bahut bada lagta tha, 24px sahi hai
                    fontWeight: '800',
                    marginBottom: '10px'
                }
            }, 'Terms and Conditions'),

            e('p', {
                style: {
                    textAlign: 'center',
                    opacity: 0.6,
                    marginBottom: '25px',
                    fontSize: '13px'
                }
            }, 'Last Updated: March 20, 2026'),

            e('div', {
                style: {
                    background: 'var(--card-bg)',
                    padding: '20px', // Card ki padding 40 se 20 kar di taake text ko jagah mile
                    borderRadius: '16px', // Zyada rounded corners mobile par ajeeb lagte hain
                    border: '1px solid var(--border)',
                    lineHeight: '1.6',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    fontSize: '14px' // Text size mobile readable rakha hai
                }
            },
                e('p', { style: { marginBottom: '15px' } }, 'Welcome to ResumePro (https://resumepro.theglobalhubb.com/). By accessing and using this website, you agree to the following terms:'),

                // Section 1
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '1. Nature of Service'),
                e('p', null, 'ResumePro is a client-side, browser-based tool built with React/JavaScript. It is designed to help users generate resumes for personal use.'),

                // Section 2
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '2. No User Data Collection'),
                e('p', null, e('strong', null, 'Privacy First: '), 'We do not have a backend or database. We do not require users to create accounts or log in.'),
                e('p', null, e('strong', null, 'Local Processing: '), 'All information you enter into the resume builder is processed locally in your browser. We do not store, save, or track any personal data or the content of the resumes you create.'),

                // Section 3
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '3. Intellectual Property'),
                e('p', null, 'All website design, code, and templates provided on ResumePro are the intellectual property of the site owner. You are granted a license to use the templates to create your personal resume. You may not copy the source code or redistribute our templates for commercial sale.'),

                // Section 4
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '4. Limitation of Liability'),
                e('p', null, e('strong', null, '"As-Is" Basis: '), 'This website is provided "as-is" without any warranties. While we strive for accuracy, ResumePro is not responsible for any errors in the final resume or for your employment results.'),
                e('p', null, e('strong', null, 'No Responsibility for Data Loss: '), 'Since we do not store your data, if you refresh the page or clear your browser cache, your progress may be lost. We are not responsible for any such data loss.'),

                // Section 5
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '5. Third-Party Links'),
                e('p', null, 'Our website may contain links to external sites. We are not responsible for the content or privacy practices of those third-party websites.'),

                // Section 6
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '6. Changes to Terms'),
                e('p', null, 'We reserve the right to update these terms at any time. Any changes will be posted on this page.'),

                // Section 7
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px' } }, '7. Contact Information'),
                e('p', null, 'If you have any questions about these terms, you can reach out to us at:'),
                e('p', { style: { marginTop: '10px' } }, 'Website: https://resumepro.theglobalhubb.com/'),
                e('p', null, 'Email: [resumeprohub1@gmail.com]') // Yahan apni email likh dena
            )
        ),

        currentPage === 'contact' && e('div', { style: { maxWidth: '600px', margin: '0 auto', padding: '60px 20px', minHeight: '80vh' } },
            e('h1', { style: { color: 'var(--accent)', textAlign: 'center', fontWeight: '800', marginBottom: '10px' } }, 'Get In Touch'),
            e('p', { style: { textAlign: 'center', opacity: 0.7, marginBottom: '30px' } }, 'Send us a message and we will get back to you soon.'),

            e('div', {
                style: { background: 'var(--card-bg)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }
            },
                // FIX: Yahan action mein aapki ID 'myknvklo' add kar di hai
                e('form', { action: "https://formspree.io/f/myknvklo", method: "POST" },
                    e('div', { style: { marginBottom: '15px' } },
                        e('label', { style: { display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: '600' } }, 'Name'),
                        e('input', { type: 'text', name: 'name', placeholder: 'Your Name', required: true, style: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' } })
                    ),
                    e('div', { style: { marginBottom: '15px' } },
                        e('label', { style: { display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: '600' } }, 'Email'),
                        e('input', { type: 'email', name: 'email', placeholder: 'your@email.com', required: true, style: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' } })
                    ),
                    e('div', { style: { marginBottom: '20px' } },
                        e('label', { style: { display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: '600' } }, 'Message'),
                        e('textarea', { name: 'message', rows: 5, placeholder: 'How can we help you?', required: true, style: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' } })
                    ),
                    e('button', {
                        type: 'submit',
                        style: { width: '100%', background: 'var(--accent)', color: '#fff', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }
                    }, '🚀 Send Message')
                )
            )
        ),
        currentPage === 'banner' && e('div', { style: { textAlign: 'center', maxWidth: '900px', margin: '0 auto', padding: '0 15px 100px' } },
            e('h2', { style: { color: 'var(--accent)', marginBottom: '5px', fontSize: '28px', fontWeight: '800' } }, 'Premium Banner Studio'),
            e('p', { style: { marginBottom: '30px', fontSize: '14px', opacity: 0.7 } }, 'Create high-impact LinkedIn banners with patterns and gradients.'),

            e('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--card-bg)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' } },

                // Advanced Canvas Preview
                e('canvas', {
                    id: 'bannerCanvas',
                    width: 1584,
                    height: 396,
                    style: { width: '100%', borderRadius: '12px', border: '2px solid var(--border)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }
                }),

                // Controls Grid
                e('div', { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
                    e('div', { className: 'grid-2' },
                        e('input', { placeholder: 'Headline (e.g. Software Engineer)', value: bannerText, onChange: (e) => setBannerText(e.target.value) }),
                        e('input', { placeholder: 'Tagline (e.g. Building Scalable Apps)', value: bannerTagline, onChange: (e) => setBannerTagline(e.target.value) })
                    ),

                    e('div', { className: 'grid-2' },
                        e('div', null,
                            e('label', { style: { fontSize: '11px', display: 'block', marginBottom: '5px' } }, 'Pick Theme Color'),
                            e('input', { type: 'color', value: bannerColor, onChange: (e) => setBannerColor(e.target.value), style: { height: '45px', cursor: 'pointer' } })
                        ),
                        e('div', null,
                            e('label', { style: { fontSize: '11px', display: 'block', marginBottom: '5px' } }, 'Background Pattern'),
                            e('select', {
                                value: bannerPattern,
                                onChange: (e) => setBannerPattern(e.target.value),
                                style: { padding: '12px', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)', width: '100%' }
                            },
                                e('option', { value: 'dots' }, 'Modern Dots'),
                                e('option', { value: 'none' }, 'Clean Solid')
                            )
                        )
                    )
                ),

                e('button', {
                    className: 'btn btn-primary',
                    onClick: downloadBanner,
                    style: { margin: '10px auto 0', background: 'linear-gradient(45deg, #3b82f6, #2563eb)', color: '#fff', padding: '15px 50px', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '14px', width: '100%', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)' }
                }, '🚀 Export Ultra-HD Banner')
            )
        ), // <-- YAHAN BANNER WALA BLOCK CLOSE HO GAYA HAI (Jo pehle open reh gaya tha)

        currentPage === 'logo' && e('div', { style: { textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '0 15px 100px' } },
            e('h2', { style: { color: 'var(--accent)', marginBottom: '10px' } }, 'Advanced Logo Designer'),
            e('p', { style: { fontSize: '13px', opacity: 0.7, marginBottom: '20px' } }, 'Design professional brand icons in seconds'),

            e('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' } },

                // --- STYLISH PREVIEW BOX (Design wahi hai) ---
                e('div', {
    id: 'finalLogo',
    style: {
        width: '240px', height: '240px',
        display: 'flex', 
        // Layout shift logic
        flexDirection: logoLayout === 'horizontal' ? 'row' : 'column', 
        alignItems: 'center', justifyContent: 'center', gap: '15px',
        backgroundColor: logoBgColor,
        borderRadius: logoShape === 'circle' ? '50%' : '20px',
        color: logoColor,
        border: logoBorder === 'solid' ? `4px solid ${logoColor}` : 'none',
        boxShadow: logoShadow === 'heavy' ? '0 20px 50px rgba(0,0,0,0.3)' : 'none',
        padding: '20px', transition: '0.3s'
    }
},
    // Icon Section
    e('div', { style: { fontSize: logoLayout === 'icon-only' ? '100px' : '60px' } }, logoIcon),
    
    // Text Section (Sirf tab dikhega agar icon-only na ho)
    logoLayout !== 'icon-only' && e('div', {
        style: {
            fontSize: '24px', fontWeight: '900', fontFamily: logoFont,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            borderLeft: logoLayout === 'horizontal' ? `2px solid ${logoColor}` : 'none',
            paddingLeft: logoLayout === 'horizontal' ? '15px' : '0'
        }
    }, logoText)
),
// --- YAHAN SE PASTE KAREIN ---
e('div', { style: { marginTop: '25px' } },
    // 1. Layout Selector (Cards)
    e('label', { style: { fontSize: '12px', fontWeight: '800', display: 'block', marginBottom: '12px', color: '#64748b', letterSpacing: '1px' } }, 'CHOOSE LAYOUT'),
    e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' } },
        ['vertical', 'horizontal', 'icon-only'].map(layout => (
            e('div', {
                key: layout,
                onClick: () => setLogoLayout(layout),
                style: {
                    padding: '12px 8px', textAlign: 'center', cursor: 'pointer', borderRadius: '12px',
                    border: logoLayout === layout ? '2px solid #3b82f6' : '1px solid var(--border)',
                    background: logoLayout === layout ? '#3b82f615' : 'transparent',
                    transition: '0.3s all ease',
                    fontWeight: logoLayout === layout ? '700' : '400',
                    color: logoLayout === layout ? '#3b82f6' : 'var(--text)'
                }
            }, layout.charAt(0).toUpperCase() + layout.slice(1))
        ))
    ),

    // 2. Frame Style (Pill Switch)
    e('div', { style: { marginTop: '20px' } },
        e('label', { style: { fontSize: '12px', fontWeight: '800', display: 'block', marginBottom: '12px', color: '#64748b' } }, 'FRAME STYLE'),
        e('div', { style: { display: 'flex', gap: '8px', background: 'var(--input-bg)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border)' } },
            ['none', 'solid'].map(style => (
                e('button', {
                    key: style,
                    onClick: () => setLogoBorder(style),
                    style: {
                        flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                        background: logoBorder === style ? '#3b82f6' : 'transparent',
                        color: logoBorder === style ? '#fff' : 'var(--text)',
                        fontSize: '13px', fontWeight: '600', transition: '0.3s'
                    }
                }, style === 'none' ? 'Clean' : 'Framed')
            ))
        )
    )
),
// --- YAHAN TAK ---

                // --- CONTROLS ---
                e('div', { style: { width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' } },
                    e('div', { className: 'grid-2' },
                        e('input', { placeholder: 'Brand Name', value: logoText, onChange: (e) => setLogoText(e.target.value) }),
                        e('select', { value: logoIcon, onChange: (e) => setLogoIcon(e.target.value), style: { padding: '12px', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)' } },
                            e('option', { value: '★' }, 'Star'),
                            e('option', { value: '⚡' }, 'Energy'),
                            e('option', { value: '💎' }, 'Diamond'),
                            e('option', { value: '🚀' }, 'Startup'),
                            e('option', { value: '🔥' }, 'Trend'),
                            e('option', { value: '👑' }, 'Premium')
                        )
                    ),

                    e('select', { value: logoFont, onChange: (e) => setLogoFont(e.target.value), style: { padding: '12px', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)' } },
                        e('option', { value: 'Inter' }, 'Modern Sans'),
                        e('option', { value: 'Georgia' }, 'Classic Serif'),
                        e('option', { value: 'Courier New' }, 'Tech Mono'),
                        e('option', { value: 'Impact' }, 'Bold Impact')
                    ),

                    e('div', { className: 'grid-2' },
                        e('div', null,
                            e('label', { style: { fontSize: '11px', display: 'block', marginBottom: '5px' } }, 'Text Color'),
                            e('input', { type: 'color', value: logoColor, onChange: (e) => setLogoColor(e.target.value), style: { height: '40px' } })
                        ),
                        e('div', null,
                            e('label', { style: { fontSize: '11px', display: 'block', marginBottom: '5px' } }, 'Backdrop'),
                            e('input', { type: 'color', value: logoBgColor, onChange: (e) => setLogoBgColor(e.target.value), style: { height: '40px' } })
                        )
                    ),

                    e('select', { value: logoShape, onChange: (e) => setLogoShape(e.target.value), style: { padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' } },
                        e('option', { value: 'square' }, 'Square Style'),
                        e('option', { value: 'circle' }, 'Circular Style')
                    )
                ),

                // --- WORKING DOWNLOAD BUTTON ---
                e('button', {
                    className: 'btn btn-primary',
                    onClick: () => {
                        const element = document.getElementById('finalLogo');
                        if (typeof html2canvas === 'undefined') {
                            alert('Bhai, index.html mein library missing hai! Please Step 1 follow karo.');
                            return;
                        }
                        html2canvas(element, {
                            backgroundColor: null, // Transparent background support
                            scale: 3, // High quality 4K output
                            useCORS: true
                        }).then(canvas => {
                            const link = document.createElement('a');
                            link.download = `${logoText || 'logo'}-resume-pro.png`;
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        });
                    },
                    style: { background: 'linear-gradient(45deg, #3b82f6, #2563eb)', color: '#fff', padding: '15px', width: '100%', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)', cursor: 'pointer' }
                }, '🚀 Download 4K Logo')
            )
        ),
        currentPage === 'home' && e('div', { style: { textAlign: 'center', padding: '40px 0', background: 'transparent', marginTop: '0' } },
            e('button', { className: 'btn btn-primary', onClick: () => window.print(), style: { margin: '0 auto', background: '#3b82f6', color: '#fff', padding: '12px 30px', border: 'none', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' } }, '💾 Download My Resume')
        ),

        e('footer', { className: 'footer', style: { padding: '40px 0', marginTop: '50px', borderTop: '1px solid var(--border)' } },
            e('div', { style: { textAlign: 'center' } },
                e('div', { style: { fontWeight: '800', color: '#3b82f6', fontSize: '20px', cursor: 'pointer', marginBottom: '10px' }, onClick: () => navigate('home') }, 'RESUME.PRO'),

                // --- Footer Navigation ---
                e('div', { style: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' } },
                    e('span', { className: 'nav-link', style: { fontSize: '13px', cursor: 'pointer' }, onClick: () => navigate('privacy') }, 'Privacy Policy'),
                    e('span', { className: 'nav-link', style: { fontSize: '13px', cursor: 'pointer' }, onClick: () => navigate('terms') }, 'Terms & Conditions'),
                    e('span', { className: 'nav-link', style: { fontSize: '13px', cursor: 'pointer', color: 'var(--accent)', fontWeight: 'bold' }, onClick: () => navigate('contact') }, '📩 Contact Us')
                ),

                e('p', { className: 'footer-text', style: { opacity: 0.8 } }, 'Created with ❤️ by Paras'),
                e('p', { className: 'footer-text', style: { opacity: 0.5, fontSize: '12px' } }, `© ${new Date().getFullYear()} All Rights Reserved`)
            )
        )
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));

