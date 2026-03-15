/**
 * popup.js – QuickSearch settings popup
 */

let settings = {
  defaultEngine:  "google",
  keyword:        "@s",
  enabledEngines: ENGINES.map(e => e.id)
};

// ── DOM ──────────────────────────────────────────────────────────
const keywordInput = document.getElementById("keywordInput");
const keywordChip  = document.getElementById("keywordChip");
const engineGrid   = document.getElementById("engineGrid");
const refAi        = document.getElementById("refAi");
const refSearch    = document.getElementById("refSearch");
const toggleList   = document.getElementById("toggleList");
const saveBtn      = document.getElementById("saveBtn");
const toast        = document.getElementById("toast");

// ── Load & render ────────────────────────────────────────────────
async function loadSettings() {
  settings = await browser.storage.sync.get({
    defaultEngine:  "google",
    keyword:        "@s",
    enabledEngines: ENGINES.map(e => e.id)
  });
  render();
}

function render() {
  keywordInput.value   = settings.keyword;
  keywordChip.textContent = settings.keyword || "@s";
  renderEngineGrid();
  renderRefList();
  renderToggleList();
}

// ── Engine grid (default engine picker) ─────────────────────────
function renderEngineGrid() {
  engineGrid.innerHTML = "";
  ENGINES.forEach(engine => {
    const card = document.createElement("div");
    card.className = "engine-card" + (engine.id === settings.defaultEngine ? " selected" : "");
    card.dataset.id = engine.id;
    card.innerHTML = `
      <span class="ec-prefix ${engine.category}">${engine.prefix}</span>
      <span class="ec-name">${engine.name}</span>
    `;
    card.addEventListener("click", () => {
      settings.defaultEngine = engine.id;
      document.querySelectorAll(".engine-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });
    engineGrid.appendChild(card);
  });
}

// ── Prefix reference list ────────────────────────────────────────
function renderRefList() {
  refAi.innerHTML = "";
  refSearch.innerHTML = "";

  ENGINES.forEach(engine => {
    const row = document.createElement("div");
    row.className = "ref-row";
    row.innerHTML = `
      <span class="ref-badge ${engine.category}">${engine.prefix}</span>
      <span class="ref-name">${engine.name}</span>
      ${engine.note ? `<span class="ref-note">⚠ ${engine.note}</span>` : ""}
    `;
    if (engine.category === "ai") {
      refAi.appendChild(row);
    } else {
      refSearch.appendChild(row);
    }
  });
}

// ── Toggle list ──────────────────────────────────────────────────
function renderToggleList() {
  toggleList.innerHTML = "";

  ENGINES.forEach(engine => {
    const enabled = settings.enabledEngines.includes(engine.id);
    const row = document.createElement("div");
    row.className = "toggle-row";
    row.innerHTML = `
      <div class="toggle-label">
        <span class="toggle-prefix ${engine.category}">${engine.prefix}</span>
        <span class="toggle-name">${engine.name}</span>
      </div>
      <label class="switch">
        <input type="checkbox" data-id="${engine.id}" ${enabled ? "checked" : ""} />
        <span class="slider"></span>
      </label>
    `;
    row.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) {
        if (!settings.enabledEngines.includes(engine.id)) {
          settings.enabledEngines.push(engine.id);
        }
      } else {
        settings.enabledEngines = settings.enabledEngines.filter(id => id !== engine.id);
      }
    });
    toggleList.appendChild(row);
  });
}

// ── Live keyword preview ─────────────────────────────────────────
keywordInput.addEventListener("input", () => {
  const val = keywordInput.value.trim() || "@s";
  keywordChip.textContent = val;
  settings.keyword = val;
});

// ── Save ─────────────────────────────────────────────────────────
saveBtn.addEventListener("click", async () => {
  const kw = keywordInput.value.trim() || "@s";
  settings.keyword = kw;

  await browser.storage.sync.set({
    defaultEngine:  settings.defaultEngine,
    keyword:        settings.keyword,
    enabledEngines: settings.enabledEngines
  });

  browser.runtime.sendMessage({ type: "settingsUpdated" }).catch(() => {});

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
});

// ── Init ─────────────────────────────────────────────────────────
loadSettings();
