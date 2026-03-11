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
  const optConcentration = document.getElementById('opt-concentration');

  const partyWizard = document.getElementById('party-wizard');

  if (chrome.runtime.getManifest) {
    versionLabel.textContent = 'v' + chrome.runtime.getManifest().version;
  }

  if (supportLink) supportLink.href = 'https://ko-fi.com/krnkfrd';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }).catch(() => []);
  const url = tab?.url || '';
  const isDDB = url.includes('www.dndbeyond.com');
  const isAboveVTT = url.includes('abovevtt=true');
  const isCharacterSheet = /https:\/\/www\.dndbeyond\.com\/characters\/\d+/.test(url) && !isAboveVTT;

  const stored = await chrome.storage.sync.get({
    [TOGGLE_KEY]: true,
    opt_cursor: false,
    opt_filters: true,
    opt_concentration: true,
    opt_party: false
  });

  const enabled = stored[TOGGLE_KEY];
  setToggleState(toggleBtn, toggleLabel, enabled);

  if (optCursor) optCursor.checked = stored.opt_cursor;
  if (optFilters) optFilters.checked = stored.opt_filters;
  if (optConcentration) optConcentration.checked = stored.opt_concentration;

  // Activate TrueSight UI
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async () => {
      const newEnabled = !toggleBtn.classList.contains('on');
      await chrome.storage.sync.set({ [TOGGLE_KEY]: newEnabled });
      setToggleState(toggleBtn, toggleLabel, newEnabled);

      if (isCharacterSheet && tab?.id) {
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
      if (isDDB && isCharacterSheet && tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: "update_live_css" }).catch(() => { });
      }
    });
  }

  // Option: Filter
  if (optFilters) {
    optFilters.addEventListener('change', async (e) => {
      await chrome.storage.sync.set({ opt_filters: e.target.checked });
      if (isDDB && isCharacterSheet && tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: "update_live_css" }).catch(() => { });
      }
    });
  }

  // Option: Concentration
  if (optConcentration) {
    optConcentration.addEventListener('change', async (e) => {
      await chrome.storage.sync.set({ opt_concentration: e.target.checked });
      if (isDDB && isCharacterSheet && tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: "update_live_css" }).catch(() => { });
      }
    });
  }

  if (partyWizard) {
    if (stored.opt_party) {
      partyWizard.src = 'icons/partywizard.gif';
      partyWizard.classList.add('active');
    } else {
      partyWizard.src = 'icons/wizard.png';
      partyWizard.classList.remove('active');
    }
  }

  // Option: Party Wizard
  if (partyWizard) {
    partyWizard.addEventListener('click', async () => {

      const currentStored = await chrome.storage.sync.get({ opt_party: false });
      const newState = !currentStored.opt_party;

      await chrome.storage.sync.set({ opt_party: newState });

      if (newState) {
        partyWizard.src = 'icons/partywizard.gif';
        partyWizard.classList.add('active');
      } else {
        partyWizard.src = 'icons/wizard.png';
        partyWizard.classList.remove('active');
      }

      if (isDDB && isCharacterSheet && tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: "update_live_css" }).catch(e => console.log(e));
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
