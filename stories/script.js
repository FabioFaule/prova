// Story functionality
        document.addEventListener('DOMContentLoaded', function() {
            
            // Function to convert markdown-like syntax to HTML
            function formatText(text) {
                // Convert **text** to <strong class="highlighted-word">text</strong> (bold + highlighted)
                text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="highlighted-word">$1</strong>');
                // Convert *text* to <em>text</em> (italic)
                text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
                return text;
            }
            
            // Add event listeners to all level buttons
            document.querySelectorAll('.lw-level-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const level = this.getAttribute('data-level');
                    const card = this.closest('.lw-card');
                    const storyContainer = card.querySelector('.lw-story-container');
                    
                    // Check if this button is already active (story is open)
                    const isCurrentlyActive = this.classList.contains('active');
                    
                    if (isCurrentlyActive) {
                        // If the button is already active, close the story
                        this.classList.remove('active');
                        
                        // Force blur to remove focus state
                        this.blur();
                        
                        // Reset all inline styles that might persist
                        this.style.cssText = '';
                        
                        // Force a reflow to ensure styles are reset
                        this.offsetHeight;
                        
                        storyContainer.classList.remove('show');
                        storyContainer.innerHTML = '';
                        return;
                    }
                    
                    // Find the script tag with storiesData in this card
                    const scriptTag = card.querySelector('script');
                    if (!scriptTag) return;
                    
                    // Extract storiesData from the script content
                    const scriptContent = scriptTag.textContent;
                    const storiesDataMatch = scriptContent.match(/const storiesData = ({[\s\S]*?});/);
                    if (!storiesDataMatch) return;
                    
                    try {
                        const storiesData = eval('(' + storiesDataMatch[1] + ')');
                        
                        // Remove active class from all buttons in this card
                        card.querySelectorAll('.lw-level-btn').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        
                        // Add active class to clicked button
                        this.classList.add('active');
                        
                        // Get story data for selected level
                        const storyData = storiesData[level];
                        if (!storyData) return;
                        
                        // Format the story content with markdown-like syntax
                        const formattedContent = formatText(storyData.content);
                        
                        // Create story HTML
                        let storyHTML = `
                            <div class="story-level-badge">Level ${storyData.level}</div>
                            <div class="story-title">${storyData.title}</div>
                            <div class="story-content">${formattedContent}</div>
                        `;
                        
                        // Add difficult words section if available
                        if (storyData.difficultWords && Object.keys(storyData.difficultWords).length > 0) {
                            storyHTML += `
                                <div class="difficult-words">
                                    <h3>📚 Difficult Words</h3>
                                    <div class="words-list">
                            `;
                            
                            Object.entries(storyData.difficultWords).forEach(([word, definition]) => {
                                storyHTML += `
                                    <div class="word-item">
                                        <strong>${word}:</strong> ${definition}
                                    </div>
                                `;
                            });
                            
                            storyHTML += `
                                    </div>
                                </div>
                            `;
                        }
                        
                        // Insert story HTML and show container
                        storyContainer.innerHTML = storyHTML;
                        storyContainer.classList.add('show');
                        
                    } catch (error) {
                        console.error('Error parsing story data:', error);
                    }
                });
            });
        });

        // Cookie Consent Manager - Same as in study_area.html
        const COOKIE_CONFIG = {
            consentCookieName: 'cookie_consent',
            expirationDays: 365,
            domain: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? null : window.location.hostname,
            adsClientId: 'ca-pub-8624143381240320'
        };

        function setCookie(name, value, days, domain = null) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            
            let cookieString = `${name}=${value}${expires}; path=/`;
            
            if (domain && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
                cookieString += `; domain=${domain}; SameSite=Lax`;
            }
            
            document.cookie = cookieString;
        }

        function getCookie(name) {
            const value = "; " + document.cookie;
            const parts = value.split("; " + name + "=");
            if (parts.length === 2) {
                return parts.pop().split(";").shift();
            }
            return null;
        }

        function loadGoogleAds() {
            if (window.adsLoaded) return;
            
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname.includes('file://')) {
                window.adsLoaded = true;
                return;
            }
            
            if (location.hostname === "learnwithme.work") {
                try {
                    var adsScript = document.createElement('script');
                    adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${COOKIE_CONFIG.adsClientId}`;
                    adsScript.setAttribute("crossorigin", "anonymous");
                    adsScript.async = true;
                    adsScript.onload = function() {
                        window.adsLoaded = true;
                    };
                    document.head.appendChild(adsScript);
                } catch (error) {
                    console.error("Errore durante l'inizializzazione di Google Ads:", error);
                }
            }
        }

        function showCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }

        function hideCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.style.display = 'none';
                document.body.style.overflow = '';
            }
        }

        function setLocalConsent(value) {
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('local_cookie_consent', value);
            }
        }

        function getLocalConsent() {
            if (typeof(Storage) !== "undefined") {
                return localStorage.getItem('local_cookie_consent');
            }
            return null;
        }

        function handleCookieConsent() {
            let consent = getCookie(COOKIE_CONFIG.consentCookieName);
            
            if (!consent && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                consent = getLocalConsent();
            }
            
            if (consent === "accepted") {
                loadGoogleAds();
                hideCookieBanner();
            } else if (consent === "rejected") {
                hideCookieBanner();
            } else {
                showCookieBanner();
            }
        }

        function acceptCookies() {
            setCookie(COOKIE_CONFIG.consentCookieName, "accepted", COOKIE_CONFIG.expirationDays, COOKIE_CONFIG.domain);
            
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setLocalConsent("accepted");
            }
            
            hideCookieBanner();
            loadGoogleAds();
            
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('cookie_consent_changed', Date.now().toString());
            }
        }

        function rejectCookies() {
            setCookie(COOKIE_CONFIG.consentCookieName, "rejected", COOKIE_CONFIG.expirationDays, COOKIE_CONFIG.domain);
            
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setLocalConsent("rejected");
            }
            
            hideCookieBanner();
            
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('cookie_consent_changed', Date.now().toString());
            }
        }

        function setupCrossTabSync() {
            if (typeof(Storage) !== "undefined") {
                window.addEventListener('storage', function(e) {
                    if (e.key === 'cookie_consent_changed') {
                        handleCookieConsent();
                    }
                });
            }
        }

        function initializeCookieConsent() {
            handleCookieConsent();
            setupCrossTabSync();
            
            const acceptButton = document.getElementById("accept-cookies");
            if (acceptButton) {
                acceptButton.addEventListener("click", acceptCookies);
            }
            
            const rejectButton = document.getElementById("reject-cookies");
            if (rejectButton) {
                rejectButton.addEventListener("click", rejectCookies);
            }
        }

        // Initialize cookie consent
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCookieConsent);
        } else {
            initializeCookieConsent();
        }

        // Theme Management System - da aggiungere prima dello script filterVerbs esistente
        const THEME_CONFIG = {
            cookieName: 'site_theme',
            expirationDays: 365,
            themes: {
                light: {
                    name: 'light',
                    icon: '🌙',
                    title: 'Attiva tema scuro'
                },
                dark: {
                    name: 'dark',
                    icon: '☀️',
                    title: 'Attiva tema chiaro'
                }
            }
        };

        // Icon mapping for theme switching
        const ICON_MAPPING = {
            light: {
                'images/home.png': 'images/home.png',
                'images/learn.png': 'images/learn.png',
                'images/train.png': 'images/train.png',
                'images/test.png': 'images/test.png',
                'images/story.png': 'images/story.png'
            },
            dark: {
                'images/home.png': 'images/home1.png',
                'images/learn.png': 'images/learn1.png',
                'images/train.png': 'images/train1.png',
                'images/test.png': 'images/test1.png',
                'images/story.png': 'images/story1.png'
            }
        };

        // Utility functions per gestire i cookie
        function setThemeCookie(name, value, days) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            
            let cookieString = `${name}=${value}${expires}; path=/`;
            document.cookie = cookieString;
            console.log(`Theme cookie impostato: ${name}=${value}`);
        }

        function getThemeCookie(name) {
            const value = "; " + document.cookie;
            const parts = value.split("; " + name + "=");
            if (parts.length === 2) {
                const cookieValue = parts.pop().split(";").shift();
                console.log(`Theme cookie letto: ${name}=${cookieValue}`);
                return cookieValue;
            }
            return null;
        }

        // Fallback per localStorage in ambiente locale
        function setLocalTheme(value) {
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('local_site_theme', value);
                console.log(`LocalStorage theme impostato: ${value}`);
            }
        }

        function getLocalTheme() {
            if (typeof(Storage) !== "undefined") {
                const value = localStorage.getItem('local_site_theme');
                console.log(`LocalStorage theme letto: ${value}`);
                return value;
            }
            return null;
        }

        // Funzione per cambiare le icone della navbar
        function updateNavIcons(theme) {
            const navIcons = document.querySelectorAll('.nav-item img');
            navIcons.forEach(icon => {
                const currentSrc = icon.src;
                const filename = currentSrc.split('/').pop();
                const basePath = currentSrc.substring(0, currentSrc.lastIndexOf('/') + 1);
                
                // Trova la mappatura corretta
                for (const [lightIcon, darkIcon] of Object.entries(ICON_MAPPING.dark)) {
                    const lightFilename = lightIcon.split('/').pop();
                    const darkFilename = darkIcon.split('/').pop();
                    
                    if (theme === 'dark' && filename === lightFilename) {
                        icon.src = basePath + darkFilename;
                        break;
                    } else if (theme === 'light' && filename === darkFilename) {
                        icon.src = basePath + lightFilename;
                        break;
                    }
                }
            });
        }

        // Funzione per applicare il tema
        function applyTheme(themeName) {
            const html = document.documentElement;
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            
            // Applica o rimuove l'attributo data-theme
            if (themeName === 'dark') {
                html.setAttribute('data-theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
                themeName = 'light';
            }
            
            // Aggiorna l'icona e il tooltip del bottone
            const currentTheme = THEME_CONFIG.themes[themeName];
            if (themeIcon && currentTheme) {
                themeIcon.textContent = currentTheme.icon;
                themeToggle.title = currentTheme.title;
            }
            
            // Aggiorna le icone della navbar
            updateNavIcons(themeName);
            
            console.log(`Tema applicato: ${themeName}`);
        }

        function getCurrentTheme() {
            // Prima fonte: attributo data-theme nel DOM
            const domTheme = document.documentElement.getAttribute('data-theme');
            if (domTheme) {
                console.log(`getCurrentTheme -> datasource: DOM, theme=${domTheme}`);
                return domTheme;
            }

            // Altrimenti prova il cookie
            let theme = getThemeCookie(THEME_CONFIG.cookieName);
            if (theme) {
                console.log(`getCurrentTheme -> datasource: cookie, theme=${theme}`);
                return theme;
            }

            // Fallback per ambiente locale: localStorage
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                const local = getLocalTheme();
                if (local) {
                    console.log(`getCurrentTheme -> datasource: localStorage, theme=${local}`);
                    return local;
                }
            }

            // Default
            console.log('getCurrentTheme -> default: light');
            return 'light';
        }

        function toggleTheme() {
            const currentTheme = getCurrentTheme();
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            console.log(`Cambio tema da ${currentTheme} a ${newTheme}`);

            // Applica subito il tema al DOM
            applyTheme(newTheme);

            // Salva la scelta
            saveTheme(newTheme);
        }

        // Funzione per salvare il tema
        function saveTheme(theme) {
            setThemeCookie(THEME_CONFIG.cookieName, theme, THEME_CONFIG.expirationDays);
            
            // Fallback per localhost
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                setLocalTheme(theme);
            }
            
            // Notifica altre schede del cambiamento
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('theme_changed', Date.now().toString());
            }
        }

        // Funzione per sincronizzare tra schede
        function setupThemeCrossTabSync() {
            if (typeof(Storage) !== "undefined") {
                window.addEventListener('storage', function(e) {
                    if (e.key === 'theme_changed') {
                        console.log("Tema cambiato in altra scheda - aggiorno");
                        const currentTheme = getCurrentTheme();
                        applyTheme(currentTheme);
                    }
                });
            }
        }

        // Funzione di inizializzazione del sistema tema
        function initializeThemeSystem() {
            console.log("Inizializzazione sistema tema");
            
            // Applica il tema salvato
            const savedTheme = getCurrentTheme();
            console.log("Tema salvato trovato:", savedTheme);
            applyTheme(savedTheme);
            
            // Configura il toggle button
            setTimeout(() => {
                const themeToggle = document.getElementById('theme-toggle');
                const themeIcon = document.getElementById('theme-icon');
                
                console.log("Cercando elementi tema...");
                console.log("Theme toggle trovato:", !!themeToggle);
                console.log("Theme icon trovato:", !!themeIcon);
                
                if (themeToggle) {
                    // Rimuovi eventuali listener esistenti
                    themeToggle.removeEventListener('click', toggleTheme);
                    
                    // Aggiungi il nuovo listener
                    themeToggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log("Click sul toggle tema!");
                        toggleTheme();
                    });
                    
                    console.log("Event listener tema configurato correttamente");
                } else {
                    console.error("Elemento theme-toggle non trovato!");
                }
            }, 100);
            
            // Configura sincronizzazione tra schede
            setupThemeCrossTabSync();
            
            console.log("Sistema tema inizializzato con tema:", savedTheme);
        }

        // Rendi disponibili le funzioni debug globalmente
        window.getCurrentTheme = getCurrentTheme;
        window.toggleTheme = toggleTheme;

        // Inizializza il sistema tema quando il DOM è pronto
        document.addEventListener('DOMContentLoaded', function() {
            console.log("DOM loaded - inizializzo sistema tema");
            initializeThemeSystem();
        });
        
        // Fallback se il DOM è già caricato
        if (document.readyState !== 'loading') {
            console.log("DOM già caricato - inizializzo sistema tema");
            initializeThemeSystem();
        }