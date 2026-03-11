(function () {
    'use strict';

    let initInterval = null;
    let resizeObserver = null;

    function removeConcentrationTracker() {
        if (initInterval) clearInterval(initInterval);
        
        const existingRing = document.querySelector('.tsui-concentration-ring');
        if (existingRing) existingRing.remove();
        
        const existingBtn = document.querySelector('.tsui-concentration-btn');
        if (existingBtn) existingBtn.remove();
        
        const portraitContainer = document.querySelector('.ct-character-tidbits__portrait') || document.querySelector('.ddbc-character-avatar');
        if (portraitContainer) portraitContainer.classList.remove('tsui-concentrating');

        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
    }

    function initConcentrationTracker() {

        if (document.querySelector('.tsui-concentration-ring')) return;

        if (initInterval) clearInterval(initInterval);

        initInterval = setInterval(() => {
            const portraitContainer = document.querySelector('.ct-character-tidbits__portrait') || document.querySelector('.ddbc-character-avatar');
            if (!portraitContainer) return;

            if (portraitContainer.querySelector('.tsui-concentration-ring')) {
                clearInterval(initInterval);
                return;
            }

            clearInterval(initInterval);
            portraitContainer.style.position = 'relative';

            const svgHTML = `
                <svg class="tsui-concentration-ring" viewBox="0 0 100 100">
                    <defs>
                        <path id="tsui-circlePath" d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
                    </defs>
                    <circle class="tsui-ring-background" cx="50" cy="50" r="42" />
                    <text>
                        <textPath href="#tsui-circlePath" startOffset="0%">
                            CONCENTRATION • CONCENTRATION • CONCENTRATION • 
                        </textPath>
                    </text>
                </svg>
            `;
            portraitContainer.insertAdjacentHTML('beforeend', svgHTML);

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'tsui-concentration-btn';
            toggleBtn.title = 'Toggle Concentration';
            toggleBtn.innerHTML = '<span>C</span>';
            portraitContainer.appendChild(toggleBtn);

            const charId = window.location.pathname.split('/').pop();
            const storageKey = `tsui_concentration_${charId}`;

            const isConcentrating = localStorage.getItem(storageKey) === 'true';
            if (isConcentrating) {
                portraitContainer.classList.add('tsui-concentrating');
            }

            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const currentlyActive = portraitContainer.classList.contains('tsui-concentrating');
                
                if (currentlyActive) {
                    portraitContainer.classList.remove('tsui-concentrating');
                    localStorage.setItem(storageKey, 'false');
                } else {
                    portraitContainer.classList.add('tsui-concentrating');
                    localStorage.setItem(storageKey, 'true');
                }
            });

        }, 500);
    }

    function setupResizeObserver() {
        if (resizeObserver) return;

        resizeObserver = new ResizeObserver(() => {
            const portrait = document.querySelector('.ct-character-tidbits__portrait') || document.querySelector('.ddbc-character-avatar');
            const tracker = document.querySelector('.tsui-concentration-ring');
            
            if (portrait && !tracker) {
                initConcentrationTracker();
            }
        });

        resizeObserver.observe(document.body);
    }

    chrome.storage.sync.get(['truesight_enabled', 'opt_concentration'], (result) => {
        const isMainEnabled = result.truesight_enabled !== false;
        const isConcentrationEnabled = result.opt_concentration !== false;

        if (isMainEnabled && isConcentrationEnabled) {
            initConcentrationTracker();
            setupResizeObserver();
        }
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
            chrome.storage.sync.get(['truesight_enabled', 'opt_concentration'], (result) => {
                const isMainEnabled = result.truesight_enabled !== false;
                const isConcentrationEnabled = result.opt_concentration !== false;

                if (isMainEnabled && isConcentrationEnabled) {
                    initConcentrationTracker();
                    setupResizeObserver();
                } else {
                    removeConcentrationTracker();
                }
            });
        }
    });

})();
