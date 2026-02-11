(async function() {
    const { truesight_enabled: enabled } = await chrome.storage.sync.get('truesight_enabled');
    if (!enabled) return;

    console.log('TrueSight UI: Enabled, injecting styles & modules...');

    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = chrome.runtime.getURL('content/styles.css');
    (document.head || document.documentElement).appendChild(styleLink);

    try {
        await import(chrome.runtime.getURL('content/TrueSightUI-SitebarSync.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-QuickLinks.js'));
        await import(chrome.runtime.getURL('content/TrueSightUI-PassiveSenses.js'));
        console.log('TrueSight UI: All modules loaded');
    } catch(e) {
        console.error('Module loading failed:', e);
    }
})();
