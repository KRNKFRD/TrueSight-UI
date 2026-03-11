(function () {
    'use strict';

    const TARGET_SHEET = '.ct-character-sheet__inner';
    
    const SYNC_ELEMENTS = [
        '[class*="wrappericpeg"]',
        '[class*="menuContainer"]',
        '[class*="searchContainer"]'
    ];

    let currentSheetInner = null;
    let currentObserver = null;

    function initSync(sheetInner) {
        const getTranslateX = (transformString) => {
            if (!transformString) return 0;
            const match = transformString.match(/translateX\s*\(\s*(-?\d+(\.\d+)?)px\s*\)/);
            return match ? parseFloat(match[1]) : 0;
        };

        const syncPosition = () => {
            const currentTransform = sheetInner.style.transform;
            const xValue = getTranslateX(currentTransform);

            SYNC_ELEMENTS.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.marginLeft = `${xValue}px`;

                    if (sheetInner.style.transition) {
                        el.style.transition = sheetInner.style.transition.replace('transform', 'margin-left');
                        if (!el.style.transition) {
                            el.style.transition = 'margin-left 1s ease!important';
                        }
                    }
                });
            });

            document.body.style.setProperty('--tsui-nav-offset', `${xValue}px`);
        };

        syncPosition();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    syncPosition();
                }
            });
        });

        observer.observe(sheetInner, {
            attributes: true,
            attributeFilter: ['style']
        });

        return observer;
    }

    setInterval(() => {
        const sheetInner = document.querySelector(TARGET_SHEET);

        if (!sheetInner) {
            currentSheetInner = null; 
            
            if (currentObserver) {
                currentObserver.disconnect(); 
                currentObserver = null;
            }

            SYNC_ELEMENTS.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.marginLeft = '';
                    el.style.transition = '';
                });
            });
            document.body.style.removeProperty('--tsui-nav-offset');

            return;
        }

        if (sheetInner !== currentSheetInner) {
            if (currentObserver) {
                currentObserver.disconnect();
            }
            currentSheetInner = sheetInner;
            currentObserver = initSync(sheetInner);
        }
    }, 500);

})();
