const TOGGLE_KEY = 'truesight_enabled';

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const toggleLabel = document.getElementById('toggle-label');
  const optionsBtn = document.getElementById('options-btn');
  const optionsPanel = document.getElementById('options-panel');
  const versionLabel = document.getElementById('version-label');
  const supportLink = document.getElementById('support-link');

  const optCursor = document.getElementById('opt-cursor');
  const optFilters = document.getElementById('opt-filters');

  if (chrome.runtime.getManifest) {
    versionLabel.textContent = 'v' + chrome.runtime.getManifest().version;
  }

  if (supportLink) supportLink.href = 'https://ko-fi.com/krnkfrd';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || '';
  const isDDB = url.includes('www.dndbeyond.com');
  const isAboveVTT = url.includes('abovevtt=true');
  const isCharacterSheet = /https:\/\/www\.dndbeyond\.com\/characters\/\d+/.test(url) && !isAboveVTT;

  // Default Status
  const stored = await chrome.storage.sync.get({
    [TOGGLE_KEY]: true,
    opt_cursor: false,
    opt_filters: true
  });

  const enabled = stored[TOGGLE_KEY];
  setToggleState(toggleBtn, toggleLabel, enabled);

  if (optCursor) optCursor.checked = stored.opt_cursor;
  if (optFilters) optFilters.checked = stored.opt_filters;

  // Activate TrueSight UI
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async () => {
      const newEnabled = !toggleBtn.classList.contains('on');
      await chrome.storage.sync.set({ [TOGGLE_KEY]: newEnabled });
      setToggleState(toggleBtn, toggleLabel, newEnabled);

      if (isCharacterSheet) {
        await chrome.tabs.reload(tab.id);
      }
    });
  }

  // Show Options
  if (optionsBtn && optionsPanel) {
    optionsBtn.addEventListener('click', () => {
      optionsPanel.classList.toggle('hidden');
    });
  }

  // Option: Cursor
  if (optCursor) {
    optCursor.addEventListener('change', async (e) => {
      await chrome.storage.sync.set({ opt_cursor: e.target.checked });
      if (isDDB && isCharacterSheet) {
        chrome.tabs.sendMessage(tab.id, { action: "update_live_css" }).catch(() => { });
      }
    });
  }

  //  Option: Filter
  if (optFilters) {
    optFilters.addEventListener('change', async (e) => {
      await chrome.storage.sync.set({ opt_filters: e.target.checked });
      if (isDDB && isCharacterSheet) {
        chrome.tabs.sendMessage(tab.id, { action: "update_live_css" }).catch(() => { });
      }
    });
  }
});

// Button-Status
function setToggleState(btn, labelEl, enabled) {
  if (!btn || !labelEl) return;
  if (enabled) {
    btn.classList.add('on');
    btn.classList.remove('off');
    labelEl.textContent = 'TrueSight UI is enabled';
  } else {
    btn.classList.add('off');
    btn.classList.remove('on');
    labelEl.textContent = 'Enable TrueSight UI';
  }
}
