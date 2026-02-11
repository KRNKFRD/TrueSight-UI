(function () {
    'use strict';

    const BOX_ID = 'ddb-custom-links';
    const MODAL_ID = 'ddb-links-editor-modal';

    const DEFAULT_LINKS = [
        { label: 'Conditions', url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions' },
        { label: 'Spellcasting', url: 'https://www.dndbeyond.com/sources/basic-rules/spellcasting' },
        { label: 'It\'s dangerous to go alone', url: 'https://www.dndbeyond.com/magic-items/5397-vorpal-sword' },
        { label: 'Click here for a free Magic Item', url: 'https://youtu.be/dQw4w9WgXcQ' },
    ];

    function getCharId() {
        const match = window.location.pathname.match(/\/characters\/(\d+)/);
        return match ? match[1] : null;
    }

    function getLinks() {
        const charId = getCharId();
        if (!charId) return DEFAULT_LINKS;

        const storageKey = `ddb_links_${charId}`;
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : DEFAULT_LINKS;
        } catch (e) { return DEFAULT_LINKS; }
    }

    function saveLinks(links) {
        const charId = getCharId();
        if (!charId) {
            alert("Fehler: Keine Character ID in der URL gefunden!");
            return;
        }

        const storageKey = `ddb_links_${charId}`;
        localStorage.setItem(storageKey, JSON.stringify(links));

        const box = document.getElementById(BOX_ID);
        if (box) box.remove();
    }

    function linksToText(links) {
        return links.map(l => `${l.label} | ${l.url}`).join('\n');
    }

    function textToLinks(text) {
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && line.includes('|'))
            .map(line => {
                const [label, url] = line.split('|').map(s => s.trim());
                return { label, url };
            });
    }

    function openEditor() {
        if (document.getElementById(MODAL_ID)) return;

        const currentLinks = getLinks();
        const textContent = linksToText(currentLinks);
        const charId = getCharId();

        const modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.className = 'ddb-modal-overlay';

        modal.innerHTML = `
            <div class="ddb-modal-content">
                <div class="ddb-modal-header">Edit Links</div>
                <div class="ddb-modal-desc">Links are saved <b>only for this character</b>.</div>
                <div class="ddb-modal-desc">Format: <code>Label | URL</code></div>

                <textarea class="ddb-modal-textarea">${textContent}</textarea>

                <div class="ddb-modal-actions">
                    <button id="${MODAL_ID}_cancel" class="ddb-modal-btn cancel">Cancel</button>
                    <button id="${MODAL_ID}_save" class="ddb-modal-btn save">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById(`${MODAL_ID}_cancel`).onclick = () => modal.remove();
        document.getElementById(`${MODAL_ID}_save`).onclick = () => {
            const val = modal.querySelector('textarea').value;
            const newLinks = textToLinks(val);
            if (newLinks.length > 0) {
                saveLinks(newLinks);
                modal.remove();
            } else {
                alert("Please add at least one valid link.");
            }
        };
    }

    function renderBox() {
        if (!window.location.href.includes('/characters/')) return;

        const charId = getCharId();
        const existingBox = document.getElementById(BOX_ID);

        if (existingBox) {
            if (existingBox.getAttribute('data-char-id') !== charId) {
                existingBox.remove();
            } else {
                return;
            }
        }

        const parent = document.querySelector('.ct-subsections');
        if (!parent) return;

        const links = getLinks();
        const box = document.createElement('div');
        box.id = BOX_ID;
        box.className = 'ct-subsection ct-subsection--custom-links';
        box.setAttribute('data-char-id', charId);

        let html = `<div class="ddb-link-scroll-container">`;
        html += `<div class="ddb-custom-link-grid">`;
        links.forEach(l => {
            html += `<a href="${l.url}" target="_blank" class="ddb-custom-link-pill">${l.label}</a>`;
        });
        html += `</div></div>`;

        html += `
            <div class="ddb-link-edit-btn" title="Edit Links">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
            </div>
        `;

        box.innerHTML = html;
        parent.appendChild(box);

        box.querySelector('.ddb-link-edit-btn').addEventListener('click', openEditor);
    }

    setInterval(renderBox, 1000);
})();