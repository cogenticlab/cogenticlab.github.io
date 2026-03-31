// main.js - 语言切换与初始化逻辑
let currentLang = null;
let translations = null;

function loadLanguage(lang, callback) {
    const script = document.createElement('script');
    script.src = `${lang}.js`;
    script.onload = function() {
        if (lang === 'zh') {
            translations = zhTranslations;
        } else if (lang === 'en') {
            translations = enTranslations;
        }
        callback();
    };
    script.onerror = function() {
        console.error(`Failed to load: ${lang}.js`);
        if (lang !== 'en') loadLanguage('en', callback);
    };
    document.head.appendChild(script);
}

function setLanguage(lang) {
    if (currentLang === lang) return;
    currentLang = lang;
    loadLanguage(lang, () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations && translations[key] !== undefined) {
                if (key === 'agent_cli_desc1' || key === 'footer_note_small') {
                    el.innerHTML = translations[key];
                } else {
                    el.innerText = translations[key];
                }
            }
        });
        document.documentElement.setAttribute('data-lang', lang);
        document.querySelectorAll('.lang-switch button').forEach(btn => {
            btn.classList.toggle('active', 
                (lang === 'zh' && btn.id === 'lang-zh') || 
                (lang === 'en' && btn.id === 'lang-en')
            );
        });
    });
}

function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

// 绑定事件
document.getElementById('lang-zh').onclick = () => setLanguage('zh');
document.getElementById('lang-en').onclick = () => setLanguage('en');

// 初始化
setLanguage(detectBrowserLanguage());