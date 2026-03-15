/**
 * engines.js
 * All supported search engines and AI models.
 * AI models  → prefix with ":"  e.g.  :gpt question
 * Search engines → prefix with "!"  e.g.  !ddg question
 */

const ENGINES = [
  // ── AI Models (activated with :prefix) ──────────────────────
  {
    id: "chatgpt",
    name: "ChatGPT",
    prefix: ":gpt",
    url: "https://chatgpt.com/?q={query}",
    emoji: "✦",
    color: "#10a37f",
    category: "ai"
  },
  {
    id: "gemini",
    name: "Gemini",
    prefix: ":gem",
    url: "https://gemini.google.com/app?q={query}",
    emoji: "◈",
    color: "#4285f4",
    category: "ai"
  },
  {
    id: "claude",
    name: "Claude",
    prefix: ":cld",
    url: "https://claude.ai/new?q={query}",
    emoji: "◉",
    color: "#c47f5e",
    category: "ai"
  },
  {
    id: "perplexity",
    name: "Perplexity",
    prefix: ":ppl",
    url: "https://www.perplexity.ai/search?q={query}",
    emoji: "◎",
    color: "#20b2aa",
    category: "ai"
  },

  // ── Search Engines (activated with !prefix) ──────────────────
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    prefix: "!ddg",
    url: "https://duckduckgo.com/?q={query}",
    emoji: "◆",
    color: "#de5833",
    category: "search"
  },
  {
    id: "google",
    name: "Google",
    prefix: "!goo",
    url: "https://www.google.com/search?q={query}",
    emoji: "◈",
    color: "#4285f4",
    category: "search"
  },
  {
    id: "yandex",
    name: "Yandex",
    prefix: "!yan",
    url: "https://yandex.com/search/?text={query}",
    emoji: "◉",
    color: "#fc3f1d",
    category: "search"
  },
  {
    id: "qwant",
    name: "Qwant",
    prefix: "!qwt",
    url: "https://www.qwant.com/?q={query}",
    emoji: "◎",
    color: "#5c2d91",
    category: "search"
  },
  {
    id: "kagi",
    name: "Kagi",
    prefix: "!kgi",
    url: "https://kagi.com/search?q={query}",
    emoji: "◆",
    color: "#ff6b35",
    category: "search",
    note: "Requires Kagi account"
  },
  {
    id: "startpage",
    name: "Startpage",
    prefix: "!stp",
    url: "https://www.startpage.com/search?q={query}",
    emoji: "◈",
    color: "#2575fc",
    category: "search"
  },
  {
    id: "ecosia",
    name: "Ecosia",
    prefix: "!eco",
    url: "https://www.ecosia.org/search?q={query}",
    emoji: "◉",
    color: "#3a7d44",
    category: "search"
  }
];

/**
 * Build the search URL for a given engine id and query string.
 */
function buildUrl(engineId, query) {
  const engine = ENGINES.find(e => e.id === engineId);
  if (!engine) return null;
  return engine.url.replace("{query}", encodeURIComponent(query));
}

/**
 * Parse a raw omnibox input string.
 *
 * AI models:      :gpt  question text   →  { engineId: "chatgpt", query: "question text" }
 * Search engines: !ddg  question text   →  { engineId: "duckduckgo", query: "question text" }
 * Plain text:     question text         →  { engineId: null, query: "question text" }
 */
function parseInput(rawText) {
  const trimmed = rawText.trim();

  // Match both : and ! prefixes, 2-4 chars
  const prefixMatch = trimmed.match(/^([!:][a-z]{2,4})\s+([\s\S]+)$/i);
  if (prefixMatch) {
    const prefix = prefixMatch[1].toLowerCase();
    const query  = prefixMatch[2].trim();
    const engine = ENGINES.find(e => e.prefix === prefix);
    if (engine) return { engineId: engine.id, query };
  }

  // No prefix — use full text with default engine
  return { engineId: null, query: trimmed };
}
