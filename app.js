const e = React.createElement;
const { useState, useEffect } = React;

const App = () => {

    const [bannerAlign, setBannerAlign] = useState('center'); // left, center, right
    const [bannerFontFamily, setBannerFontFamily] = useState('Inter, sans-serif');
    const [bannerTheme, setBannerTheme] = useState('modern'); // 'modern' or 'minimal'
    const [bannerGlass, setBannerGlass] = useState(true);     // Glass effect toggle
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
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
    

    const [references, setReferences] = useState('');
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
        const updateCanvas = () => {
            const canvas = document.getElementById('bannerCanvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            try {
                // 1. Clear & Background (Gradient)
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                grd.addColorStop(0, bannerColor || '#3b82f6');
                grd.addColorStop(1, '#000000');
                ctx.fillStyle = grd;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 2. Patterns
                if (bannerPattern === 'dots') {
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    for (let i = 0; i < canvas.width; i += 40) {
                        for (let j = 0; j < canvas.height; j += 40) {
                            ctx.beginPath();
                            ctx.arc(i, j, 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                } else if (bannerPattern === 'lines') {
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < canvas.width + 200; i += 50) {
                        ctx.beginPath();
                        ctx.moveTo(i, 0);
                        ctx.lineTo(i - 150, canvas.height);
                        ctx.stroke();
                    }
                }

                // 3. Text Alignment Position
                let xPos = canvas.width / 2;
                if (bannerAlign === 'left') xPos = 100;
                else if (bannerAlign === 'right') xPos = canvas.width - 100;

                // 4. Draw Main Text
                ctx.textAlign = bannerAlign || 'center';
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold 90px ${bannerFontFamily || 'sans-serif'}`;
                const mainText = (bannerText || 'YOUR NAME').toUpperCase();
                ctx.fillText(mainText, xPos, canvas.height / 2);

                // 5. Draw Tagline
                ctx.font = `300 40px ${bannerFontFamily || 'sans-serif'}`;
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                const subText = bannerTagline || 'Professional Tagline';
                ctx.fillText(subText, xPos, canvas.height / 2 + 75);

                // 6. Watermark (Fixed)
                ctx.font = 'bold 20px sans-serif';
                ctx.textAlign = 'right';
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fillText('DESIGNED BY RESUME.PRO', canvas.width - 50, canvas.height - 40);

            } catch (err) {
                console.error("Canvas drawing error:", err);
            }
        };

        // Chhota sa delay taake canvas DOM mein load ho jaye
        const timeoutId = setTimeout(updateCanvas, 50);
        return () => clearTimeout(timeoutId);

    }, [bannerText, bannerTagline, bannerColor, bannerPattern, bannerAlign, bannerFontFamily, currentPage]);
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
            background-image: linear-gradient(rgba(10, 10, 10, 0.85), rgba(8, 8, 8, 0.93)), url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1920&q=80');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            color: var(--text); 
            font-family: 'Inter', system-ui, sans-serif; 
            margin: 0; 
            transition: all 0.3s ease;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
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
            flex: 1; width: 100%; box-sizing: border-box; overflow-x: hidden;
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
            max-height: 600vh; 
            margin-bottom:100px;
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
        width: 100% !important;
        box-sizing: border-box !important;
    }

    /* Form Section */
    .form-side { 
        order: 1 !important; 
        width: 100% !important; 
        max-height: none !important; 
        position: relative !important;
        overflow: visible !important;
        margin-bottom: 20px;
        box-sizing: border-box !important;
    }

    /* Resume Preview Section */
    .preview-side { 
        order: 2 !important; 
        width: 100% !important; 
        position: relative !important; 
        top: 0 !important;
        margin-top: 20px !important;
        margin-bottom: 40px !important;
        min-height: 500px !important; 
        height: auto !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        display: block !important;
        box-sizing: border-box !important;
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
            .header-wrapper, .form-side, .footer, .hamburger, .mobile-menu, .template-selector, .btn-primary, .typewriter-container, .resume-intro, .mobile-container { display: none !important; }
            .preview-side { width: 100%; border: none; box-shadow: none; padding: 0; position: static; margin: 0; }
            .main-layout { display: block; }
            body { background: white; }
            /* Ads hide karo print mein */
            script + div, [id^="container-"], iframe { display: none !important; }
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
            e('div', {
    className: 'logo',
    style: {
        fontSize: '1.8rem',
        fontWeight: '900',
        letterSpacing: '1.5px',
        textAlign: 'center',
        marginBottom: '40px',
        marginTop: '10px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    onClick: () => {
        setIsMenuOpen(false);
        navigate('landing');
    }
},

    // RESUME - Same style as PRO
    e('span', {
        style: {
            color: '#60a5fa',
            marginRight: '8px',
            fontSize: '1.35rem',
            fontWeight: '900',
            textShadow: '0 0 12px rgba(96, 165, 250, 0.8)',
            letterSpacing: '1px'
        }
    }, 'RESUME'),

    // PRO
    e('span', {
        style: {
            color: '#60a5fa',
            fontSize: '1.35rem',
            fontWeight: '900',
            textShadow: '0 0 12px rgba(96, 165, 250, 0.8)',
            letterSpacing: '1px'
        }
    }, 'PRO')
),
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
        currentPage === 'unzip' && e('div', { style: { maxWidth: '800px', margin: '0 auto', padding: '20px 15px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' } },

            // --- Consistent Modern Header ---
            e('div', { style: { marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                e('h2', {
                    style: {
                        color: 'var(--accent)',
                        fontSize: 'clamp(28px, 5vw, 42px)', // Baki pages jaisa responsive size
                        fontWeight: '900',                  // Weight ko 800 se barha kar 900 kiya
                        marginBottom: '12px',
                        letterSpacing: '-0.5px'
                    }
                }, 'Zip to Unzip Extractor'),
                e('p', {
                    style: {
                        fontSize: '16px',
                        opacity: 0.75, // Standard professional opacity
                        lineHeight: '1.6',
                        margin: '0',
                        maxWidth: '650px'
                    }
                }, 'Extract your compressed ZIP archives instantly and securely right inside your browser. With zero server uploads required, your data remains 100% private, safe, and lightning-fast to access.')
            ),
            // ---------------------------------

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
        currentPage === 'makeZip' && e('div', { style: { maxWidth: '800px', margin: '0 auto', padding: '20px 15px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' } },

            // --- Consistent Modern Header ---
            e('div', { style: { marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                e('h2', {
                    style: {
                        color: 'var(--accent)',
                        fontSize: 'clamp(28px, 5vw, 42px)', // Baki pages jaisa responsive size
                        fontWeight: '900',                  // Weight ko 800 se barha kar 900 kiya
                        marginBottom: '12px',
                        letterSpacing: '-0.5px'
                    }
                }, 'Create ZIP File'),
                e('p', {
                    style: {
                        fontSize: '16px',
                        opacity: 0.75, // Standard professional opacity
                        lineHeight: '1.6',
                        margin: '0',
                        maxWidth: '650px'
                    }
                }, 'Compress multiple files or entire folders into a single, optimized ZIP archive instantly. Process everything securely right inside your browser with maximum privacy and zero server wait times.')
            ),
            // ---------------------------------

            e('div', { style: { background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' } },

                e('label', { className: 'file-upload-wrapper', style: { display: 'block', cursor: 'pointer', padding: '40px' } },
                    e('div', { style: { fontSize: '16px', fontWeight: 'bold' } }, '📁 Select Files to Zip'),
                    // 'multiple' attribute lazmi hai taake ek se zyada files select ho sakein
                    e('input', { type: 'file', multiple: true, onChange: handleMakeZip, style: { display: 'none' } })
                ),

                e('p', { style: { fontSize: '11px', marginTop: '15px', opacity: 0.5 } }, 'Note: After selecting files, your ZIP will download automatically.')
            )
        ),

        // Typewriter sirf landing page par show karo
        currentPage === 'landing' && e('div', { className: 'typewriter-container' },
            e('span', null, typewriterText),
            e('span', { className: 'cursor' })
        ),

     e('div', { className: 'app-container' },

            // =========================================
            // 🌟 ULTRA-WIDE FLUID PREMIUM LANDING PAGE
            // =========================================
            currentPage === 'landing' && e('div', { className: 'full-screen-landing', style: { width: '100%', boxSizing: 'border-box' } },

                // Deep Glowing Background Orbs
                e('div', { style: { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1, overflow: 'hidden' } },
                    e('div', { style: { position: 'absolute', top: '10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }, className: 'float-heavy' }),
                    e('div', { style: { position: 'absolute', bottom: '10%', right: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }, className: 'float-heavy' })
                ),

                // 1. MASSIVE HERO SECTION (Centered & Stretched)
                e('div', { className: 'hero-flex-container animate-slide-up', style: { width: '100%', boxSizing: 'border-box' } },
                    
                    e('div', { className: 'floating-element heavy-glow', style: { display: 'inline-flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '12px 28px', borderRadius: '100px', marginBottom: '35px' } },
                        e('span', { style: { fontSize: '16px', marginRight: '12px' } }, '⚡'),
                        e('span', { style: { color: 'var(--accent)', fontSize: '13px', fontWeight: '850', letterSpacing: '2px', textTransform: 'uppercase' } }, 'Version 2.0 Is Live')
                    ),
                    
                    e('h1', { style: { fontSize: 'clamp(44px, 8.5vw, 95px)', fontWeight: '950', lineHeight: '1.05', margin: '0 0 25px 0', letterSpacing: '-3px', color: 'var(--text)', width: '100%', boxSizing: 'border-box' } },
                        'Master Your ',
                        e('span', { className: 'text-gradient' }, 'Workflow.')
                    ),
                    
                    e('p', { style: { fontSize: 'clamp(18px, 2vw, 22px)', opacity: 0.75, maxWidth: '850px', margin: '0 auto 45px', lineHeight: '1.6', fontWeight: '400', width: '100%', boxSizing: 'border-box' } },
                        'Deploy production-ready documents, extract archives in milliseconds, and craft pixel-perfect branding without ever leaving your browser.'
                    ),
                    
                    e('button', {
                        className: 'btn main-cta heavy-glow',
                        onClick: () => navigate('home'),
                        style: { padding: '22px 65px', fontSize: '19px', borderRadius: '100px', background: 'var(--text)', color: 'var(--bg)', border: 'none', fontWeight: '900', cursor: 'pointer', display: 'inline-block' }
                    }, 'Get Started Now ')
                ),

                // 2. ARTICLE TYPE DETAIL SECTION (Full Width Layout)
                e('div', { className: 'animate-slide-up delay-1', style: { width: '100%', margin: '60px 0', display: 'flex', flexDirection: window.innerWidth < 900 ? 'column' : 'row', gap: '40px', alignItems: 'center', boxSizing: 'border-box' } },
                    
                    // Left Text Side
                    e('div', { className: 'article-box-fluid', style: { flex: 1.3 } },
                        e('h2', { style: { fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', marginBottom: '25px', color: 'var(--text)', lineHeight: '1.2' } }, 'Built for the Modern Webmaster & Creator'),
                        e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, marginBottom: '20px' } }, 
                            'In today’s fast-paced digital ecosystem, bouncing between multiple heavy desktop applications just to format an essay or extract a ZIP file is a massive productivity killer. We engineered this platform to eliminate friction completely.'
                        ),
                        e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, marginBottom: '25px' } }, 
                            'Whether you are refining AI-generated content, prepping high-quality assets for monetization networks, or simply organizing your project deployment files, our AI-ready interface ensures your workflow remains uninterrupted, secure, and lightning-fast.'
                        ),
                        e('ul', { style: { listStyleType: 'none', padding: 0, margin: 0 } },
                            [
                                { icon: '🔒', text: 'Zero server uploads. 100% client-side privacy.' },
                                { icon: '⚡', text: 'Instant rendering engine for 4K exports.' },
                                { icon: '🧠', text: 'Architecture optimized for modern web standards.' }
                            ].map((item, i) => 
                                e('li', { key: i, style: { fontSize: '16px', margin: '15px 0', display: 'flex', alignItems: 'center', opacity: 0.9, fontWeight: '500' } },
                                    e('span', { style: { marginRight: '15px', fontSize: '18px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' } }, item.icon),
                                    item.text
                                )
                            )
                        )
                    ),

                    // Right Side 3D Visual Box
                    e('div', { className: 'card-3d-wrap', style: { flex: 0.7, width: '100%', boxSizing: 'border-box' } },
                        e('div', { className: 'premium-feature-card', style: { display: 'flex', flexDirection: 'column', gap: '35px', textAlign: 'center', padding: '60px 40px', boxSizing: 'border-box' } },
                            e('div', null,
                                e('h3', { className: 'text-gradient', style: { fontSize: '52px', margin: '0 0 10px 0', fontWeight: '950' } }, '10x'),
                                e('p', { style: { margin: 0, opacity: 0.6, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' } }, 'Faster Performance')
                            ),
                            e('div', { style: { height: '1px', background: 'rgba(255,255,255,0.1)', width: '60%', margin: '0 auto' } }),
                            e('div', null,
                                e('h3', { className: 'text-gradient', style: { fontSize: '52px', margin: '0 0 10px 0', fontWeight: '950' } }, '0KB'),
                                e('p', { style: { margin: 0, opacity: 0.6, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' } }, 'Server Overload')
                            )
                        )
                    )
                ),

                // 3. FEATURES GRID SECTION (Wide Matrix)
                e('div', { style: { textAlign: 'center', marginBottom: '50px', marginTop: '60px', width: '100%', boxSizing: 'border-box' } },
                    e('h2', { style: { fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', marginBottom: '15px', letterSpacing: '-1px' } }, 'The Complete Arsenal'),
                    e('p', { style: { opacity: 0.6, fontSize: '19px', maxWidth: '600px', margin: '0 auto' } }, 'Click any module below to instantly launch the tool in your browser environment.')
                ),

                e('div', { className: 'card-3d-wrap', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', width: '100%', boxSizing: 'border-box', marginBottom: '80px' } },
                    
                    e('div', { className: 'premium-feature-card' },
                        e('div', { style: { background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), transparent)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '30px', border: '1px solid rgba(56, 189, 248, 0.3)' } }, '📄'),
                        e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Smart Resume Builder'),
                        e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7' } }, 'Dynamic ATS-friendly templates that capture attention. Export to high-quality PDF in seconds.')
                    ),
                    
                    e('div', { className: 'premium-feature-card' },
                        e('div', { style: { background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), transparent)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '30px', border: '1px solid rgba(168, 85, 247, 0.3)' } }, '🎨'),
                        e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Banner Studio Pro'),
                        e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7' } }, 'Design ultra-HD LinkedIn covers and website headers with custom typography and modern glassmorphism.')
                    ),

                    e('div', { className: 'premium-feature-card' },
                        e('div', { style: { background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), transparent)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '30px', border: '1px solid rgba(236, 72, 153, 0.3)' } }, '✨'),
                        e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Advanced Logo Maker'),
                        e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7' } }, 'Construct professional brand identities instantly with our vectorized 4K exporter tool.')
                    ),

                    e('div', { className: 'premium-feature-card' },
                        e('div', { style: { background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), transparent)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '30px', border: '1px solid rgba(16, 185, 129, 0.3)' } }, '✍️'),
                        e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Rich Word Editor'),
                        e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7' } }, 'Draft articles, format essays, and write code documentation in a distraction-free environment.')
                    ),

                    e('div', { className: 'premium-feature-card' },
                        e('div', { style: { background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), transparent)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '30px', border: '1px solid rgba(245, 158, 11, 0.3)' } }, '🗜️'),
                        e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Instant Archive Utility'),
                        e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7' } }, 'Unzip deployment folders or compress massive directories locally within your browser.')
                    ),

                    e('div', { className: 'premium-feature-card' },
                        e('div', { style: { background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), transparent)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '30px', border: '1px solid rgba(239, 68, 68, 0.3)' } }, '🔄'),
                        e('h3', { style: { fontSize: '24px', fontWeight: '800', marginBottom: '15px' } }, 'Word to PDF Engine'),
                        e('p', { style: { opacity: 0.6, fontSize: '15px', lineHeight: '1.7' } }, 'Seamlessly compile your formatted Word documents into crisp, print-ready PDFs securely.')
                    )
                ),
                // ========================================================
                // 🌟 ULTRA-PREMIUM MANIFESTO SECTION (ABOVE FOOTER CTA)
                // ========================================================
                currentPage === 'landing' && e('div', { 
                    className: 'animate-slide-up delay-2', 
                    style: { width: '100%', margin: '110px 0 70px 0', boxSizing: 'border-box', textAlign: 'left' } 
                }, [
                    // Top Micro Tag Accent
                    e('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' } }, [
                        e('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' } }),
                        e('span', { style: { fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent)' } }, 'Platform Manifesto')
                    ]),
                    
                    // Main Title with Gradient Setup
                    e('h2', { 
                        style: { 
                            fontSize: 'clamp(32px, 5vw, 48px)', 
                            fontWeight: '950', 
                            marginBottom: '55px', 
                            color: 'var(--text)', 
                            letterSpacing: '-1.5px',
                            lineHeight: '1.15'
                        } 
                    }, [
                        'Redefining the Modern ',
                        e('span', { className: 'text-gradient' }, 'Digital Workspace')
                    ]),
                    
                    // High-End Paragraph Cards Stack
                    e('div', { style: { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', width: '100%' } }, 
                        [
                            {
                                num: '01',
                                title: 'Unified Ecosystem Convergence',
                                text: 'The arbitrary boundaries between separate desktop utilities are rapidly dissolving in modern workflows. This ecosystem stands at the forefront of this convergence, unifying high-fidelity vectorized graphic design, robust text compilation, structured document layout engines, and native directory compression utilities into a singular, highly cohesive interface. By systematically removing the friction of switching environments, users can seamlessly transition from crafting elite professional profiles to deploying production-ready brand assets within a unified browser state.'
                            },
                            {
                                num: '02',
                                title: 'Absolute Sovereign Cryptography',
                                text: 'Data security should never be a premium add-on or an afterthought—it is treated here as an absolute prerequisite. Every execution matrix, image rendering pass, and sensitive text serialization occurs exclusively inside your hardware’s local runtime memory. By discarding server-side data pipelines entirely, the architecture guarantees that your intellectual property, financial layout structures, and personal identity data remain entirely within your sovereign custody, safe from external cloud data harvesting.'
                            },
                            {
                                num: '03',
                                title: 'Concurrent Low-Overhead Threading',
                                text: 'Engineered specifically to accommodate high-velocity digital operators, the performance core leverages advanced client-side threading models. Whether you are refining granular layouts for social networks, executing deep multi-tier academic history mappings, or packing local directories, the processing layers run concurrently. This optimization ensures instant execution cycles without compromising the physical system stability or causing heavy browser overhead.'
                            },
                            {
                                num: '04',
                                title: 'Micro-Rendering Geometric Engine',
                                text: 'The localized typographical engine translates complex abstract parameters into pristine visual assets with strict geometric precision. Every exported template, vector block, or rich text layout undergo micro-rendering optimization cycles automatically. This ensures that whatever you build remains fully compliant with automated corporate screening algorithms, global layout standards, and elite web application presentations out of the box.'
                            },
                            {
                                num: '05',
                                title: 'Subscription-Free Core Paradigm',
                                text: 'Ultimately, this platform represents a philosophical departure from bloated software subscriptions, intrusive account registrations, and predatory paywalls. It stands as a pure utility playground built explicitly to respect your time, secure your identity data, and empower your creative output—giving you professional-grade execution capacity entirely on your own terms.'
                            }
                        ].map((item, index) => (
                            e('div', { 
                                key: index,
                                style: { 
                                    display: 'flex', 
                                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                                    gap: '24px', 
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.003) 100%)', 
                                    padding: '32px', 
                                    borderRadius: '20px', 
                                    border: '1px solid rgba(255,255,255,0.03)',
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
                                    alignItems: 'flex-start'
                                } 
                            }, [
                                // Left Side: Number & Minimal Line Design
                                e('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px' } }, [
                                    e('span', { style: { fontSize: '14px', fontWeight: '900', color: 'var(--accent)', background: 'rgba(56, 189, 248, 0.08)', padding: '6px 10px', borderRadius: '8px', fontFamily: 'monospace', letterSpacing: '0.5px' } }, item.num)
                                ]),
                                // Right Side: Content Area
                                e('div', { style: { flex: 1 } }, [
                                    e('h4', { style: { margin: '0 0 10px 0', fontSize: '18px', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.3px' } }, item.title),
                                    e('p', { style: { fontSize: '15.5px', lineHeight: '1.8', opacity: 0.7, margin: 0, fontWeight: '400' } }, item.text)
                                ])
                            ])
                        ))
                    )
                ]),
                // ========================================================
                // 📸 VISUAL FEATURE SHOWCASE SECTION (5-ROW ELITE LAYOUT)
                // ========================================================
                currentPage === 'landing' && e('div', { 
                    className: 'animate-slide-up delay-3', 
                    style: { width: '100%', margin: '90px 0 70px 0', boxSizing: 'border-box' } 
                }, [
                    // Section Main Title
                    e('div', { style: { textAlign: 'center', marginBottom: '80px' } }, [
                        e('span', { style: { fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent)' } }, 'Interactive Preview'),
                        e('h2', { style: { fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: '950', marginTop: '10px', color: 'var(--text)', letterSpacing: '-1.5px' } }, 'Inside the Production Engine')
                    ]),

                    // Core Feature Grid Dataset Mapping
                    ...[
                        {
                            tag: 'Visual Builder Pipeline',
                            tagBg: 'rgba(56, 189, 248, 0.1)',
                            tagColor: 'var(--accent)',
                            glow: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
                            title: 'Real-Time Vector Layout Controls',
                            desc: 'Experience absolute fluidity with our sub-millisecond layout refresh system. Adjust typography metrics, swap border-radii properties, and configure structured content layers inside a highly adaptive visual grid built specifically for high-density document rendering.',
                            subtext: 'System auto-generates localized cache structures, ensuring you never lose active work matrices during deep multi-layer edits.',
                            imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
                        },
                        {
                            tag: 'Local Core Processing',
                            tagBg: 'rgba(168, 85, 247, 0.1)',
                            tagColor: '#a855f7',
                            glow: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
                            title: 'Zero-Latency File Serializer',
                            desc: 'Compressing system directories and packing complex data nodes happens natively without touching single remote APIs. Our fully sandboxed pipeline executes complex archival commands entirely within web-assembly wrappers, rendering heavy actions flawlessly while respecting full system privacy.',
                            subtext: 'Optimized execution layers yield a complete processing overhead reduction compared to old cloud-dependent solutions.',
                            imgUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80'
                        },
                        {
                            tag: 'Typographical Engine',
                            tagBg: 'rgba(236, 72, 153, 0.1)',
                            tagColor: '#ec4899',
                            glow: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
                            title: 'Advanced Micro-Rasterization Matrix',
                            desc: 'Manage intricate layout alignments with a localized rendering stack designed for absolute typographical alignment. From balancing tracking values to handling custom font glyph subsets, the engine passes vectors directly into the canvas context, yielding pixel-perfect readability at any viewport scale.',
                            subtext: 'Built-in anti-aliasing filters preserve structural rendering weights across modern high-DPI monitor displays.',
                            imgUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1000&q=80'
                        },
                        {
                            tag: 'Asset Compilers',
                            tagBg: 'rgba(16, 185, 129, 0.1)',
                            tagColor: '#10b981',
                            glow: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
                            title: 'Multi-Threaded Directory Packaging',
                            desc: 'Bundle production-ready elements into structured distributions instantly. By isolating compilation processes into specialized secondary worker threads, you can execute deep binary packaging and media exports without encountering single UI-thread blocks or frame degradation.',
                            subtext: 'Maintains lightning-fast application speeds even when processing heavily populated workspace assets.',
                            imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80'
                        },
                        {
                            tag: 'Sovereign Storage',
                            tagBg: 'rgba(245, 158, 11, 0.1)',
                            tagColor: '#f59e0b',
                            glow: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
                            title: 'Cryptographic State Persistence',
                            desc: 'Your application states are entirely your own. Workspace snapshots, history registers, and profile structural variables are committed directly to high-capacity local indexed collections. This architecture eliminates credential reliance, account mandates, and corporate tracking networks entirely.',
                            subtext: 'Guarantees indefinite application operational capacity and complete security offline or online.',
                            imgUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80'
                        }
                    ].map((feat, idx) => {
                        const isEven = idx % 2 === 0;
                        
                        // Core Row Layout Generator
                        return e('div', { 
                            key: idx,
                            style: { 
                                display: 'flex', 
                                flexDirection: window.innerWidth < 900 ? (isEven ? 'column' : 'column-reverse') : 'row', 
                                gap: '60px', 
                                alignItems: 'center', 
                                marginBottom: idx === 4 ? '20px' : '110px',
                                width: '100%',
                                boxSizing: 'border-box'
                            } 
                        }, [
                            // Left Render Block (Image on Even, Text on Odd)
                            isEven ? 
                            e('div', { style: { flex: 1, width: '100%', position: 'relative' } }, [
                                e('div', { style: { position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px', background: feat.glow, filter: 'blur(20px)', zIndex: -1 } }),
                                e('img', { 
                                    src: feat.imgUrl, 
                                    alt: feat.title,
                                    style: { width: '100%', height: 'auto', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', display: 'block' }
                                })
                            ]) : 
                            e('div', { style: { flex: 1, width: '100%', textAlign: 'left' } }, [
                                e('div', { style: { background: feat.tagBg, color: feat.tagColor, padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '800', display: 'inline-block', marginBottom: '20px' } }, feat.tag),
                                e('h3', { style: { fontSize: '28px', fontWeight: '900', margin: '0 0 15px 0', color: 'var(--text)', letterSpacing: '-0.5px' } }, feat.title),
                                e('p', { style: { fontSize: '16px', lineHeight: '1.8', opacity: 0.7, margin: '0 0 20px 0' } }, feat.desc),
                                e('p', { style: { fontSize: '15px', lineHeight: '1.7', opacity: 0.5, margin: 0, fontStyle: 'italic' } }, feat.subtext)
                            ]),

                            // Right Render Block (Text on Even, Image on Odd)
                            isEven ? 
                            e('div', { style: { flex: 1, width: '100%', textAlign: 'left' } }, [
                                e('div', { style: { background: feat.tagBg, color: feat.tagColor, padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '800', display: 'inline-block', marginBottom: '20px' } }, feat.tag),
                                e('h3', { style: { fontSize: '28px', fontWeight: '900', margin: '0 0 15px 0', color: 'var(--text)', letterSpacing: '-0.5px' } }, feat.title),
                                e('p', { style: { fontSize: '16px', lineHeight: '1.8', opacity: 0.7, margin: '0 0 20px 0' } }, feat.desc),
                                e('p', { style: { fontSize: '15px', lineHeight: '1.7', opacity: 0.5, margin: 0, fontStyle: 'italic' } }, feat.subtext)
                            ]) :
                            e('div', { style: { flex: 1, width: '100%', position: 'relative' } }, [
                                e('div', { style: { position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px', background: feat.glow, filter: 'blur(20px)', zIndex: -1 } }),
                                e('img', { 
                                    src: feat.imgUrl, 
                                    alt: feat.title,
                                    style: { width: '100%', height: 'auto', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', display: 'block' }
                                })
                            ])
                        ]);
                    })
                ]),

                // 4. MASSIVE FOOTER CTA
                e('div', { className: 'heavy-glow', style: { width: '100%', margin: '20px 0 60px 0', background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(168,85,247,0.1))', padding: '80px 20px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden', boxSizing: 'border-box', textAlign: 'center' } },
                    e('div', { style: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' } }),
                    e('h2', { style: { fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' } }, 'Ready to Elevate?'),
                    e('p', { style: { opacity: 0.7, marginBottom: '40px', fontSize: '20px' } }, 'No signups. No credit cards. Just powerful tools.'),
                    e('button', {
                        onClick: () => navigate('home'),
                        style: { background: '#fff', color: '#000', border: 'none', padding: '22px 60px', borderRadius: '100px', fontWeight: '900', cursor: 'pointer', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }
                    }, 'Start Building Now')
                )
            ),
            
            // =========================================
            // 🌟 ULTRA-WIDE FLUID PREMIUM LANDING PAGE END
            // =========================================

            currentPage === 'home' && e('div', { style: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
    
    // 1. HEADING AUR TEXT (Ab ye dono columns ke bilkul upar aur screen ke center mi aayega)
    e('div', { className: 'resume-intro', style: { textAlign: 'center', marginBottom: '40px', marginTop: '30px', padding: '0 15px', maxWidth: '800px' } },
        e('h2', { style: { color: 'var(--accent)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900', marginBottom: '12px' } }, 'Resume Maker'),
        e('p', { style: { fontSize: '16px', opacity: 0.75, lineHeight: '1.6', margin: '0' } }, 
            'Craft a professional, ATS-friendly resume in minutes. Simply fill out your academic history, skills, and experience below. Choose from our premium templates to instantly generate and download your high-quality PDF.'
        )
    ),
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
                                                         e('div', { className: 'section-title' }, 'References'),
e('textarea', { 
    rows: 3, 
    placeholder: 'References (e.g. Name - Company - Contact)', 
    onChange: (e) => setReferences(e.target.value),
    style: { marginBottom: '10px' }
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
                        references && e('div', null,
    e('h4', { style: { borderBottom: '1px solid #eee', fontSize: '12px', paddingBottom: '3px' } }, 'REFERENCES'),
    e('p', { style: { fontSize: '12px', whiteSpace: 'pre-line' } }, references)
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
                alignItems: 'center', // Is se text block screen ke bilkul beech mein rahega
                gap: '20px' // Sab items ke darmiyan barabar gap rakhega
            }
        },
            // --- NAYI HEADING AUR DESCRIPTION ---
            e('div', { style: { maxWidth: '800px', marginBottom: '10px' } },
                e('h2', {
                    style: {
                        color: 'var(--accent)', // Resume maker jaisa color
                        fontSize: 'clamp(28px, 5vw, 42px)', // Responsive size
                        fontWeight: '900',
                        marginTop: '20px', // Header se thora neechay kiya
                        marginBottom: '12px'
                    }
                }, 'Convert Word to PDF'),
                e('p', {
                    style: {
                        fontSize: '16px',
                        opacity: 0.75,
                        lineHeight: '1.6',
                        margin: '0'
                    }
                }, 'Convert your Microsoft Word documents (.docx) to high-quality PDF files instantly. Our secure tool ensures that your fonts, margins, and original formatting remain perfectly intact.')
            ),
            // ------------------------------------

            // Iske neechay aapka baqi ka converter code (file uploader button wagaira) chalega, 
            // usme koi tabdeeli nahi karni.

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
            currentPage === 'wordEditor' && e('div', { style: { maxWidth: '800px', margin: '0 auto', padding: '20px 15px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' } },

            // --- Consistent Modern Header ---
            e('div', { style: { marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                e('h2', {
                    style: {
                        color: 'var(--accent)',
                        fontSize: 'clamp(28px, 5vw, 42px)', // Baki pages jaisa responsive size
                        fontWeight: '900',
                        marginBottom: '12px',
                        letterSpacing: '-0.5px'
                    }
                }, 'Word Article Editor'),
                e('p', {
                    style: {
                        fontSize: '16px',
                        opacity: 0.75, // Standard professional opacity
                        lineHeight: '1.6',
                        margin: '0',
                        maxWidth: '650px'
                    }
                }, 'Create, edit, and format your essays, blogs, or professional articles effortlessly. Write your content in our rich editor and download it instantly as a fully compatible Microsoft Word (.docx) document.')
            ),
            // ---------------------------------

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
currentPage === 'about' && e('div', { 
    style: { 
        maxWidth: '850px', 
        margin: '0 auto', 
        padding: '30px 16px 80px', // Mobile optimized padding
        minHeight: '70vh', 
        lineHeight: '1.7', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',             // Mobile responsive layout guard
        boxSizing: 'border-box'
    } 
},

    // --- Fully Mobile-Responsive About Header ---
    e('div', { 
        style: { 
            marginBottom: '35px', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
        } 
    },
        e('h1', {
            style: {
                color: 'var(--accent)',
                fontSize: 'clamp(24px, 5.5vw, 40px)', // Mobile par perfectly scale hoga
                fontWeight: '900',                  // Solid look ke liye font weight 900
                marginBottom: '12px',
                letterSpacing: '-0.5px',
                lineHeight: '1.2',
                overflowWrap: 'break-word',   // Text ko screen se bahar bhagne nahi dega
                width: '100%'
            }
        }, 'About RESUME.PRO'),
        
        e('p', {
            style: {
                fontSize: 'clamp(14px, 4vw, 16px)', // Fluid body copy
                opacity: 0.75,
                lineHeight: '1.6',
                margin: '0',
                maxWidth: '720px'
            }
        }, 'Empowering your professional journey through high-performance, serverless utilities. RESUME.PRO is engineered to provide premium tools for resume architecture, document conversion, and brand design—running entirely inside your browser for maximum execution speed and absolute data privacy.')
    ),
    // ---------------------------------------------

    e('div', { style: { background: 'var(--card-bg)', padding: '35px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } },

        e('p', { style: { marginBottom: '20px' } }, 'Welcome to ', e('strong', { style: { color: 'var(--accent)' } }, 'RESUME.PRO'), '. We are dedicated to providing an all-in-one, highly optimized browser-based workspace designed to elevate your professional digital footprint. Built on the same advanced, radical privacy-first principles as our legal framework, RESUME.PRO guarantees that your corporate and creative data stays completely in your hands.'),

        // Section 1
        e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '1. Our Operational Philosophy'),
        e('p', { style: { marginBottom: '15px' } }, 'We believe that creating modern, high-impact career branding shouldn\'t require dealing with heavy desktop software, tracking pixels, or mandatory subscription portals. RESUME.PRO delivers lightning-fast, production-ready document configuration tools instantly to anyone navigating today\'s competitive digital ecosystem.'),

        // Section 2
        e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '2. Core Technology Stack & Performance'),
        e('p', { style: { marginBottom: '10px' } }, 'By eliminating backend data server architectures, our architecture relies entirely on native browser runtime environments:'),
        e('ul', { style: { paddingLeft: '20px', marginBottom: '15px' } },
            e('li', { style: { marginBottom: '5px' } }, e('strong', null, '100% Secure Processing: '), 'Your text files, uploaded images, and design configurations live strictly inside your local device memory sandbox.'),
            e('li', null, e('strong', null, 'Zero Data Friction: '), 'Because no data packets are transmitted to a database network, rendering and file compiling happen at exceptional speeds without server load.')
        ),

        // Section 3
        e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '3. A Complete Professional Suite'),
        e('p', { style: { marginBottom: '10px' } }, 'Our platform provides a comprehensive suite of unified tools tailored for developers, creators, and professionals:'),
        e('ul', { style: { paddingLeft: '20px', marginBottom: '15px' } },
            e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'Smart Resume Builder: '), 'Instantly generate clean, ATS-friendly resumes across comprehensive academic tracking stages including Matric, Intermediate, Graduation, Masters, and PhD tiers.'),
            e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'Word to PDF Converter: '), 'Transform standard .docx formats into crisp, print-ready PDF assets locally without third-party server uploads.'),
            e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'Banner Studio Pro: '), 'Design custom, ultra-high-definition LinkedIn covers and website headers with modern geometric layers and glassmorphism.'),
            e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'Advanced Logo Maker: '), 'Construct minimalist personal branding, corporate layouts, and vectorized 4K icons within seconds.'),
            e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'Professional Word Editor: '), 'Draft long-form documentation or articles via an embedded rich-text editor and download your assets directly as clean Word files.'),
            e('li', null, e('strong', null, 'Local Archive Utilities: '), 'Pack multi-file projects into compressed ZIP folders or unpack directories directly inside your active browser tab.')
        ),

        // Section 4
        e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '4. Continuous Innovation'),
        e('p', { style: { marginBottom: '15px' } }, 'At RESUME.PRO, we are continuously refining our open-source script configurations and canvas tools. While our immediate priority is delivering zero-friction file transformation and automated CV layouts, we are fully committed to expanding our browser architecture with even more advanced productivity modules.'),

        e('p', { style: { textAlign: 'center', marginTop: '30px', fontWeight: '700', fontSize: '15px', borderTop: '1px solid var(--border)', paddingTop: '20px' } }, 
            'Have feedback or technical inquiries? Connect with us: ', 
            e('a', { href: 'mailto:resumeprohub1@gmail.com', style: { color: 'var(--accent)', textDecoration: 'none' } }, 'resumeprohub1@gmail.com')
        )
    )
)
     ),
        // --- UPDATED PRIVACY POLICY SECTION (Manually Replace This Block) ---
        currentPage === 'privacy' && e('div', { 
    style: { 
        maxWidth: '850px', 
        margin: '0 auto', 
        padding: '30px 16px 80px', // Mobile ke liye balanced padding
        minHeight: '70vh', 
        lineHeight: '1.7', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',             // Mobile par width bound rakhne ke liye
        boxSizing: 'border-box'
    } 
},

    // --- Fully Mobile-Responsive Header ---
    e('div', { 
        style: { 
            marginBottom: '35px', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
        } 
    },
        e('h1', {
            style: {
                color: 'var(--accent)',
                fontSize: 'clamp(24px, 5.5vw, 40px)', // Mobile par 24px se shuru hoga aur desktop par 40px tak jayega
                fontWeight: '900',
                marginBottom: '12px',
                letterSpacing: '-0.5px',
                lineHeight: '1.2',            // Mobile par jab text break ho toh lines juri hui na laghein
                overflowWrap: 'break-word',   // Kisi bhi choti screen par text boundary se baahar nahi niklega
                width: '100%'
            }
        }, 'Privacy Policy for RESUME.PRO'),
        
        e('p', {
            style: {
                fontSize: 'clamp(14px, 4vw, 16px)', // Text size mobile ke mutabiq khud adjust hoga
                opacity: 0.75,
                lineHeight: '1.6',
                margin: '0',
                maxWidth: '700px'
            }
        }, 'Your privacy is paramount to us. At RESUME.PRO, we are committed to absolute transparency and data sovereignty, ensuring your personal information and uploaded files never leave your local device.'),
        
        e('p', {
            style: {
                fontSize: '13px',
                opacity: 0.5,
                marginTop: '14px',
                fontWeight: '500'
            }
        }, 'Effective Date: July 6, 2026')
    ),
    // ---------------------------------

            e('div', { style: { background: 'var(--card-bg)', padding: '35px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } },

                e('p', { style: { marginBottom: '20px' } }, 'Welcome to ', e('strong', { style: { color: 'var(--accent)' } }, 'RESUME.PRO'), '. We are deeply committed to protecting your personal privacy. Unlike traditional web applications that capture, harvest, and monetize user inputs, RESUME.PRO is engineered on a radical privacy-first principle: ', e('strong', null, 'What is yours stays completely yours.'), ' This policy details how data is handled across our multi-module web utility.'),

                // Section 1
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '1. Core Architecture & The "Zero-Storage" Principle'),
                e('p', { style: { marginBottom: '10px' } }, 'Unlike traditional platforms that rely on backend servers and cloud-hosted databases to process your information, RESUME.PRO does not feature a backend database, user account portal, or login system.'),
                e('ul', { style: { paddingLeft: '20px', marginBottom: '15px' } },
                    e('li', { style: { marginBottom: '5px' } }, e('strong', null, '100% Client-Side Processing: '), 'All text generation, document rendering, file compression, and visual exports are computed locally inside your device\'s web browser engine using React and HTML5.'),
                    e('li', null, e('strong', null, 'Zero Server Retention: '), 'Your data is never transmitted to, processed by, or stored on an external platform server. Data breaches and server-side tracking are fundamentally impossible.')
                ),

                // Section 2
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '2. Granular Data Processing Breakdown'),
                e('p', { style: { marginBottom: '10px' } }, 'Specific categories of data are processed temporarily within your browser\'s runtime memory state depending on the tool utilized:'),
                e('ul', { style: { paddingLeft: '20px', marginBottom: '15px' } },
                    e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'Profile & Resume Builder: '), 'Processes identity details, contact info, and comprehensive academic matrices across all tiers (Matriculation, Intermediate, Graduation, Masters, PhD) along with references. All metrics remain purely in local state.'),
                    e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'Word Article Editor: '), 'Drafts, rich text attributes, and layout configurations are strictly constrained to local React state variables and built directly into local document assets.'),
                    e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'File Conversion Engines (Word to PDF): '), 'Uploaded files are broken down using modular client-side layout parsers and transformed into PDF assets using local graphic containers (html2canvas, jsPDF). Your files are never uploaded to our servers.'),
                    e('li', { style: { marginBottom: '8px' } }, e('strong', null, 'Banner Studio & Logo Designer: '), 'Brand texts, typography alignments, and geometry variables are layered directly into an HTML5 canvas and rendered locally into high-definition downloads.'),
                    e('li', null, e('strong', null, 'Archive Utilities (Zip/Unzip): '), 'The compression tools unpack and package archives asynchronously using javascript file systems entirely within your browser sandbox.')
                ),

                // Section 3
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '3. Local Browser Storage Mechanics'),
                e('p', { style: { marginBottom: '10px' } }, 'To improve your interface navigation and user experience, our platform utilizes your browser\'s persistent configurations:'),
                e('ul', { style: { paddingLeft: '20px', marginBottom: '15px' } },
                    e('li', { style: { marginBottom: '5px' } }, e('strong', null, 'Theme Preferences: '), 'We utilize your browser\'s native "Local Storage" container to track and remember your interface configuration (Dark Mode or Light Mode). No tracking identifiers are integrated with this token.'),
                    e('li', null, e('strong', null, 'Session Lifecycle Management: '), 'All input text values, document drafts, and canvas configurations exist strictly in volatile session memory. Refreshing or closing the tab permanently erases all data.')
                ),

                // Section 4
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '4. Third-Party Libraries & Communication'),
                e('p', { style: { marginBottom: '10px' } }, 'To deliver advanced client-side features, RESUME.PRO relies on highly specific web configurations:'),
                e('ul', { style: { paddingLeft: '20px', marginBottom: '15px' } },
                    e('li', { style: { marginBottom: '5px' } }, e('strong', null, 'Open-Source Sandbox Libraries: '), 'We utilize trusted libraries like Quill, JSZip, mammoth.js, and html2canvas operating entirely within your browser.'),
                    e('li', null, e('strong', null, 'Contact Form Protocols: '), 'If you explicitly choose to interact with our "Get In Touch" feature, your message data is securely transmitted via Formspree solely to route your inquiry straight to our support team.')
                ),

                // Section 5
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '5. Hosting & Infrastructure Log Monitoring'),
                e('p', { style: { marginBottom: '15px' } }, 'Our front-end client is hosted on Vercel. To maintain web security standards and mitigate server attacks, Vercel infrastructure may automatically record default technical network metadata (like IP addresses, user-agent details, and timestamps). This log tracking is separated from your personal platform usage data.'),

                // Section 6
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '6. Absolute Data Sovereignty (GDPR & CCPA Compliant)'),
                e('p', { style: { marginBottom: '15px' } }, 'Because RESUME.PRO chooses not to capture, store, or index any of your documents or metrics on any server network, global privacy protection requirements are naturally fulfilled. You retain absolute control over your records. Clearing your device\'s browser cache instantly removes all footprints.'),

                // Section 7
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '7. Children\'s Information Protection'),
                e('p', { style: { marginBottom: '15px' } }, 'RESUME.PRO is completely safe for all age demographics. We do not knowingly solicit, harvest, or monitor any information from minors. Since zero data packets reach external servers, our software represents an entirely secure sandbox free from online surveillance risks.'),

                // Section 8
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '10px' } }, '8. Operational Amendments & Contact'),
                e('p', { style: { marginBottom: '15px' } }, 'If a future upgrade requires a cloud database setup, this Privacy Policy will be revised transparently. If you have questions regarding our localized architecture, do not hesitate to reach us through our official email address:'),
                e('p', { style: { textAlign: 'center', marginTop: '20px', fontWeight: '700', fontSize: '16px' } }, 
                    'Support Email: ', 
                    e('a', { href: 'mailto:resumeprohub1@gmail.com', style: { color: 'var(--accent)', textDecoration: 'none' } }, 'resumeprohub1@gmail.com')
                )
            )
        ),
currentPage === 'terms' && e('div', { 
    style: { 
        maxWidth: '850px', 
        margin: '0 auto', 
        padding: '30px 16px 80px', // Mobile responsive padding
        minHeight: '80vh',
        color: 'var(--text)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',             // Horizontal scroll se bachane ke liye
        boxSizing: 'border-box'
    } 
},

    // --- Fully Mobile-Responsive Terms Header ---
    e('div', { 
        style: { 
            marginBottom: '35px', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
        } 
    },
        e('h1', {
            style: {
                color: 'var(--accent)',
                fontSize: 'clamp(24px, 5.5vw, 40px)', // Mobile par adjust hone wala typography size
                fontWeight: '900',                  // Solid aur bold premium look
                marginBottom: '12px',
                letterSpacing: '-0.5px',
                lineHeight: '1.2',
                overflowWrap: 'break-word',
                width: '100%'
            }
        }, 'Terms and Conditions'),
        
        e('p', {
            style: {
                fontSize: 'clamp(14px, 4vw, 16px)', // Fluid description size
                opacity: 0.75,
                lineHeight: '1.6',
                margin: '0',
                maxWidth: '720px'
            }
        }, 'Welcome to RESUME.PRO. By accessing or using our serverless architecture, document utilities, and design services, you agree to comply with and be bound by the following legal terms. Please read these guidelines carefully before using our platform.'),
        
        e('p', {
            style: {
                fontSize: '13px',
                opacity: 0.5,
                marginTop: '14px',
                fontWeight: '500'
            }
        }, 'Last Updated: July 6, 2026')
    ),
    // ---------------------------------------------

            e('div', {
                style: {
                    background: 'var(--card-bg)',
                    padding: '20px', // Card padding balanced for extra copy space
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    lineHeight: '1.6',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    fontSize: '14px' // Highly readable baseline layout
                }
            },
                e('p', { style: { marginBottom: '15px' } }, 'Welcome to RESUME.PRO (https://resumepro.it.com/). Please read these Terms and Conditions carefully before using our website and application modules. By accessing or using any part of the Platform, you agree to be bound by these Terms.'),

                // Section 1
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '1. Acceptance of Terms & Nature of Service'),
                e('p', { style: { marginBottom: '12px' } }, 'RESUME.PRO operates as a 100% client-side, browser-based multi-utility workspace designed for professional content creation, document processing, and branding design. The Platform is engineered as an account-free software environment with no registration portals, subscription parameters, or server-side databases. All visual rendering and archive packaging are completed locally on your individual device runtime environment.'),

                // Section 2
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '2. Granular Scope of Platform Modules'),
                e('p', { style: { marginBottom: '12px' } }, 'By utilizing the Platform, you are granted access to a specific suite of local client-side software applications. Your use must align with their designated operational boundaries:'),
                e('p', { style: { marginBottom: '8px', paddingLeft: '5px' } }, [e('strong', null, '• Smart Resume Builder: '), 'Generates personal resume layouts across multiple academic progress states (Matriculation, Intermediate, Graduation, Masters, PhD) along with reference metrics.']),
                e('p', { style: { marginBottom: '8px', paddingLeft: '5px' } }, [e('strong', null, '• Word to PDF Conversion Engine: '), 'Processes .docx document formats locally into portable graphic containers using open-source web standard parsers.']),
                e('p', { style: { marginBottom: '8px', paddingLeft: '5px' } }, [e('strong', null, '• Word Article Editor: '), 'Provides a text compilation window configured via rich text engines to draft work directly into a downloadable localized .docx asset.']),
                e('p', { style: { marginBottom: '8px', paddingLeft: '5px' } }, [e('strong', null, '• Banner Studio Pro: '), 'Uses HTML5 canvas environments to arrange fonts, patterns, and custom alignment models to render custom Ultra-HD LinkedIn headers.']),
                e('p', { style: { marginBottom: '8px', paddingLeft: '5px' } }, [e('strong', null, '• Advanced Logo Designer: '), 'Offers a standalone graphic composition box to build individual brand marks and download high-resolution 4K text-and-icon assets.']),
                e('p', { style: { marginBottom: '12px', paddingLeft: '5px' } }, [e('strong', null, '• Archive Utility (Zip & Unzip): '), 'Uses asynchronous client-side file-system scripts to pack or extract .zip archival structures without asset transfers to an external environment.']),

                // Section 3
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '3. Client-Side Processing & Data Volatility'),
                e('p', { style: { marginBottom: '10px' } }, [e('strong', null, 'Zero-Storage Principle: '), 'The Platform features no cloud network or data center persistence layer. All metrics, image buffers, configuration state arrays, text objects, and document parameters exist strictly within your browser’s volatile runtime state memory.']),
                e('p', { style: { marginBottom: '10px' } }, [e('strong', null, 'Volatile Session States: '), 'Closing, refreshing, crashing, or navigating away from your active browser window tab will result in the immediate and irreversible erasure of all unsaved drafts, data inputs, and design canvases. You are solely responsible for executing downloads before ending your operational browsing session.']),
                e('p', { style: { marginBottom: '12px' } }, [e('strong', null, 'Local Browser Preferences: '), 'The application records a single persistent token inside your web browser’s localStorage to remember your personal interface configuration choice (Dark Mode vs Light Mode). This tracking element contains zero personal identification records.']),

                // Section 4
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '4. Open-Source Infrastructure Dependencies'),
                e('p', { style: { marginBottom: '12px' } }, 'The Platform operates by coordinating multiple client-side script structures, open-source assets, and infrastructure environments. By using this software, you acknowledge the functional integration of these modular building blocks, including React, HTML5 Core, Quill Text Engine (Word Article Editor), JSZip Compression Framework, Mammoth.js Component (DOCX Parser), Html2canvas, JsPDF, Vercel Web Hosting, and Formspree API (Contact Form).'),

                // Section 5
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '5. Intellectual Property & Permitted Usage'),
                e('p', { style: { marginBottom: '10px' } }, 'The system layout architecture, custom styling properties, interface designs, unique design templates, and logic routines provided within RESUME.PRO remain the exclusive intellectual property of the Platform developers.'),
                e('p', { style: { marginBottom: '12px' } }, [e('strong', null, 'Usage License & Constraints: '), 'You are granted a limited license to build your personal portfolios, professional resumes, career documentation, corporate banners, and brand logos for commercial employment matching or personal marketing. However, you are strictly prohibited from reverse-engineering the codebase core, harvesting system logic scripts, or redistributing our templates for commercial sale or white-labeling.']),

                // Section 6
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '6. Limitation of Liability & Absolute Disclaimers'),
                e('p', { style: { marginBottom: '10px' } }, [e('strong', null, '"As-Is" Service Standard: '), 'RESUME.PRO is deployed strictly on an "As-Is" and "As-Available" technical baseline without structural warranties, compliance assurances, or explicit error-free processing guarantees.']),
                e('p', { style: { marginBottom: '10px' } }, [e('strong', null, 'No Responsibility for Data Loss: '), 'The Platform owners, web maintainers, and infrastructure hosts shall not be held liable for any data losses, browser memory crashes, canvas rendering glitches, or unexpected session resets.']),
                e('p', { style: { marginBottom: '12px' } }, [e('strong', null, 'No Employment Endorsement: '), 'We do not guarantee that your resume compilation, ATS compatibility scoring, logo style alignment, or document transformation layout will yield specific professional outcomes, financial contracts, or corporate interviews.']),

                // Section 7
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '7. Links to Third-Party Web Portals'),
                e('p', { style: { marginBottom: '12px' } }, 'Our layout may feature hyperlinked destinations guiding users to external internet nodes or partner websites. We assert zero regulatory authority over the privacy strategies, content accuracy, cookie architectures, or structural terms deployed across third-party networks. Following an outbound redirect is completed entirely at your own discretion.'),

                // Section 8
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '8. Amendments & Operational Variations'),
                e('p', { style: { marginBottom: '12px' } }, 'We reserve the absolute right to modify, patch, adjust, or completely replace these Terms and Conditions at any moment to reflect module features or operational ecosystem upgrades. Continued interaction with our interface parameters constitutes your explicit acceptance of those changes.'),

                // Section 9
                e('h3', { style: { color: 'var(--accent)', marginTop: '25px', marginBottom: '8px' } }, '9. Direct Inquiries & Contact Details'),
                e('p', { style: { marginBottom: '10px' } }, 'If you require technical clarification regarding the client-side processing architecture, local script libraries, data handling boundaries, or these operational rules, you can reach out to us at:'),
                e('p', { style: { marginTop: '10px', fontWeight: '600' } }, 'Website: https://resumepro.it.com/'),
                e('p', { style: { marginTop: '4px', fontWeight: '600' } }, 'Email: resumeprohub1@gmail.com')
            )
        ),

        currentPage === 'contact' && e('div', { style: { textAlign: 'center', maxWidth: '1000px', margin: '0 auto', padding: '20px 15px 100px' } },

    // 1. Premium Hub Header
    e('div', { style: { marginBottom: '40px' } },
        e('h2', {
            style: {
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px', fontSize: window.innerWidth < 768 ? '32px' : '40px', fontWeight: '900', letterSpacing: '-1px'
            }
        }, 'Communications Hub Pro'),
        e('p', { style: { fontSize: '16px', color: '#64748b', letterSpacing: '0.5px' } }, 'Connect with our specialized engineering and growth branches instantly.')
    ),

    // 2. Main Studio Container
    e('div', {
        style: {
            display: 'flex', flexDirection: 'column', gap: '35px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            padding: window.innerWidth < 768 ? '20px' : '40px',
            borderRadius: '24px',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'
        }
    },

        // 3. Live Support Presentation Stage (Mirrors the Canvas Stage Architecture)
        e('div', { style: { position: 'relative', padding: '20px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border)' } },
            e('div', { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%', height: '70%', background: 'var(--accent)', filter: 'blur(80px)', opacity: '0.1', zIndex: 0 } }),
            
            e('div', { style: { position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '15px' } },
                e('div', null,
                    e('div', { style: { fontSize: '20px', fontWeight: '900', color: 'var(--accent)' } }, '⏱️ < 48 Hours'),
                    e('p', { style: { margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginTop: '4px' } }, 'Avg Response Time')
                ),
                e('div', { style: { width: '1px', background: 'var(--border)', height: '30px', display: window.innerWidth < 768 ? 'none' : 'block' } }),
                e('div', null,
                    e('div', { style: { fontSize: '20px', fontWeight: '900', color: '#22c55e' } }, '🟢 Systems Online'),
                    e('p', { style: { margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginTop: '4px' } }, 'Desk Availability')
                )
            )
        ),

        // Form element wrapper to handle submission across the structured layout
        e('form', { action: "https://formspree.io/f/myknvklo", method: "POST", style: { display: 'flex', flexDirection: 'column', gap: '35px', margin: 0 } },
            
            // 4. Advanced Communications Grid (2-Column Setup)
            e('div', { style: { display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1.3fr 1fr', gap: '30px', textAlign: 'left' } },

                // --- LEFT COLUMN: DIRECT SECURE DISPATCH (Form Fields) ---
                e('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
                    e('div', null,
                        e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', display: 'block' } }, 'Identity / Name'),
                        e('input', {
                            type: 'text', name: 'name', placeholder: 'Your Name', required: true,
                            style: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }
                        })
                    ),
                    e('div', null,
                        e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', display: 'block' } }, 'Secure Alias / Email Address'),
                        e('input', {
                            type: 'email', name: 'email', placeholder: 'your@email.com', required: true,
                            style: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }
                        })
                    ),
                    e('div', null,
                        e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', display: 'block' } }, 'Project Context / Message'),
                        e('textarea', {
                            name: 'message', rows: 5, placeholder: 'How can we optimize your ecosystem?', required: true,
                            style: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }
                        })
                    )
                ),

                // --- RIGHT COLUMN: ROUTING MATRIX (Core Departments Stack) ---
                e('div', { style: { display: 'flex', flexDirection: 'column', gap: '15px', background: 'var(--card-bg)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)' } },
                    e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '5px', display: 'block' } }, 'Operational Routing Sectors'),

                    // Item 1: General Support
                    e('div', { style: { display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' } },
                        e('img', { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&q=80', style: { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' } }),
                        e('div', null,
                            e('h4', { style: { margin: '0 0 2px 0', color: 'var(--accent)', fontSize: '14px', fontWeight: '600' } }, 'General Inquiries'),
                            e('p', { style: { margin: 0, fontSize: '12px', opacity: 0.6 } }, 'Collaborations & business sorting.')
                        )
                    ),

                    // Item 2: Web Development
                    e('div', { style: { display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' } },
                        e('img', { src: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=150&q=80', style: { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' } }),
                        e('div', null,
                            e('h4', { style: { margin: '0 0 2px 0', color: 'var(--accent)', fontSize: '14px', fontWeight: '600' } }, 'Technical Support'),
                            e('p', { style: { margin: 0, fontSize: '12px', opacity: 0.6 } }, 'Web architecture & custom scripts.')
                        )
                    ),

                    // Item 3: Content & SEO
                    e('div', { style: { display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' } },
                        e('img', { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&q=80', style: { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' } }),
                        e('div', null,
                            e('h4', { style: { margin: '0 0 2px 0', color: 'var(--accent)', fontSize: '14px', fontWeight: '600' } }, 'SEO Hub'),
                            e('p', { style: { margin: 0, fontSize: '12px', opacity: 0.6 } }, 'Performance metrics & keywords.')
                        )
                    ),

                    // Item 4: Marketing
                    e('div', { style: { display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' } },
                        e('img', { src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&q=80', style: { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' } }),
                        e('div', null,
                            e('h4', { style: { margin: '0 0 2px 0', color: 'var(--accent)', fontSize: '14px', fontWeight: '600' } }, 'Social Media & Growth'),
                            e('p', { style: { margin: 0, fontSize: '12px', opacity: 0.6 } }, 'Profile design & marketing funnels.')
                        )
                    ),

                    // Item 5: Urgent Care
                    e('div', { style: { display: 'flex', alignItems: 'center', gap: '15px' } },
                        e('img', { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&q=80', style: { width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' } }),
                        e('div', null,
                            e('h4', { style: { margin: '0 0 2px 0', color: 'var(--accent)', fontSize: '14px', fontWeight: '600' } }, 'Urgent Client Desk'),
                            e('p', { style: { margin: 0, fontSize: '12px', opacity: 0.6 } }, 'Active deployments & rapid fixes.')
                        )
                    )
                )
            ),

            // 5. Ultimate Dispatch Button (Matches Export Ultra-HD Theme)
            e('button', {
                type: 'submit',
                style: {
                    marginTop: '15px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff',
                    padding: '20px', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '16px',
                    letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)'
                }
            }, '⚡ Dispatch Premium Message')
        ),

        // 🌟 SECTION: Beautiful English Paragraph at the bottom
        e('p', { 
            style: { 
                marginTop: '10px', 
                textAlign: 'center', 
                fontSize: '14px', 
                lineHeight: '1.7', 
                opacity: 0.75,
                fontStyle: 'italic',
                borderTop: '1px solid var(--border)',
                paddingTop: '25px',
                color: 'var(--text)'
            } 
        },
            'At our core, we believe that great communication breeds exceptional digital innovation. Whether you are aiming to build a scalable web ecosystem, polish your search presence, or completely optimize your digital workflow, our dedicated experts span across distinct operational sectors to bring you premium support. Reach out through any of our channels, and let us shape your digital horizon together.'
        )
    )
),
        currentPage === 'banner' && e('div', { style: { textAlign: 'center', maxWidth: '1000px', margin: '0 auto', padding: '20px 15px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' } },

            // 1. Premium Studio Header (Ab Resume Maker jaisa professional look)
            e('div', { style: { marginBottom: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                e('h2', {
                    style: {
                        color: 'var(--accent)', // Gradient hata kar consistent theme color lagaya
                        fontSize: 'clamp(28px, 5vw, 42px)', // Responsive dynamic sizing
                        fontWeight: '900',
                        marginBottom: '12px',
                        letterSpacing: '-0.5px'
                    }
                }, 'Banner Studio Pro'),
                e('p', { 
                    style: { 
                        fontSize: '16px', 
                        opacity: 0.75, // Standard opacity for description text
                        lineHeight: '1.6',
                        maxWidth: '700px',
                        margin: '0 auto'
                    } 
                }, 'Design ultra-HD, high-impact LinkedIn banners instantly. Elevate your professional profile, capture recruiters attention, and stand out from the crowd with perfectly sized, premium header templates.')
            ),

            // 2. Main Studio Container
            e('div', {
                style: {
                    display: 'flex', flexDirection: 'column', gap: '35px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '1px solid rgba(100, 116, 139, 0.2)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'
                }
            },

                // 3. Canvas Presentation Stage
                e('div', { style: { position: 'relative', padding: '15px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border)' } },
                    e('div', { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%', height: '70%', background: bannerColor, filter: 'blur(80px)', opacity: '0.2', zIndex: 0 } }),

                    e('canvas', {
                        id: 'bannerCanvas',
                        width: 1584,
                        height: 396,
                        style: { width: '100%', borderRadius: '8px', position: 'relative', zIndex: 1, border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }
                    })
                ),

                // 4. Advanced Controls Grid (Ab 2 ki jagah 3 columns ka feel dega andar se)
                e('div', { className: 'banner-controls-grid', style: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', textAlign: 'left' } },

                    // --- LEFT COLUMN: TEXT & TYPOGRAPHY ---
                    e('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },

                        // Inputs
                        e('div', null,
                            e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', display: 'block' } }, 'Primary Headline'),
                            e('input', {
                                placeholder: 'e.g. Software Engineer', value: bannerText, onChange: (e) => setBannerText(e.target.value),
                                style: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '15px', outline: 'none' }
                            })
                        ),
                        e('div', null,
                            e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', display: 'block' } }, 'Professional Tagline'),
                            e('input', {
                                placeholder: 'e.g. Building Scalable Web Applications', value: bannerTagline, onChange: (e) => setBannerTagline(e.target.value),
                                style: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '15px', outline: 'none' }
                            })
                        ),

                        // NEW: Font Style & Alignment Grid
                        e('div', { className: 'banner-options-grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' } },
                            // Font Selection
                            e('div', null,
                                e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', display: 'block' } }, 'Typography Style'),
                                e('select', {
                                    value: bannerFontFamily, onChange: (e) => setBannerFontFamily(e.target.value),
                                    style: { width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }
                                },
                                    e('option', { value: 'Inter, sans-serif' }, 'Modern (Inter)'),
                                    e('option', { value: 'Georgia, serif' }, 'Elegant (Serif)'),
                                    e('option', { value: 'monospace' }, 'Tech (Monospace)')
                                )
                            ),
                            // Alignment Selection (Icon Pills)
                            e('div', null,
                                e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', display: 'block' } }, 'Alignment'),
                                e('div', { style: { display: 'flex', gap: '5px', background: 'var(--input-bg)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' } },
                                    ['left', 'center', 'right'].map(align => (
                                        e('button', {
                                            key: align,
                                            onClick: () => setBannerAlign(align),
                                            style: {
                                                flex: 1, padding: '8px', fontSize: '16px', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: '0.2s',
                                                background: bannerAlign === align ? '#3b82f6' : 'transparent',
                                                color: bannerAlign === align ? '#fff' : 'var(--text)'
                                            }
                                        }, align === 'left' ? '⬅️' : align === 'center' ? '⏺️' : '➡️') // Emojis as simple icons
                                    ))
                                )
                            )
                        )
                    ),

                    // --- RIGHT COLUMN: APPEARANCE & THEME ---
                    e('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--card-bg)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)' } },

                        // Color Picker
                        e('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
                            e('label', { style: { fontSize: '13px', fontWeight: '800', color: 'var(--text)' } }, 'Theme Color'),
                            e('div', { style: { width: '42px', height: '42px', borderRadius: '50%', padding: '2px', background: 'var(--input-bg)', border: '2px solid var(--border)', overflow: 'hidden', cursor: 'pointer' } },
                                e('input', {
                                    type: 'color', value: bannerColor, onChange: (e) => setBannerColor(e.target.value),
                                    style: { width: '200%', height: '200%', transform: 'translate(-25%, -25%)', border: 'none', cursor: 'pointer' }
                                })
                            )
                        ),

                        e('div', { style: { height: '1px', background: 'var(--border)', width: '100%' } }),

                        // NEW: Added 'Lines' to Patterns
                        e('div', null,
                            e('label', { style: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px', display: 'block' } }, 'Background Style'),
                            e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
                                ['none', 'dots', 'grid', 'lines'].map(pat => ( // 'lines' naya pattern hai
                                    e('button', {
                                        key: pat,
                                        onClick: () => setBannerPattern(pat),
                                        style: {
                                            padding: '12px 5px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize',
                                            borderRadius: '8px', cursor: 'pointer', transition: '0.3s all', border: 'none',
                                            background: bannerPattern === pat ? '#3b82f6' : 'var(--input-bg)',
                                            color: bannerPattern === pat ? '#fff' : 'var(--text)'
                                        }
                                    }, pat === 'none' ? 'Solid' : pat)
                                ))
                            )
                        )
                    )
                ),

                // 5. Ultimate Export Button
                e('button', {
                    className: 'btn btn-primary',
                    onClick: downloadBanner,
                    style: {
                        marginTop: '15px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff',
                        padding: '20px', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '16px',
                        letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)'
                    }
                }, '⚡ Export Ultra-HD Banner')
            )
        ), // <-- YAHAN BANNER WALA BLOCK CLOSE HO GAYA HAI (Jo pehle open reh gaya tha)

        currentPage === 'logo' && e('div', { style: { maxWidth: '800px', margin: '0 auto', padding: '20px 15px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' } },

            // --- Consistent Modern Header ---
            e('div', { style: { marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                e('h2', {
                    style: {
                        color: 'var(--accent)',
                        fontSize: 'clamp(28px, 5vw, 42px)', // Baki pages jaisa responsive size
                        fontWeight: '900',
                        marginBottom: '12px',
                        letterSpacing: '-0.5px'
                    }
                }, 'Advanced Logo Designer'),
                e('p', {
                    style: {
                        fontSize: '16px',
                        opacity: 0.75, // Standard professional opacity
                        lineHeight: '1.6',
                        margin: '0',
                        maxWidth: '650px'
                    }
                }, 'Design professional, high-impact brand icons and unique logos in seconds. Create a distinctive identity for your business, startup, or personal project with our intuitive customization tools and premium export options.')
            ),
            // ---------------------------------

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
                    e('div', { className: 'logo-layout-grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' } },
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
        // --- 5 IMAGES & DETAIL SECTION START ---
        currentPage === 'home' && e('div', { 
    className: 'mobile-container',
    style: { width: '100%', maxWidth: '1400px', margin: '60px auto', padding: '0 40px', paddingBottom: '60px', boxSizing: 'border-box' } 
},
    // 1. Responsive Styles Injection
    e('style', null, `
        @media (max-width: 768px) {
            .mobile-container { padding: 0 20px !important; margin: 40px auto !important; }
            .mobile-heading { font-size: 28px !important; margin-bottom: 40px !important; }
            .mobile-card { 
                flex-direction: column !important; 
                gap: 24px !important; 
                padding: 24px !important; 
                margin-bottom: 30px !important;
            }
            .mobile-col { flex: 1 1 100% !important; padding: 0 !important; }
            .mobile-img { height: 240px !important; }
            .mobile-paragraphs-section { padding: 30px 20px !important; margin-top: 50px !important; border-radius: 20px !important; }
            .mobile-paragraphs-heading { font-size: 26px !important; text-align: center; }
        }
    `),

    // 2. Main Heading
    e('h2', { 
        className: 'mobile-heading',
        style: { textAlign: 'center', fontSize: '38px', fontWeight: '900', marginBottom: '60px', color: 'var(--accent)', letterSpacing: '-0.5px' } 
    }, 'Elevate Your Professional Profile'),
    
    // 3. Feature Cards Loop
    [
        { 
            img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80', 
            title: 'Industry Standard Templates', 
            desc: 'Craft your resume with elite, recruiter-tested layouts engineered to highlight your core strengths and instantly command attention from top-tier enterprise hiring managers.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', 
            title: 'ATS-Friendly Formatting', 
            desc: 'Defeat automated screening gatekeepers effortlessly. Our highly optimized and structured document architecture ensures flawless parsing by modern Applicant Tracking Systems.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', 
            title: 'Real-Time Live Preview', 
            desc: 'Experience frictionless editing. Witness structural modifications, layout shifts, and textual updates instantly as you sculpt your professional story in real-time.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', 
            title: 'High-Resolution Export', 
            desc: 'Secure crystal-clear, pixel-perfect document downloads. Export production-ready files tailored to meet the exact printing and digital submission standards of modern employers.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', 
            title: '100% Secure & Private', 
            desc: 'Your personal data never leaves your sight. We prioritize your complete data sovereignty with advanced local, client-side cryptographic processing algorithms.' 
        }
    ].map((item, index) => 
        e('div', { 
            key: index, 
            className: 'mobile-card',
            style: { 
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
                alignItems: 'center', 
                gap: '50px', 
                marginBottom: '50px', 
                background: 'var(--card-bg)', 
                padding: '40px', 
                borderRadius: '24px', 
                border: '1px solid var(--border)', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)' 
            } 
        },
            e('div', { className: 'mobile-col', style: { flex: '1 1 500px' } }, 
                e('img', { 
                    src: item.img, 
                    className: 'mobile-img',
                    style: { 
                        width: '100%', 
                        height: '380px', 
                        objectFit: 'cover', 
                        borderRadius: '18px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    } 
                })
            ),
            e('div', { className: 'mobile-col', style: { flex: '1 1 500px', padding: '20px' } },
                e('h3', { style: { fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.3px' } }, item.title),
                e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, color: 'var(--text)' } }, item.desc)
            )
        )
    ),

    // 4. New Beautiful English Paragraphs Section (Below the loop)
    e('div', {
        className: 'mobile-paragraphs-section',
        style: { 
            marginTop: '80px', 
            padding: '60px', 
            background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(0,0,0,0.02) 100%)', 
            borderRadius: '32px', 
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }
    },
        e('h2', { 
            className: 'mobile-paragraphs-heading',
            style: { fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text)', letterSpacing: '-0.4px' } 
        }, 'Why Crafting a Standout Resume Matters'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85, marginBottom: '20px' } 
        }, 'In today’s highly competitive job market, your resume is no longer just a static summary of your work history—it is your personal marketing engine. Employers and recruiters spend an average of just six seconds skimming an application before deciding if a candidate moves forward. By combining precision typography, intuitive visual hierarchy, and strategic content placement, our platform ensures that your unique career narrative instantly captures attention and highlights your greatest milestones.'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85 } 
        }, 'Beyond structural elegance, navigating the modern hiring ecosystem requires technical optimization. Most enterprise organizations deploy advanced tracking systems to filter candidates before a human eyes the page. Our document architecture bridges the gap between human design expectations and system compliance, giving you a friction-free, elite presentation that maximizes response rates and accelerates your journey toward your dream career.')
    )
),
        // --- 5 IMAGES & DETAIL SECTION END ---
        // --- WORD TO PDF: 5 IMAGES & DETAIL SECTION START ---
        currentPage === 'wordToPdf' && e('div', { 
    className: 'w2p-container',
    style: { width: '100%', maxWidth: '1400px', margin: '60px auto', padding: '0 40px', paddingBottom: '60px', boxSizing: 'border-box' } 
},
    // 1. Dynamic Responsive Styles Injection
    e('style', null, `
        @media (max-width: 768px) {
            .w2p-container { padding: 0 20px !important; margin: 40px auto !important; }
            .w2p-heading { font-size: 28px !important; margin-bottom: 40px !important; }
            .w2p-card { 
                flex-direction: column !important; 
                gap: 24px !important; 
                padding: 24px !important; 
                margin-bottom: 30px !important;
            }
            .w2p-col { flex: 1 1 100% !important; padding: 0 !important; }
            .w2p-img { height: 240px !important; }
            .w2p-paragraphs-section { padding: 30px 20px !important; margin-top: 50px !important; border-radius: 20px !important; }
            .w2p-paragraphs-heading { font-size: 26px !important; text-align: center; }
        }
    `),

    // 2. Main Page Heading
    e('h2', { 
        className: 'w2p-heading',
        style: { textAlign: 'center', fontSize: '38px', fontWeight: '900', marginBottom: '60px', color: 'var(--accent)', letterSpacing: '-0.5px' } 
    }, 'Seamless Word to PDF Conversion'),
    
    // 3. Feature Cards Loop
    [
        { 
            img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', 
            title: '100% Accurate Layout Retention', 
            desc: 'Maintain absolute visual fidelity. Convert your documents without losing typography, margin structures, or intricate grid alignments. Your output PDF mirrors the source document down to the last pixel.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 
            title: 'Lightning Fast Processing', 
            desc: 'Eliminate operational delays. Our hyper-optimized server-side conversion architecture processes complex, media-heavy DOCX files into production-grade PDFs in mere fractions of a second.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80', 
            title: 'Batch Conversion Support', 
            desc: 'Scale your workflow effortlessly. Queue up, upload, and transform multiple Word files simultaneously without experiencing any system throttling or performance degradation.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', 
            title: 'Cross-Platform Compatibility', 
            desc: 'Deliver universally accessible assets. Every generated PDF complies with strict global standards, ensuring seamless, uncompromised readability across iOS, Android, macOS, and Windows ecosystems.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 
            title: 'Secure File Encryption', 
            desc: 'Absolute data sovereignty. Your intellectual property is protected via enterprise-grade encryption protocol. All source and converted assets are automatically and irreversibly purged post-session.' 
        }
    ].map((item, index) => 
                e('div', { 
                    key: index, 
                    className: 'w2p-card',
                    style: { 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
                        alignItems: 'center', 
                        gap: '50px', 
                        marginBottom: '50px', 
                        background: 'var(--card-bg)', 
                        padding: '40px', 
                        borderRadius: '24px', 
                        border: '1px solid var(--border)', 
                        boxShadow: '0 15px 40px rgba(0,0,0,0.06)' 
                    } 
                },
                    e('div', { className: 'w2p-col', style: { flex: '1 1 500px' } }, 
                        e('img', { 
                            src: item.img, 
                            className: 'w2p-img',
                            style: { 
                                width: '100%', 
                                height: '380px', 
                                objectFit: 'cover', 
                                borderRadius: '18px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                            } 
                        })
                    ),
                    e('div', { className: 'w2p-col', style: { flex: '1 1 500px', padding: '20px' } },
                        e('h3', { style: { fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.3px' } }, item.title),
                        e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, color: 'var(--text)' } }, item.desc)
                    )
                )
            ),

    // 4. Elegant Text Section (Document Standards & Utility)
    e('div', {
        className: 'w2p-paragraphs-section',
        style: { 
            marginTop: '80px', 
            padding: '60px', 
            background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(0,0,0,0.02) 100%)', 
            borderRadius: '32px', 
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }
    },
        e('h2', { 
            className: 'w2p-paragraphs-heading',
            style: { fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text)', letterSpacing: '-0.4px' } 
        }, 'The Benchmark for Modern Document Standardization'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85, marginBottom: '20px' } 
        }, 'In professional and legal landscapes, how your documentation is shared matters just as much as its content. Word documents are inherently editable and fluid, which means their visual layout can break or shift depending on the software, system fonts, or device used by the recipient. Transitioning your DOCX assets into standard PDFs guarantees absolute consistency—ensuring that your formal reports, business proposals, and legal frameworks are viewed exactly as intended, without unexpected layout anomalies.'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85 } 
        }, 'Our platform strips away the complexities of traditional file conversion by delivering a clean, web-native utility optimized for heavy corporate use. Built upon cutting-edge document parsing systems, it respects the precise visual geometry of your original file while actively compressing the final asset for web-ready transmission. Experience a truly unified workflow where speed, visual accuracy, and robust data privacy converge harmoniously.')
    )
),
        // --- WORD TO PDF: 5 IMAGES & DETAIL SECTION END ---
        // --- LINKEDIN BANNER: 5 IMAGES & DETAIL SECTION START ---
        currentPage === 'banner' && e('div', { 
    className: 'bnr-container',
    style: { width: '100%', maxWidth: '1400px', margin: '60px auto', padding: '0 40px', paddingBottom: '60px', boxSizing: 'border-box' } 
},
    // 1. Dynamic Responsive Styles Injection
    e('style', null, `
        @media (max-width: 768px) {
            .bnr-container { padding: 0 20px !important; margin: 40px auto !important; }
            .bnr-heading { font-size: 28px !important; margin-bottom: 40px !important; }
            .bnr-card { 
                flex-direction: column !important; 
                gap: 24px !important; 
                padding: 24px !important; 
                margin-bottom: 30px !important;
            }
            .bnr-col { flex: 1 1 100% !important; padding: 0 !important; }
            .bnr-img { height: 240px !important; }
            .bnr-paragraphs-section { padding: 30px 20px !important; margin-top: 50px !important; border-radius: 20px !important; }
            .bnr-paragraphs-heading { font-size: 26px !important; text-align: center; }
        }
    `),

    // 2. Main Page Heading
    e('h2', { 
        className: 'bnr-heading',
        style: { textAlign: 'center', fontSize: '38px', fontWeight: '900', marginBottom: '60px', color: 'var(--accent)', letterSpacing: '-0.5px' } 
    }, 'Design Banners That Demand Attention'),
    
    // 3. Feature Cards Loop
    [
        { 
            img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', 
            title: 'Tailored Corporate Aesthetics', 
            desc: 'Architect high-end profile headers that perfectly align with your target niche. Refine your narrative with industry-specific visual assets reflecting corporate maturity and executive presence instantly.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80', 
            title: 'Pixel-Perfect Dimensions', 
            desc: 'Eliminate awkward cropping or blurry upscaling. Every custom layout is mathematically calibrated to fit standard corporate network safe-zones perfectly across web and mobile display viewports.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80', 
            title: 'Personal Branding Edge', 
            desc: 'Break away from generic background placeholders. Highlight core professional philosophies, consulting services, or unique market value with high-contrast, modern layout typography.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&q=80', 
            title: 'Modern Abstract Visuals', 
            desc: 'Access an ultra-premium, curated catalog of sleek geometric shapes, tech backgrounds, and fluid gradient patterns designed explicitly to secure instant user engagement and lock in recruiter retention.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 
            title: 'Instant High-Res Export', 
            desc: 'Render your final production assets immediately. Experience sharp, uncompressed digital exports that retain vector-like clarity, ensuring your profile layout remains authoritative on ultra-HD screens.' 
        }
    ].map((item, index) => 
        e('div', { 
            key: index, 
            className: 'bnr-card',
            style: { 
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
                alignItems: 'center', 
                gap: '50px', 
                marginBottom: '50px', 
                background: 'var(--card-bg)', 
                padding: '40px', 
                borderRadius: '24px', 
                border: '1px solid var(--border)', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)' 
            } 
        },
            e('div', { className: 'bnr-col', style: { flex: '1 1 500px' } }, 
                e('img', { 
                    src: item.img, 
                    className: 'bnr-img',
                    style: { 
                        width: '100%', 
                        height: '380px', 
                        objectFit: 'cover', 
                        borderRadius: '18px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    } 
                })
            ),
            e('div', { className: 'bnr-col', style: { flex: '1 1 500px', padding: '20px' } },
                e('h3', { style: { fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.3px' } }, item.title),
                e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, color: 'var(--text)' } }, item.desc)
            )
        )
    ),

    // 4. Elegant Text Section (Visual Branding & First Impressions)
    e('div', {
        className: 'bnr-paragraphs-section',
        style: { 
            marginTop: '80px', 
            padding: '60px', 
            background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(0,0,0,0.02) 100%)', 
            borderRadius: '32px', 
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }
    },
        e('h2', { 
            className: 'bnr-paragraphs-heading',
            style: { fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text)', letterSpacing: '-0.4px' } 
        }, 'The Psychology of First Impressions in Digital Networking'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85, marginBottom: '20px' } 
        }, 'Your digital profile banner is the single largest visual canvas a visitor encounters when landing on your professional ecosystem. Within a split second, it establishes your industry footprint, structural maturity, and corporate authority. Leaving this space blank or using a poorly formatted background subconsciously signals an incomplete presence. Conversely, a customized, visually balanced header instantly validates your professional positioning and showcases your absolute attention to detail.'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85 } 
        }, 'Modern career networking demands an active evolution from text-heavy configurations to premium, visual storytelling. By unifying sleek corporate geometry, intentional color theory, and crisp typography, our canvas engine helps you capture industry mindshare effortlessly. It is no longer just about filling a slot—it is about strategically engineering an artistic hook that seamlessly transitions casual profile skimmers into enterprise partners, corporate recruiters, and lasting high-value career connections.')
    )
),
        // --- LINKEDIN BANNER: 5 IMAGES & DETAIL SECTION END ---
        // --- WORD EDITOR: 5 IMAGES & DETAIL SECTION START ---
        currentPage === 'wordEditor' && e('div', { 
    className: 'wde-container',
    style: { width: '100%', maxWidth: '1400px', margin: '60px auto', padding: '0 40px', paddingBottom: '60px', boxSizing: 'border-box' } 
},
    // 1. Dynamic Responsive Styles Injection
    e('style', null, `
        @media (max-width: 768px) {
            .wde-container { padding: 0 20px !important; margin: 40px auto !important; }
            .wde-heading { font-size: 28px !important; margin-bottom: 40px !important; }
            .wde-card { 
                flex-direction: column !important; 
                gap: 24px !important; 
                padding: 24px !important; 
                margin-bottom: 30px !important;
            }
            .wde-col { flex: 1 1 100% !important; padding: 0 !important; }
            .wde-img { height: 240px !important; }
            .wde-paragraphs-section { padding: 30px 20px !important; margin-top: 50px !important; border-radius: 20px !important; }
            .wde-paragraphs-heading { font-size: 26px !important; text-align: center; }
        }
    `),

    // 2. Main Page Heading
    e('h2', { 
        className: 'wde-heading',
        style: { textAlign: 'center', fontSize: '38px', fontWeight: '900', marginBottom: '60px', color: 'var(--accent)', letterSpacing: '-0.5px' } 
    }, 'Powerful Document Editing Redefined'),
    
    // 3. Feature Cards Loop
    [
        { 
            img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80', 
            title: 'Advanced Typography Engine', 
            desc: 'Take absolute control over document formatting. Effortlessly orchestrate hierarchical headings, custom line geometries, inline styles, and element scaling through a sleek typographic interface.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80', 
            title: 'Immersive Zen Layout', 
            desc: 'Maximize cognitive focus and speed. Our minimalist canvas eliminates peripheral digital noise, delivering a clean writing workspace engineered exclusively to cultivate uninterrupted deep work.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', 
            title: 'Real-Time State Cache', 
            desc: 'Eliminate data anxiety permanently. The core editing framework continuously protects your active drafting session, anchoring your progress against power drops or browser tab crashes.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', 
            title: 'Intelligent Clipboard Sanitizer', 
            desc: 'Import external assets flawlessly. Our advanced background semantic parser instantly strips out malicious styling fragments and corrupted nesting codes upon pasting from foreign web pages.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&q=80', 
            title: 'Lossless Document Compilation', 
            desc: 'Transform your thoughts into structured corporate assets. Compile drafts instantly into clean digital files optimized for immediate publishing, physical printing, or workspace synchronization.' 
        }
    ].map((item, index) => 
        e('div', { 
            key: index, 
            className: 'wde-card',
            style: { 
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
                alignItems: 'center', 
                gap: '50px', 
                marginBottom: '50px', 
                background: 'var(--card-bg)', 
                padding: '40px', 
                borderRadius: '24px', 
                border: '1px solid var(--border)', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)' 
            } 
        },
            e('div', { className: 'wde-col', style: { flex: '1 1 500px' } }, 
                e('img', { 
                    src: item.img, 
                    className: 'wde-img',
                    style: { 
                        width: '100%', 
                        height: '380px', 
                        objectFit: 'cover', 
                        borderRadius: '18px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    } 
                })
            ),
            e('div', { className: 'wde-col', style: { flex: '1 1 500px', padding: '20px' } },
                e('h3', { style: { fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.3px' } }, item.title),
                e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, color: 'var(--text)' } }, item.desc)
            )
        )
    ),

    // 4. Premium Text Section (Document Processing Flow & Content Strategy)
    e('div', {
        className: 'wde-paragraphs-section',
        style: { 
            marginTop: '80px', 
            padding: '60px', 
            background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(0,0,0,0.02) 100%)', 
            borderRadius: '32px', 
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }
    },
        e('h2', { 
            className: 'wde-paragraphs-heading',
            style: { fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text)', letterSpacing: '-0.4px' } 
        }, 'The Evolution of Cognitive Flow in Modern Writing Interfaces'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85, marginBottom: '20px' } 
        }, 'Traditional word processors often clutter the user screen with hundreds of redundant buttons, complex sub-menus, and legacy sidebars that actively fragment your thought process. When the tool requires more attention than the actual synthesis of ideas, creative momentum breaks. Modern document generation requires an intentional shift toward fluid minimalism—an equilibrium where high-performance typography engines exist quietly in the background, making themselves available only when structural intent is called upon.'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85 } 
        }, 'Beyond eliminating visual overhead, our cloud-native canvas solves the deeper technical hurdles of text compilation. By deploying sophisticated clipboard normalization algorithms, it seamlessly filters out corrupt source layouts from external clippings, allowing you to synthesize cross-platform references without breaking your global document ecosystem. This ensures that whether you are drafting a rapid engineering brief or structuring a massive technical report, your workflow stays focused entirely on execution.')
    )
),
        // --- WORD EDITOR: 5 IMAGES & DETAIL SECTION END ---
        // --- LOGO MAKER: 5 IMAGES & DETAIL SECTION START ---
        currentPage === 'logo' && e('div', { 
    className: 'lgo-container',
    style: { width: '100%', maxWidth: '1400px', margin: '60px auto', padding: '0 40px', paddingBottom: '60px', boxSizing: 'border-box' } 
},
    // 1. Dynamic Responsive Styles Injection
    e('style', null, `
        @media (max-width: 768px) {
            .lgo-container { padding: 0 20px !important; margin: 40px auto !important; }
            .lgo-heading { font-size: 28px !important; margin-bottom: 40px !important; }
            .lgo-card { 
                flex-direction: column !important; 
                gap: 24px !important; 
                padding: 24px !important; 
                margin-bottom: 30px !important;
            }
            .lgo-col { flex: 1 1 100% !important; padding: 0 !important; }
            .lgo-img { height: 240px !important; }
            .lgo-paragraphs-section { padding: 30px 20px !important; margin-top: 50px !important; border-radius: 20px !important; }
            .lgo-paragraphs-heading { font-size: 26px !important; text-align: center; }
        }
    `),

    // 2. Main Page Heading
    e('h2', { 
        className: 'lgo-heading',
        style: { textAlign: 'center', fontSize: '38px', fontWeight: '900', marginBottom: '60px', color: 'var(--accent)', letterSpacing: '-0.5px' } 
    }, 'Craft an Unforgettable Brand Identity'),
    
    // 3. Feature Cards Loop
    [
        { 
            img: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80', 
            title: 'Vector-Perfect Clarity', 
            desc: 'Maintain absolute visual geometry. Sculpt signature brand marks that scale seamlessly from microscopic application icons to massive digital storefront installations without a single fraction of quality loss.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80', 
            title: 'Strategic Color Harmony', 
            desc: 'Harness the science of color theory. Access highly optimized palettes calibrated around modern consumer psychology to trigger specific emotional anchors and secure maximum brand retention.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80', 
            title: 'Modern Typography Blocks', 
            desc: 'Anchor your visual emblem with elite, hand-picked typefaces. Establish an instantaneous visual hierarchy and deep corporate validity that leaves a premium, lasting imprint on your market.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 
            title: 'Minimalist & Bold Archetypes', 
            desc: 'Dominate heavily saturated commercial spaces. Our canvas focuses on isolating the raw essence of your vision, structuring timeless configurations that remain instantly recognizable anywhere.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', 
            title: 'Transparent Asset Exports', 
            desc: 'Deploy your assets instantly across your corporate network. Download high-fidelity layers with crystal-clear alpha transparency masks, fully optimized for web systems, clothing, or physical print.' 
        }
    ].map((item, index) => 
        e('div', { 
            key: index, 
            className: 'lgo-card',
            style: { 
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
                alignItems: 'center', 
                gap: '50px', 
                marginBottom: '50px', 
                background: 'var(--card-bg)', 
                padding: '40px', 
                borderRadius: '24px', 
                border: '1px solid var(--border)', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)' 
            } 
        },
            e('div', { className: 'lgo-col', style: { flex: '1 1 500px' } }, 
                e('img', { 
                    src: item.img, 
                    className: 'lgo-img',
                    style: { 
                        width: '100%', 
                        height: '380px', 
                        objectFit: 'cover', 
                        borderRadius: '18px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    } 
                })
            ),
            e('div', { className: 'lgo-col', style: { flex: '1 1 500px', padding: '20px' } },
                e('h3', { style: { fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.3px' } }, item.title),
                e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, color: 'var(--text)' } }, item.desc)
            )
        )
    ),

    // 4. Premium Text Section (Brand Psychology & Strategy)
    e('div', {
        className: 'lgo-paragraphs-section',
        style: { 
            marginTop: '80px', 
            padding: '60px', 
            background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(0,0,0,0.02) 100%)', 
            borderRadius: '32px', 
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }
    },
        e('h2', { 
            className: 'lgo-paragraphs-heading',
            style: { fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text)', letterSpacing: '-0.4px' } 
        }, 'The Visual Architecture of Sustainable Brand Value'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85, marginBottom: '20px' } 
        }, 'A truly iconic logo does far more than simply label a business—it operates as the structural cornerstone of an entire commercial ecosystem. In a world where consumers encounter thousands of sensory inputs daily, visual simplicity mixed with profound intent is what separates enduring global companies from temporary trends. The most successful brand marks translate complex internal corporate values, high-level strategies, and product philosophies into clean visual parameters that build immediate consumer trust and recognition.'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85 } 
        }, 'Our creation architecture eliminates the common pitfalls of modern logo rendering by enforcing rigid layout grids and mathematical geometry. By optimizing the relationships between graphic symbols, white space, and corporate typography, it helps you construct a mark that preserves its balance across any viewport or media type. Whether your emblem lives on a high-definition mobile display or anchor packaging, it retains its sharpness, depth, and ultimate marketplace authority.')
    )
),
        // --- LOGO MAKER: 5 IMAGES & DETAIL SECTION END ---
        // --- UNZIP FILE: 5 IMAGES & DETAIL SECTION START ---
        currentPage === 'unzip' && e('div', { 
    className: 'uzp-container',
    style: { width: '100%', maxWidth: '1400px', margin: '60px auto', padding: '0 40px', paddingBottom: '60px', boxSizing: 'border-box' } 
},
    // 1. Dynamic Responsive Styles Injection
    e('style', null, `
        @media (max-width: 768px) {
            .uzp-container { padding: 0 20px !important; margin: 40px auto !important; }
            .uzp-heading { font-size: 28px !important; margin-bottom: 40px !important; }
            .uzp-card { 
                flex-direction: column !important; 
                gap: 24px !important; 
                padding: 24px !important; 
                margin-bottom: 30px !important;
            }
            .uzp-col { flex: 1 1 100% !important; padding: 0 !important; }
            .uzp-img { height: 240px !important; }
            .uzp-paragraphs-section { padding: 30px 20px !important; margin-top: 50px !important; border-radius: 20px !important; }
            .uzp-paragraphs-heading { font-size: 26px !important; text-align: center; }
        }
    `),

    // 2. Main Page Heading
    e('h2', { 
        className: 'uzp-heading',
        style: { textAlign: 'center', fontSize: '38px', fontWeight: '900', marginBottom: '60px', color: 'var(--accent)', letterSpacing: '-0.5px' } 
    }, 'High-Speed Secure File Decompression'),
    
    // 3. Feature Cards Loop
    [
        { 
            img: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80', 
            title: 'Instant Multi-Format Extraction', 
            desc: 'Decompress multi-format archive packages effortlessly. Our core engine processes ZIP, RAR, 7Z, and major compression architectures natively within your session without requiring legacy third-party software overhead.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1600132806608-231446b2e7af?w=800&q=80', 
            title: 'Smart Directory Structuring', 
            desc: 'Preserve complex nested folder architectures flawlessly. Extracted file assets retain their exact hierarchical naming conventions, structural dependencies, and internal directory trees down to the last node.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', 
            title: 'Zero-Wait Browser Processing', 
            desc: 'Leverage cutting-edge client-side compute loops. Your data payloads are decompressed instantly within your local engine pipeline, delivering blistering unpacking speeds regardless of package density.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 
            title: 'Advanced Encrypted Security', 
            desc: 'Enforce strict data sovereignty. Because all cryptographic processing runs locally inside your secure sandboxed browser thread, your archive content is never transmitted to foreign cloud nodes.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', 
            title: 'Selective File Downloads', 
            desc: 'Shatter the constraints of bulk extraction. Interrogate the compressed archive manifest directly through a clean user dashboard and isolate only the specific document assets you need to export.' 
        }
    ].map((item, index) => 
        e('div', { 
            key: index, 
            className: 'uzp-card',
            style: { 
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
                alignItems: 'center', 
                gap: '50px', 
                marginBottom: '50px', 
                background: 'var(--card-bg)', 
                padding: '40px', 
                borderRadius: '24px', 
                border: '1px solid var(--border)', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)' 
                    } 
                },
            e('div', { className: 'uzp-col', style: { flex: '1 1 500px' } }, 
                e('img', { 
                    src: item.img, 
                    className: 'uzp-img',
                    style: { 
                        width: '100%', 
                        height: '380px', 
                        objectFit: 'cover', 
                        borderRadius: '18px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                            } 
                        })
                    ),
            e('div', { className: 'uzp-col', style: { flex: '1 1 500px', padding: '20px' } },
                e('h3', { style: { fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.3px' } }, item.title),
                e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, color: 'var(--text)' } }, item.desc)
                    )
                )
            ),

    // 4. Premium Text Section (Data Integrity & Client-Side Benefits)
    e('div', {
        className: 'uzp-paragraphs-section',
        style: { 
            marginTop: '80px', 
            padding: '60px', 
            background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(0,0,0,0.02) 100%)', 
            borderRadius: '32px', 
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }
    },
        e('h2', { 
            className: 'uzp-paragraphs-heading',
            style: { fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text)', letterSpacing: '-0.4px' } 
        }, 'The New Paradigm of Client-Side Data Architecture'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85, marginBottom: '20px' } 
        }, 'Data compression remains one of the fundamental backbones of digital asset transmission, yet the conventional cloud tools used to unpack these archives often introduce unwanted security exposures and processing bottlenecks. Relying on remote servers to decompress private intellectual property introduces data intercept risks, while legacy desktop software introduces installation friction. The evolution of modern web applications shifts this heavy computational processing entirely to the client-side, enabling robust multi-format unpacking directly within a safe, sandboxed environment.'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85 } 
        }, 'By deploying highly optimized stream parsing algorithms, our framework bridges the gap between desktop-class performance and browser simplicity. This zero-trust architecture ensures that whether you are dealing with multi-gigabyte engineering builds, sensitive corporate records, or high-density creative media packages, your assets are audited and unzipped at the edge. Experience a unified, frictionless utility where computational speed meets uncompromising privacy sovereignty.')
    )
),
        // --- UNZIP FILE: 5 IMAGES & DETAIL SECTION END ---
        // --- MAKE ZIP: 5 IMAGES & DETAIL SECTION START ---
        currentPage === 'makeZip' && e('div', { 
    className: 'mzp-container',
    style: { width: '100%', maxWidth: '1400px', margin: '60px auto', padding: '0 40px', paddingBottom: '60px', boxSizing: 'border-box' } 
},
    // 1. Dynamic Responsive Styles Injection
    e('style', null, `
        @media (max-width: 768px) {
            .mzp-container { padding: 0 20px !important; margin: 40px auto !important; }
            .mzp-heading { font-size: 28px !important; margin-bottom: 40px !important; }
            .mzp-card { 
                flex-direction: column !important; 
                gap: 24px !important; 
                padding: 24px !important; 
                margin-bottom: 30px !important;
            }
            .mzp-col { flex: 1 1 100% !important; padding: 0 !important; }
            .mzp-img { height: 240px !important; }
            .mzp-paragraphs-section { padding: 30px 20px !important; margin-top: 50px !important; border-radius: 20px !important; }
            .mzp-paragraphs-heading { font-size: 26px !important; text-align: center; }
        }
    `),

    // 2. Main Page Heading
    e('h2', { 
        className: 'mzp-heading',
        style: { textAlign: 'center', fontSize: '38px', fontWeight: '900', marginBottom: '60px', color: 'var(--accent)', letterSpacing: '-0.5px' } 
    }, 'Optimize Storage with Smart File Compression'),
    
    // 3. Feature Cards Loop
    [
        { 
            img: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80', 
            title: 'High-Ratio Bulk Compression', 
            desc: 'Maximize your data payload density. Pack high-resolution assets, dense documentation trees, and source code-bases into a singular, highly stream-ready archive to accelerate distribution channels.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 
            title: 'Instant Client-Side Archiving', 
            desc: 'Bypass remote network traffic bottlenecks entirely. Our compression algorithms compile your data structures natively within your local engine pipeline, completely discarding arbitrary size constraints.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', 
            title: 'Maintain Folder Hierarchies', 
            desc: 'Retain your rigid structural taxonomy effortlessly. Map extensive systemic folder hierarchies, hidden configuration scripts, or multi-nested paths into the builder without breaking any system links.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1600132806608-231446b2e7af?w=800&q=80', 
            title: 'Secure & Private Packaging', 
            desc: 'Enforce baseline zero-knowledge isolation. Since all structural calculations happen entirely inside your device sandboxed engine thread, no tracking parameters or raw data blocks leak out.' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', 
            title: 'Universal Archive Compatibility', 
            desc: 'Generate highly standard, compliant .zip files. Every compressed payload satisfies global file protocol standards, ensuring seamless compatibility across Windows, macOS, Linux, and mobile kernels.' 
        }
    ].map((item, index) => 
        e('div', { 
            key: index, 
            className: 'mzp-card',
            style: { 
                display: 'flex', 
                flexWrap: 'wrap', 
                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
                alignItems: 'center', 
                gap: '50px', 
                marginBottom: '50px', 
                background: 'var(--card-bg)', 
                padding: '40px', 
                borderRadius: '24px', 
                border: '1px solid var(--border)', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)' 
            } 
        },
            e('div', { className: 'mzp-col', style: { flex: '1 1 500px' } }, 
                e('img', { 
                    src: item.img, 
                    className: 'mzp-img',
                    style: { 
                        width: '100%', 
                        height: '380px', 
                        objectFit: 'cover', 
                        borderRadius: '18px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    } 
                })
            ),
            e('div', { className: 'mzp-col', style: { flex: '1 1 500px', padding: '20px' } },
                e('h3', { style: { fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.3px' } }, item.title),
                e('p', { style: { fontSize: '17px', lineHeight: '1.8', opacity: 0.8, color: 'var(--text)' } }, item.desc)
            )
        )
    ),

    // 4. Premium Text Section (Data Packing Dynamics & Storage Efficiency)
    e('div', {
        className: 'mzp-paragraphs-section',
        style: { 
            marginTop: '80px', 
            padding: '60px', 
            background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(0,0,0,0.02) 100%)', 
            borderRadius: '32px', 
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }
    },
        e('h2', { 
            className: 'mzp-paragraphs-heading',
            style: { fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text)', letterSpacing: '-0.4px' } 
        }, 'The Strategic Imperative of Fluid Asset Bundling'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85, marginBottom: '20px' } 
        }, 'Managing heavy data pipelines without structured compression introduces extensive latency across modern communication architectures. Whether distributing critical engineering directories, high-resolution brand assets, or layered corporate records, raw file sizes quickly saturate bandwidth and stretch operational overhead. Consolidating disparate data nodes into mathematically optimized containers transforms an otherwise chaotic compilation into a lightweight, deployable asset that accelerates cloud transmission speeds.'),
        e('p', { 
            style: { fontSize: '16px', lineHeight: '1.8', color: 'var(--text)', opacity: 0.85 } 
        }, 'Our client-side compression environment bypasses the security bottlenecks of conventional processing models by utilizing highly optimized script frameworks directly in your runtime execution layer. By avoiding the need to bounce your sensitive code-bases or private frameworks off multi-tenant staging servers, it builds standard archives securely at the ecosystem margin. Discover an enterprise-grade archiving environment where lightning-fast execution speed matches total structural compliance and data security.')
    )
),
        // --- MAKE ZIP: 5 IMAGES & DETAIL SECTION END ---

// 🏠 BACK TO HOME PREMIUM BUTTON (Har page par footer se upar dikhega)
    currentPage !== 'landing' && currentPage !== 'home' && e('div', {
        style: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: '60px',
            marginBottom: '-40px', // Footer ke sath adjust karne ke liye
            position: 'relative',
            zIndex: 10
        }
    },
        e('button', {
            style: {
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
                color: 'var(--accent)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                padding: '12px 28px',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(56, 189, 248, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            },
            onClick: () => {
                // Agar aapke navigation function ka naam 'setCurrentPage' hai ya 'navigate' hai:
                if (typeof navigate === 'function') navigate('landing');
                else if (typeof setCurrentPage === 'function') setCurrentPage('landing');
            },
            // Hover effect inject karne ke liye inline logic ya simple transitions
            onMouseEnter: (e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 15px 30px rgba(56, 189, 248, 0.2)';
            },
            onMouseLeave: (e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(56, 189, 248, 0.1)';
            }
        }, 
            e('span', { style: { fontSize: '16px' } }, '✨'), // Chota sa icon
            'Back to Home'
        )
    ),

    // Aapka purana footer block yahan se shuru hoga 👇
    e('footer', { 
        className: 'footer glowprism-container',
    style: { 
        padding: '70px 20px 40px', 
        marginTop: '120px', 
        background: 'linear-gradient(to bottom, rgba(15, 15, 15, 0.75), rgba(8, 8, 8, 0.96))', 
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 -25px 60px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer'
    } 
}, [
    // ⚡ SELF-CONTAINED CSS ARCHITECTURE FOR ADVANCED ANIMATIONS
    e('style', { key: 'glowprism-core-effects' }, `
        @keyframes glowprism-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .glowprism-bar {
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #3b82f6);
            background-size: 200% auto;
            animation: glowprism-shift 4s linear infinite;
        }
        /* Hover Effect: Border Intensifies & Brightens */
        .glowprism-container:hover .glowprism-bar {
            height: 3.5px !important;
            filter: brightness(1.25);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.7);
        }
        /* Click State: Line thickens, colors flash super-fast & glow explodes */
        .glowprism-container:active .glowprism-bar {
            height: 5.5px !important;
            filter: brightness(1.5);
            box-shadow: 0 0 30px rgba(236, 72, 153, 1);
            animation-duration: 1.2s !important;
        }
        /* Smooth Link Interactions */
        .footer-premium-link {
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-premium-link:hover {
            color: var(--accent) !important;
            transform: translateX(5px);
            opacity: 1 !important;
        }
    `),

    // 🌟 THE RUNNING GLOWPRISM LINE (TOP BORDER)
    e('div', { 
        className: 'glowprism-bar', 
        style: { 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '2.5px', 
            zIndex: 10,
            transition: 'all 0.3s ease'
        } 
    }),

    // Ambient Deep Glow Spheres (Background Details)
    e('div', { style: { position: 'absolute', bottom: '-80px', right: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', filter: 'blur(70px)', borderRadius: '50%', zIndex: 0 } }),
    e('div', { style: { position: 'absolute', top: '-40px', left: '-40px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%', zIndex: 0 } }),

    // Content Grid Wrapper
    e('div', { style: { maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 } }, [
        // Top Section: Brand & Links Grid Layout
        e('div', { 
            style: { 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '50px', 
                textAlign: window.innerWidth < 768 ? 'center' : 'left',
                marginBottom: '45px'
            } 
        }, [
            // Column 1: Cyber Brand Typography
            e('div', null, [
                e('div', { 
                    style: { 
                        fontWeight: '950', 
                        color: 'var(--text)', 
                        fontSize: '24px', 
                        marginBottom: '16px', 
                        letterSpacing: '-1.5px', 
                        cursor: 'pointer',
                        background: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0.75))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    },
                    onClick: () => navigate('landing') 
                }, 'RESUME.PRO'),
                e('p', { style: { fontSize: '13.5px', opacity: 0.5, lineHeight: '1.7', maxWidth: '320px', margin: window.innerWidth < 768 ? '0 auto' : '0' } }, // 🔥 Mobile par auto-center 
                    'Empowering high-velocity digital operators with next-generation visual systems. Build, render, layout, and compile in absolute data custody.'
                )
            ]),

            // Column 2: Core Matrix Navigation Links
            e('div', null, [
    e('h4', { style: { fontSize: '11px', fontWeight: '900', marginBottom: '22px', textTransform: 'uppercase', letterSpacing: '2.5px', color: 'var(--accent)' } }, 'Platform Core'),
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
        ['landing', 'home', 'wordToPdf', 'banner', 'wordEditor', 'logo', 'unzip', 'makeZip'].map(item => {
            // Yahan hum conditionally naam change kar rahe hain
            let displayLabel = item.replace(/([A-Z])/g, ' $1');
            if (item === 'landing') displayLabel = 'Home';
            if (item === 'home') displayLabel = 'Resume Maker';

            return e('span', { 
                key: item,
                className: 'footer-premium-link', 
                style: { 
                    fontSize: '13.5px', 
                    cursor: 'pointer', 
                    display: 'block', 
                    textTransform: 'capitalize', 
                    color: 'var(--text)', 
                    opacity: 0.55, 
                    fontWeight: '500' 
                }, 
                onClick: () => navigate(item) 
            }, displayLabel);
        })
    )
]),

            // Column 3: Architecture Protocols (Legal)
            e('div', null, [
    // System Integrity ko blue kar diya hai
    e('h4', { style: { fontSize: '11px', fontWeight: '900', marginBottom: '22px', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#007bff' } }, 'System Integrity'),
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } }, [
        e('span', { className: 'footer-premium-link', style: { fontSize: '13.5px', cursor: 'pointer', color: 'var(--text)', opacity: 0.55, fontWeight: '500' }, onClick: () => navigate('privacy') }, 'Privacy Architecture'),
        e('span', { className: 'footer-premium-link', style: { fontSize: '13.5px', cursor: 'pointer', color: 'var(--text)', opacity: 0.55, fontWeight: '500' }, onClick: () => navigate('terms') }, 'Terms of Protocol'),
        // Contact Gateway ko bilkul privacy wale span jaisa same to same kar diya hai
        e('span', { className: 'footer-premium-link', style: { fontSize: '13.5px', cursor: 'pointer', color: 'var(--text)', opacity: 0.55, fontWeight: '500' }, onClick: () => navigate('contact') }, 'Contact Gateway')
    ])
])
        ]),

        // High-End Micro Divider Line
        e('div', { style: { height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)', width: '100%', marginBottom: '35px' } }),

        // Bottom Area: Sovereign Metrics & Credits
        e('div', { 
            style: { 
                display: 'flex', 
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: 'center', 
                width: '100%',
                gap: window.innerWidth < 768 ? '16px' : '20px',
                textAlign: 'center'
            } 
        }, [
            // Left Side: Copyright Meta
            e('p', { 
                style: { 
                    fontSize: '12.5px', 
                    opacity: 0.4, 
                    margin: '0', 
                    padding: '0',
                    fontWeight: '400',
                    letterSpacing: '0.3px',
                    lineHeight: window.innerWidth < 768 ? '1.4' : '1.5' 
                } 
            }, 
                `© ${new Date().getFullYear()} Resume Pro All Rights Reserved.`
            ),
            
            // Right Side: Kinetic Paras Branding
            e('div', { 
                style: { 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: 'var(--text)',
                    opacity: 0.85, 
                    margin: '0', 
                    padding: '0',
                    letterSpacing: '0.3px',
                    lineHeight: window.innerWidth < 768 ? '1.4' : '1'
                } 
            }, [
                'Created with ',
                e('span', { style: { color: '#ef4444', display: 'inline-block', transform: 'scale(1.15)', margin: '0 4px' } }, '❤️'),
                ' by ',
                e('span', { 
                    style: { 
                        background: 'linear-gradient(90deg, var(--accent), #ec4899, #3b82f6)', 
                        backgroundSize: '200% auto',
                        animation: 'glowprism-shift 3s linear infinite',
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '950',
                        letterSpacing: '0.8px'
                    } 
                }, 'PARAS')
            ])
        ])
    ])
])
)
    
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));