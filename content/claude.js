/**
 * content/claude.js
 * Reads the ?q= param and types it into Claude's Lexical-based input, then submits.
 */
(function () {
  const query = new URLSearchParams(window.location.search).get("q");
  if (!query) return;

  history.replaceState(null, "", window.location.pathname);

  function injectText(el, text) {
    el.focus();
    // Lexical (Claude's editor) responds well to execCommand after clearing
    el.innerHTML = "";
    document.execCommand("insertText", false, text);

    // Also dispatch input events for any listeners
    el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
  }

  function trySubmit(inputEl) {
    const sendBtn =
      document.querySelector('button[aria-label="Send Message"]') ||
      document.querySelector('button[aria-label="Send message"]') ||
      document.querySelector('button[data-testid="send-button"]') ||
      document.querySelector('button[type="submit"]') ||
      [...document.querySelectorAll("button")].find(b =>
        b.textContent.trim() === "" && b.querySelector('svg')
        && b.closest("form")
      );

    if (sendBtn && !sendBtn.disabled) {
      sendBtn.click();
      return;
    }

    // Fallback: Enter key
    inputEl.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter", code: "Enter", keyCode: 13,
      bubbles: true, cancelable: true
    }));
  }

  function findInput() {
    return (
      document.querySelector('div[contenteditable="true"][data-lexical-editor="true"]') ||
      document.querySelector('div[contenteditable="true"].ProseMirror') ||
      document.querySelector('div[contenteditable="true"][data-placeholder]') ||
      document.querySelector('div[contenteditable="true"]')
    );
  }

  let attempts = 0;
  const MAX = 40;

  const poll = setInterval(() => {
    attempts++;
    const el = findInput();

    if (el) {
      clearInterval(poll);
      injectText(el, query);
      setTimeout(() => trySubmit(el), 700);
    } else if (attempts >= MAX) {
      clearInterval(poll);
    }
  }, 300);
})();
