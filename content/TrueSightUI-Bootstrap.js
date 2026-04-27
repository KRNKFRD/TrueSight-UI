(async function () {

    if (window.location.href.includes('abovevtt=true')) {
        console.log('TrueSight UI: AboveVTT detected. Shutting down to prevent conflicts.');
        return;
    }

    let settings = await chrome.storage.sync.get({
        truesight_enabled: true,
        opt_cursor: false,
        opt_filters: true,
        opt_concentration: true,
        opt_party: false 
    });

    if (!settings.truesight_enabled) return;

    function updatePartyMode(isActive) {
        if (isActive) {
            document.documentElement.classList.add('party-time-enabled');
        } else {
            document.documentElement.classList.remove('party-time-enabled');
        }
    }

    updatePartyMode(settings.opt_party);


    function injectCSS(id, fileName) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL(`content/${fileName}`);
        link.disabled = true;
        (document.head || document.documentElement).appendChild(link);
        return link;
    }

    const mainStyle = injectCSS('truesight-styles', 'styles.css');
    const naviStyle = injectCSS('truesight-navi', 'tsui-navi.css');
    const cursorStyle = injectCSS('TrueSightUI-cursor', 'tsui-cursor.css');
    const filterStyle = injectCSS('TrueSightUI-filters', 'tsui-filters.css');
    const concentrationStyle = injectCSS('TrueSightUI-concentration', 'tsui-concentration.css');

    function applyStyles() {
        const isSheet = document.body.classList.contains('body-rpgcharacter-sheet');
        const isAboveVTT = window.location.href.includes('abovevtt=true');
        const shouldBeActive = isSheet && !isAboveVTT;

        mainStyle.disabled = !shouldBeActive;
        naviStyle.disabled = !shouldBeActive;
        cursorStyle.disabled = !(isSheet && settings.opt_cursor);
        filterStyle.disabled = !(isSheet && settings.opt_filters);
        concentrationStyle.disabled = !(isSheet && settings.opt_concentration);
    }

    applyStyles();

    const observer = new MutationObserver(applyStyles);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    chrome.runtime.onMessage.addListener(async (request) => {
        if (request.action === "update_live_css") {
            settings = await chrome.storage.sync.get({
                opt_cursor: false,
                opt_filters: true,
                opt_concentration: true,
                opt_party: false 
            });

            applyStyles();
            updatePartyMode(settings.opt_party);

            console.log('TrueSight UI: Live CSS & Party Mode updated');
        }
    });

    try {
        await import(chrome.runtime.getURL('content/TrueSightUI-SitebarSync.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-QuickLinks.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-PassiveSenses.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-GameLogScroll.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-Concentration.js'));
        console.log('TrueSight UI: Modules loaded successfully');
    } catch (e) {
        console.error('TrueSight UI: Module loading failed:', e);
    }
})();
