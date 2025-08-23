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