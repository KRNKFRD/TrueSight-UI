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

        const sensesContainer = document.querySelector('.ct-senses');
        if (!sensesContainer) return;

        const passiveValues = {};
        sensesContainer.querySelectorAll('.ct-senses__callout').forEach(el => {
            const label = el.querySelector('.ct-senses__callout-label')?.innerText;
            const value = el.querySelector('.ct-senses__callout-value')?.innerText;
            if (label && value) {
                passiveValues[label.trim()] = value.trim();
            }
        });

        const skillRows = document.querySelectorAll('.ct-skills__item');

        skillRows.forEach(row => {
            const nameEl = row.querySelector('.ct-skills__col--skill');
            if (!nameEl) return;

            const skillName = nameEl.innerText.split('(')[0].trim();

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

            if (mySpan.innerText !== newValue) {
                mySpan.innerText = newValue;
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