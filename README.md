# TrueSight-UI

TrueSight UI is a modern approach to D&D Beyond character sheets.

It acts as a lightweight visual overhaul that redesigns, reorganizes, and resizes the interface to help you find information faster during sessions. I built this because I wanted my own character sheet to feel modern and calm, based on years of playing on D&D Beyond.

// What it actually does:
- Cleaner Layout: It reorganizes and resizes almost everything. Less scrolling, less visual noise.
- Quick Links: I added a custom box where you can save character-specific bookmarks (like rules or VTTs) directly on the sheet.
- Passive Senses: Moved them right into the skills list where they belong, to open up even more space.
- Beyond 20 Support: I use Beyond 20 myself, so I tweaked its design to match my theme.
- AboveVTT: You can use TrueSight UI and AboveVTT simultaneously – the button is displayed in the top navigation bar, just like the Beyond20 button shown in the screenshots.
- Customization Options: You can turn some features on or off in the extension's popup.
- Smart GameLog Scrolling: Opening the GameLog will automatically scroll down to your most recent roll, instead of forcing you to scroll down from the top every time.
- Privacy: It runs 100% locally. No tracking, no data collection. Even your Quick Links are saved only in your browser.
- Handcrafted: This isn't some AI-generated "vibe coding" project. Every margin, font size, and contrast tweak was intentionally hand-coded by myself to fix specific UI-frustrations I had.

// What's new in Version 1.1.1
- Fixed Navigation: Repaired the broken top navigation caused by recent DDB updates.
- Permanent Search Bar: The search bar is always visible again (no more popout-shenanigans).
- Concentration-Tracker: Click the new "C" button next to your portrait to toggle a visual, persistent Concentration-Ring. (Can be disabled in the popup).
- Return of the Party Wizard: Check the extension popup for a highly important, totally unnecessary party mode.

// How it works:
Most of the magic is created by ~2,000 lines of handwritten CSS, and only where styles alone are not enough does TrueSight UI use JavaScript to achieve its goal (like syncing the sidebar, moving passive senses, Concentration-Tracker and Quick-Links-Box).

// How to use:
1. Install the extension and navigate to your D&D Beyond character sheet.
2. Set sheet appearance to [Underdark Mode].
3. Use the extension popup to toggle the visual enhancements on or off at any time.
4. ...
5. Profit.

// Free, Open Source & Community Driven:
TrueSight UI is completely free and open source (GNU GPL v3.0: spdx.org/licenses/GPL-3.0-only)

This is actually my very first software project ever. I'm not a pro developer, just a D&D fan who wanted to solve a problem. Because of that, the extension is intentionally lightweight and focused on CSS to keep things simple and manageable for me. Since I have little experience, I’m learning as I go. If you find any bugs or have ideas, I'm happy to keep improving it :)

// A quick note on D&D Beyond updates:
Since TrueSight UI is built on top of the current D&D Beyond website, future updates by WotC might occasionally break parts of the design. I can't predict when this happens, but I use this extension myself every week. So when something breaks, I'll notice it – and I'll do my best to fix it as quickly as possible. Please bear with me if a fix takes a few days, depending on how big the changes are.

// Privacy & Safety:
TrueSight UI runs entirely locally in your browser. Even your custom Quick Links are saved directly on your device and are never sent to a cloud or external server. The extension does not collect, store, or transmit any user data.

// Disclaimer:
TrueSight UI is an unofficial fan project and is not affiliated with, endorsed, or sponsored by D&D Beyond or Wizards of the Coast.
