(function () {
    'use strict';

    const GAMELOG_TRIGGER = '.ct-sidebar__inner [class*="GameLogEntries"]'; 
    let hasScrolledThisOpen = false;

    const forceScrollToBottom = (entryContainer) => {
        let scrollTarget = entryContainer;
        for (let i = 0; i < 5; i++) {
            if (scrollTarget.scrollHeight > scrollTarget.clientHeight) {
                scrollTarget.scrollTop = scrollTarget.scrollHeight;
                return;
            }
            scrollTarget = scrollTarget.parentElement;
            if (!scrollTarget) return;
        }
    };

    const observer = new MutationObserver((mutations) => {
        const logEntries = document.querySelector(GAMELOG_TRIGGER);

        if (logEntries) {
            if (!hasScrolledThisOpen) {
                hasScrolledThisOpen = true;
                
                const buggyWrapper = document.querySelector('.ct-sidebar__inner [class*="styles_content"] > div:first-of-type');
                if (buggyWrapper) {
                    buggyWrapper.style.height = '100%';
                }

                setTimeout(() => {
                    forceScrollToBottom(logEntries);
                    console.log('TrueSight UI: GameLog forcefully scrolled to bottom');
                }, 100);
                
                setTimeout(() => {
                    forceScrollToBottom(logEntries);
                }, 500);
            }
        } else {
            hasScrolledThisOpen = false;
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('TrueSight UI: GameLog Auto-Scroll observer started');
})();
