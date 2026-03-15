/**
 * background.js
 * Handles omnibox events and routes queries to the correct engine.
 */

const DEFAULT_ENGINE  = "google";
const DEFAULT_KEYWORD = "@s";

async function getSettings() {
  return browser.storage.sync.get({
    defaultEngine:  DEFAULT_ENGINE,
    keyword:        DEFAULT_KEYWORD,
    enabledEngines: ENGINES.map(e => e.id)
  });
}

// ─── Default suggestion ──────────────────────────────────────────────────────

browser.omnibox.setDefaultSuggestion({
  description: "QuickSearch  —  :gpt :gem :cld :ppl  |  !ddg !goo !eco !stp …  |  or just type for default engine"
});

// ─── Suggestions while typing ─────────────────────────────────────────────────

browser.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const settings = await getSettings();
  const { engineId: matchedId, query } = parseInput(text);

  if (!query || query.length < 2) return;

  const suggestions = [];

  if (matchedId) {
    // Specific engine matched — show only that one
    const engine = ENGINES.find(e => e.id === matchedId);
    if (engine) {
      suggestions.push({
        content: text,
        description: `[${engine.prefix}]  ${escXml(query)}  →  ${engine.name}`
      });
    }
  } else {
    // No prefix — show default engine + a few quick-access hints
    const def = ENGINES.find(e => e.id === settings.defaultEngine);
    if (def) {
      suggestions.push({
        content: text,
        description: `${escXml(query)}  →  ${def.name} (default)`
      });
    }

    // Show 3 quick shortcut hints
    const hints = ENGINES
      .filter(e => settings.enabledEngines.includes(e.id) && e.id !== settings.defaultEngine)
      .slice(0, 3);

    for (const e of hints) {
      suggestions.push({
        content: `${e.prefix} ${text}`,
        description: `[${e.prefix}]  ${escXml(query)}  →  ${e.name}`
      });
    }
  }

  if (suggestions.length) suggest(suggestions);
});

// ─── Enter pressed ────────────────────────────────────────────────────────────

browser.omnibox.onInputEntered.addListener(async (text, disposition) => {
  const settings = await getSettings();
  const { engineId, query } = parseInput(text);

  if (!query) return;

  const resolvedId = engineId || settings.defaultEngine;
  const url = buildUrl(resolvedId, query);
  if (!url) return;

  switch (disposition) {
    case "currentTab":        browser.tabs.update({ url });                  break;
    case "newForegroundTab":  browser.tabs.create({ url });                  break;
    case "newBackgroundTab":  browser.tabs.create({ url, active: false });   break;
    default:                  browser.tabs.update({ url });
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Listen to messages from popup
browser.runtime.onMessage.addListener(msg => {
  if (msg.type === "settingsUpdated") {
    browser.omnibox.setDefaultSuggestion({
      description: "QuickSearch  —  :gpt :gem :cld :ppl  |  !ddg !goo !eco !stp …  |  or just type for default engine"
    });
  }
});
