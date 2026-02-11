const TOGGLE_KEY = 'truesight_enabled';

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const toggleLabel = document.getElementById('toggle-label');
  const infoBtn = document.getElementById('info-btn');
  const infoPanel = document.getElementById('info-panel');
  const versionLabel = document.getElementById('version-label');
  const supportLink = document.getElementById('support-link');

  if (chrome.runtime.getManifest) {
    versionLabel.textContent = 'v' + chrome.runtime.getManifest().version;
  }

  supportLink.href = 'https://ko-fi.com/krnkfrd';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || '';
  const isCharacterSheet = /https:\/\/www\.dndbeyond\.com\/characters\/\d+/.test(url);

  const { [TOGGLE_KEY]: enabled = false } = await chrome.storage.sync.get(TOGGLE_KEY);
  setToggleState(toggleBtn, toggleLabel, enabled);

  toggleBtn.addEventListener('click', async () => {
    const newEnabled = !toggleBtn.classList.contains('on');
    await chrome.storage.sync.set({ [TOGGLE_KEY]: newEnabled });
    setToggleState(toggleBtn, toggleLabel, newEnabled);

    if (isCharacterSheet) {
      await chrome.tabs.reload(tab.id);
    }
  });

  infoBtn.addEventListener('click', () => {
    infoPanel.classList.toggle('hidden');
  });
});

function setToggleState(btn, labelEl, enabled) {
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