/**
 * content/perplexity.js
 * Reads the ?q= param and types it into Perplexity's input, then submits.
 */
(function () {
  const query = new URLSearchParams(window.location.search).get("q");
  if (!query) return;

  history.replaceState(null, "", window.location.pathname);

  function injectText(el, text) {
    el.focus();
    if (el.contentEditable === "true") {
      el.innerHTML = "";
      document.execCommand("insertText", false, text);
    } else {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(el), "value"
      )?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(el, text);
      } else {
        el.value = text;
      }
      el.dispatchEvent(new Event("input",  { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function trySubmit(inputEl) {
    const sendBtn =
      document.querySelector('button[aria-label="Submit"]') ||
      document.querySelector('button[type="submit"]') ||
      document.querySelector('button[aria-label="Send"]') ||
      [...document.querySelectorAll("button")].find(b =>
        b.closest("form") && !b.disabled
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
      document.querySelector('textarea[placeholder*="Ask"]') ||
      document.querySelector('textarea[placeholder*="search"]') ||
      document.querySelector("textarea") ||
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
