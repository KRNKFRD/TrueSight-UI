(function () {
    'use strict';

    const MAPPING = {
        "Perception": "Passive Perception",
        "Investigation": "Passive Investigation",
        "Insight": "Passive Insight"
    };

    const STYLE = {
        color: '#a2acb2',
        fontSize: '14px',
        marginLeft: '5px'
    };

    function updatePassives() {
        const sensesContainer = document.querySelector('.ct-senses-box') || document.querySelector('.ct-senses');
        if (!sensesContainer) return;

        const passiveValues = {};


        const labels = sensesContainer.querySelectorAll('[class*="calloutLabel"], [class*="CalloutLabel"]');
        
        labels.forEach(labelEl => {
            const label = labelEl.textContent?.trim();
            const valueEl = labelEl.parentElement.querySelector('[class*="calloutValue"], [class*="CalloutValue"]');
            
            if (label && valueEl) {
                passiveValues[label] = valueEl.textContent?.trim();
            }
        });

        const skillRows = document.querySelectorAll('.ct-skills__item');

        skillRows.forEach(row => {
            const nameEl = row.querySelector('.ct-skills__col--skill');
            if (!nameEl) return;

            const skillName = nameEl.textContent.split('(')[0].trim();

            const targetKey = MAPPING[skillName];
            if (!targetKey || !passiveValues[targetKey]) return;

            const newValue = `(${passiveValues[targetKey]})`;

            let mySpan = nameEl.querySelector('.userscript-passive-val');

            if (!mySpan) {
                mySpan = document.createElement('span');
                mySpan.className = 'userscript-passive-val';
                Object.assign(mySpan.style, STYLE);
                nameEl.appendChild(mySpan);
            }

            if (mySpan.textContent !== newValue) {
                mySpan.textContent = newValue;
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        updatePassives();
    });

    const waitForSheet = setInterval(() => {
        const sheet = document.querySelector('.ct-character-sheet');
        if (sheet) {
            clearInterval(waitForSheet);
            observer.observe(sheet, {
                childList: true,
                subtree: true,
                characterData: true
            });
            updatePassives();
        }
    }, 500);

})();
