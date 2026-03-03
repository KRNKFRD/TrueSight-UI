(async function() {

    if (window.location.href.includes('abovevtt=true')) {
        console.log('TrueSight UI: AboveVTT detected. Shutting down to prevent conflicts.');
        return;
    }

    let settings = await chrome.storage.sync.get({
        truesight_enabled: true,
        opt_cursor: false,
        opt_filters: true
    });

    if (!settings.truesight_enabled) return;

    console.log('TrueSight UI: Enabled, setting up SPA observer...');

    function injectCSS(id, fileName) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL(`content/${fileName}`);
        link.disabled = true;
        (document.head || document.documentElement).appendChild(link);
        return link;
    }

    const mainStyle   = injectCSS('truesight-styles',  'styles.css');
    const cursorStyle = injectCSS('TrueSightUI-cursor',  'tsui-cursor.css');
    const filterStyle = injectCSS('TrueSightUI-filters', 'tsui-filters.css');

    function applyStyles() {
        const isSheet = document.body.classList.contains('body-rpgcharacter-sheet');
        const isAboveVTT = window.location.href.includes('abovevtt=true');
        const shouldBeActive = isSheet && !isAboveVTT;

        mainStyle.disabled = !shouldBeActive;
        cursorStyle.disabled  = !(isSheet && settings.opt_cursor);
        filterStyle.disabled  = !(isSheet && settings.opt_filters);
    }

    applyStyles();

    const observer = new MutationObserver(applyStyles);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    chrome.runtime.onMessage.addListener(async (request) => {
        if (request.action === "update_live_css") {
            settings = await chrome.storage.sync.get({
                opt_cursor: false,
                opt_filters: true
            });
            applyStyles();
            console.log('TrueSight UI: Live CSS updated');
        }
    });

    try {
        await import(chrome.runtime.getURL('content/TrueSightUI-SitebarSync.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-QuickLinks.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-PassiveSenses.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-GameLogScroll.js'));
        console.log('TrueSight UI: Modules loaded');
    } catch(e) {
        console.error('TrueSight UI: Module loading failed:', e);
    }
})();
