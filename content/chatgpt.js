/**
 * content/chatgpt.js
 * Reads the ?q= param from the URL and types it into ChatGPT's input,
 * then submits. Works with the ProseMirror editor ChatGPT uses.
 */
(function () {
  const query = new URLSearchParams(window.location.search).get("q");
  if (!query) return;

  // Clean the URL so it doesn't re-trigger on navigation
  history.replaceState(null, "", window.location.pathname);

  function setNativeValue(el, value) {
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set ||
                   Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (setter) {
      setter.call(el, value);
    } else {
      el.value = value;
    }
  }

  function injectText(el, text) {
    el.focus();

    // For contenteditable divs (ProseMirror)
    if (el.contentEditable === "true") {
      el.innerHTML = "";
      document.execCommand("insertText", false, text);
      return;
    }

    // For textarea / input
    setNativeValue(el, text);
    el.dispatchEvent(new Event("input",  { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function trySubmit(inputEl) {
    // Try the send button first
    const sendBtn =
      document.querySelector('button[data-testid="send-button"]') ||
      document.querySelector('button[aria-label="Send message"]') ||
      document.querySelector('button[aria-label="Send prompt"]') ||
      document.querySelector("form button[type='submit']");

    if (sendBtn && !sendBtn.disabled) {
      sendBtn.click();
      return;
    }

    // Fallback: press Enter in the input
    inputEl.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter", code: "Enter", keyCode: 13,
      bubbles: true, cancelable: true
    }));
  }

  function findInput() {
    return (
      document.querySelector("#prompt-textarea") ||
      document.querySelector("div[contenteditable='true'].ProseMirror") ||
      document.querySelector("div[contenteditable='true'][data-slate-editor]") ||
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
      // Give React time to update state before submitting
      setTimeout(() => trySubmit(el), 600);
    } else if (attempts >= MAX) {
      clearInterval(poll);
    }
  }, 300);
})();
