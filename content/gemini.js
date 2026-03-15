/**
 * content/gemini.js
 * Reads the ?q= param and types it into Gemini's Quill-based input, then submits.
 */
(function () {
  const query = new URLSearchParams(window.location.search).get("q");
  if (!query) return;

  history.replaceState(null, "", window.location.pathname);

  function injectText(el, text) {
    el.focus();
    el.innerHTML = "";
    document.execCommand("selectAll", false, null);
    document.execCommand("insertText", false, text);
  }

  function trySubmit(inputEl) {
    const sendBtn =
      document.querySelector('button.send-button') ||
      document.querySelector('button[aria-label="Send message"]') ||
      document.querySelector('button[jsname="Jh9lGc"]') ||
      document.querySelector('button[data-mat-icon-name="send"]') ||
      document.querySelector('button[aria-label*="send" i]') ||
      document.querySelector('mat-icon[data-mat-icon-name="send"]')?.closest("button");

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
      document.querySelector(".ql-editor[contenteditable='true']") ||
      document.querySelector("div[contenteditable='true'].input-area") ||
      document.querySelector("rich-textarea div[contenteditable='true']") ||
      document.querySelector("div[contenteditable='true']")
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
