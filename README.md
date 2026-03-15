<div align="center">

# ⚡ QuickSearch — Multi-Engine Launcher

**A Firefox extension that lets you search any search engine or AI model directly from your address bar — in one keystroke.**

[![Firefox](https://img.shields.io/badge/Firefox-Extension-FF7139?logo=firefox-browser&logoColor=white)](https://www.mozilla.org/firefox/)
[![Manifest V2](https://img.shields.io/badge/Manifest-V2-blue)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

</div>

---

## ✨ What It Does

Type `@s` in your Firefox address bar, add a prefix, and instantly open **ChatGPT, Gemini, Claude, Perplexity, DuckDuckGo, Google**, and more — with your query already typed and submitted.

No mouse. No copy-paste. No extra tabs to manage.

---

## 🚀 Quick Start

### Install (Temporary / Developer Mode)

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on…"**
3. Select the `manifest.json` file from this folder
4. The QuickSearch icon will appear in your toolbar ✅

> **Note:** Temporary add-ons are removed when Firefox closes. For persistent use, the extension needs to be signed via [AMO](https://addons.mozilla.org/developers/).

---

## 🎯 How to Use

Type `@s` in the address bar, followed by a prefix and your query:

### 🤖 AI Models — `:` prefix

| Command | Opens | Auto-submits? |
|---|---|:---:|
| `@s :gpt what is quantum computing` | ChatGPT | ✅ |
| `@s :gem explain black holes` | Google Gemini | ✅ |
| `@s :cld write me a poem` | Claude | ✅ |
| `@s :ppl latest AI news` | Perplexity | ✅ |

> The query is **automatically typed and submitted** — you land directly on the answer page.

### 🔍 Search Engines — `!` prefix

| Command | Opens |
|---|---|
| `@s !ddg your query` | DuckDuckGo |
| `@s !goo your query` | Google |
| `@s !yan your query` | Yandex |
| `@s !qwt your query` | Qwant |
| `@s !kgi your query` | Kagi *(requires account)* |
| `@s !stp your query` | Startpage |
| `@s !eco your query` | Ecosia |

### ⚡ No prefix

```
@s your query
```
Opens your **default engine** (configurable in settings).

---

## ⚙️ Settings

Click the **QuickSearch icon** in your toolbar to open the settings popup:

| Setting | Description |
|---|---|
| **Trigger keyword** | Change `@s` to any keyword you like (also update at `about:preferences#search`) |
| **Default engine** | The engine used when no `:` or `!` prefix is given |
| **Enabled engines** | Toggle which engines appear as address-bar suggestions |

---

## 📁 Project Structure

```
search-engines/
├── manifest.json          # Extension manifest (MV2)
├── background.js          # Omnibox event handling & routing
├── engines.js             # All engine definitions & URL builder
├── content/
│   ├── chatgpt.js         # Auto-submit script for ChatGPT
│   ├── gemini.js          # Auto-submit script for Gemini
│   ├── claude.js          # Auto-submit script for Claude
│   └── perplexity.js      # Auto-submit script for Perplexity
├── popup/
│   ├── popup.html         # Settings UI
│   ├── popup.css          # Settings styles
│   └── popup.js           # Settings logic
└── icons/                 # Extension icons
```

---

## 🛠️ Adding a New Engine

Open `engines.js` and add an entry to the `ENGINES` array:

```js
{
  id: "bing",
  name: "Bing",
  prefix: "!bin",
  url: "https://www.bing.com/search?q={query}",
  emoji: "🔷",
  color: "#008373",
  category: "search"
}
```

For AI models that need auto-submit, also create a `content/bing.js` script and register it in `manifest.json` under `content_scripts`.

---

## 🤝 Contributing

Pull requests are welcome! If you find a broken selector for an AI model (they update their UIs frequently), please open an issue or submit a fix to the relevant `content/*.js` file.

---

## 📄 License

MIT © QuickSearch Extension
