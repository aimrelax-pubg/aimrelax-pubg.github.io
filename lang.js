/* AIMRELAX-PUBG GLOBAL LANGUAGE SYSTEM */
(function () {
  "use strict";

  const KEY = "aimrelax_language";
  const DEFAULT_LANG = "hy";

  const LANGS = [
    ["hy", "🇦🇲 Հայերեն"],
    ["ru", "🇷🇺 Русский"],
    ["en", "🇬🇧 English"]
  ];

  function getLang() {
    return localStorage.getItem(KEY) || DEFAULT_LANG;
  }

  function setCookie(lang) {
    const value = "/" + DEFAULT_LANG + "/" + lang;

    document.cookie =
      "googtrans=" + value +
      "; path=/; max-age=31536000; SameSite=Lax";

    document.cookie =
      "_googtrans=" + value +
      "; path=/; max-age=31536000; SameSite=Lax";
  }

  function clearCookie() {
    document.cookie =
      "googtrans=; path=/; max-age=0; SameSite=Lax";

    document.cookie =
      "_googtrans=; path=/; max-age=0; SameSite=Lax";
  }

  function applyGoogle(lang) {
    if (lang === DEFAULT_LANG) {
      clearCookie();
      location.reload();
      return;
    }

    setCookie(lang);

    let tries = 0;

    const timer = setInterval(function () {
      tries++;

      const select = document.querySelector(".goog-te-combo");

      if (select) {
        select.value = lang;

        select.dispatchEvent(
          new Event("change", {
            bubbles: true
          })
        );

        clearInterval(timer);
        return;
      }

      if (tries >= 50) {
        clearInterval(timer);
        location.reload();
      }

    }, 100);
  }

  function choose(lang) {
    if (!LANGS.some(function (x) {
      return x[0] === lang;
    })) {
      lang = DEFAULT_LANG;
    }

    localStorage.setItem(KEY, lang);

    if (lang === DEFAULT_LANG) {
      clearCookie();
      location.reload();
    } else {
      setCookie(lang);

      const select =
        document.querySelector(".goog-te-combo");

      if (select) {
        select.value = lang;

        select.dispatchEvent(
          new Event("change", {
            bubbles: true
          })
        );
      } else {
        location.reload();
      }
    }
  }

  function addStyle() {
    if (
      document.getElementById(
        "aimrelax-lang-style"
      )
    ) {
      return;
    }

    const s = document.createElement("style");

    s.id = "aimrelax-lang-style";

    s.textContent = `
      #aimrelax-language-box {
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        z-index: 2147483647 !important;

        background: rgba(12,12,12,.96);

        border: 1px solid #ff7200;

        border-radius: 9px;

        padding: 4px;

        box-shadow:
          0 4px 18px rgba(0,0,0,.45);
      }

      #aimrelax-language-select {
        background: #111 !important;

        color: #fff !important;

        border: 0 !important;

        border-radius: 6px;

        padding: 7px 8px;

        font-size: 12px;

        font-weight: 700;

        outline: none;
      }

      #aimrelax-language-select option {
        background: #111;

        color: #fff;
      }

      .goog-te-banner-frame,
      .skiptranslate iframe {
        display: none !important;
      }

      body {
        top: 0 !important;
      }

      .goog-logo-link,
      .goog-te-gadget span {
        display: none !important;
      }

      #google_translate_element {
        position: fixed !important;

        left: -10000px !important;
        top: -10000px !important;

        width: 1px !important;
        height: 1px !important;

        overflow: hidden !important;
      }

      @media (max-width: 650px) {

        #aimrelax-language-box {
          top: 7px !important;
          right: 7px !important;
        }

        #aimrelax-language-select {
          font-size: 11px;

          padding: 6px;
        }
      }
    `;

    document.head.appendChild(s);
  }

  function addUI() {
    if (
      document.getElementById(
        "aimrelax-language-box"
      )
    ) {
      return;
    }

    const box = document.createElement("div");

    box.id = "aimrelax-language-box";

    const select =
      document.createElement("select");

    select.id =
      "aimrelax-language-select";

    LANGS.forEach(function (x) {

      const option =
        document.createElement("option");

      option.value = x[0];

      option.textContent = x[1];

      select.appendChild(option);

    });

    select.value = getLang();

    select.addEventListener(
      "change",
      function () {

        choose(this.value);

      }
    );

    box.appendChild(select);

    document.body.appendChild(box);

    const hidden =
      document.createElement("div");

    hidden.id =
      "google_translate_element";

    document.body.appendChild(hidden);
  }

  window.googleTranslateElementInit =
    function () {

      try {

        new google.translate.TranslateElement(
          {
            pageLanguage: DEFAULT_LANG,

            includedLanguages:
              "hy,ru,en",

            autoDisplay: false,

            multilanguagePage: true
          },

          "google_translate_element"
        );

        const wanted = getLang();

        if (wanted !== DEFAULT_LANG) {

          setTimeout(
            function () {
              applyGoogle(wanted);
            },
            800
          );

        }

      } catch (e) {

        console.error(
          "AIMRELAX language error:",
          e
        );

      }

    };

  function loadGoogle() {

    if (getLang() === DEFAULT_LANG) {
      return;
    }

    if (
      document.getElementById(
        "aimrelax-google-script"
      )
    ) {
      return;
    }

    const s =
      document.createElement("script");

    s.id =
      "aimrelax-google-script";

    s.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

    s.async = true;

    document.head.appendChild(s);
  }

  function boot() {

    addStyle();

    addUI();

    loadGoogle();

  }

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      boot,
      { once: true }
    );

  } else {

    boot();

  }

  window.AIMRELAX_LANGUAGE = {

    get: getLang,

    set: choose,

    languages: LANGS

  };

})();
