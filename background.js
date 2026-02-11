chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ truesight_enabled: false });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.truesight_enabled) {
    const enabled = changes.truesight_enabled.newValue;
    const iconSet = enabled ? 'TrueSightUI-icon-ON' : 'TrueSightUI-icon-OFF';
    
    chrome.action.setIcon({
      path: {
        "16": `icons/${iconSet}-16.png`,
        "32": `icons/${iconSet}-32.png`, 
        "48": `icons/${iconSet}-48.png`,
        "128": `icons/${iconSet}-128.png`
      }
    });
  }
});
