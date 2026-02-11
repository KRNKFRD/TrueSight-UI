(function () {
    'use strict';

    const TARGET_SHEET = '.ct-character-sheet__inner';
    const MY_SIDEBAR = '.site-bar';

    function initSync() {
        const sheetInner = document.querySelector(TARGET_SHEET);
        const mySidebar = document.querySelector(MY_SIDEBAR);

        if (!sheetInner || !mySidebar) return;

        const getTranslateX = (transformString) => {
            if (!transformString) return 0;
            const match = transformString.match(/translateX\s*\(\s*(-?\d+(\.\d+)?)px\s*\)/);
            return match ? parseFloat(match[1]) : 0;
        };

        const syncPosition = () => {
            const currentTransform = sheetInner.style.transform;
            const xValue = getTranslateX(currentTransform);

            mySidebar.style.marginLeft = `${xValue}px`;

            if (sheetInner.style.transition) {

                mySidebar.style.transition = sheetInner.style.transition.replace('transform', 'margin-left');

                if (!mySidebar.style.transition) {
                    mySidebar.style.transition = 'margin-left 0.3s ease';
                }
            }
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
    }

    const waitForLoad = setInterval(() => {
        if (document.querySelector(TARGET_SHEET)) {
            clearInterval(waitForLoad);
            setTimeout(initSync, 500);
        }
    }, 500);

})();