function updateIcon(enabled) {
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

chrome.storage.sync.get(['truesight_enabled'], (result) => {
  if (result.truesight_enabled !== undefined) {
    updateIcon(result.truesight_enabled);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ truesight_enabled: false });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.truesight_enabled) {
    updateIcon(changes.truesight_enabled.newValue);
  }
});
