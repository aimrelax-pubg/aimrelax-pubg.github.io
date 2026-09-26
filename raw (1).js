/* AIMRELAX-PUBG — Global language switcher
   Languages: Հայերեն / Русский / English
   Persistent across all AIMRELAX HTML pages via _googtrans cookie.
*/
(function () {
  const LANG_KEY = "aimrelax_language";
  const SOURCE_LANG = "hy";
  const LANGS = [
    { code: "hy", label: "🇦🇲 Հայերեն" },
    { code: "ru", label: "🇷🇺 Русский" },
    { code: "en", label: "🇬🇧 English" }
  ];

  function getLang() {
    return localStorage.getItem(LANG_KEY) || "hy";
  }

  function setTranslateCookie(lang) {
    const value = "/" + SOURCE_LANG + "/" + lang;
    document.cookie = "_googtrans=" + value + ";path=/;max-age=31536000;SameSite=Lax";
    document.cookie = "googtrans=" + value + ";path=/;max-age=31536000;SameSite=Lax";
  }

  function clearTranslateCookie() {
    document.cookie = "_googtrans=;path=/;max-age=0;SameSite=Lax";
    document.cookie = "googtrans=;path=/;max-age=0;SameSite=Lax";
  }

  function chooseLanguage(lang) {
    if (!LANGS.some(x => x.code === lang)) lang = "hy";
    localStorage.setItem(LANG_KEY, lang);

    if (lang === "hy") {
      clearTranslateCookie();
    } else {
      setTranslateCookie(lang);
    }

    location.reload();
  }

  function addStyles() {
    if (document.getElementById("aimrelax-language-style")) return;
    const style = document.createElement("style");
    style.id = "aimrelax-language-style";
    style.textContent = `
      #aimrelax-language-box{
        position:fixed;right:12px;top:12px;z-index:2147483647;
        display:flex;align-items:center;gap:6px;
        background:rgba(10,10,10,.94);border:1px solid #ff7200;
        border-radius:9px;padding:5px;box-shadow:0 5px 20px rgba(0,0,0,.4)
      }
      #aimrelax-language-select{
        appearance:auto;background:#111;color:#fff;border:0;outline:0;
        border-radius:6px;padding:7px 8px;font-weight:700;font-size:12px
      }
      #aimrelax-language-select option{background:#111;color:#fff}
      .goog-te-banner-frame,.skiptranslate iframe{display:none!important}
      body{top:0!important}
      .goog-logo-link,.goog-te-gadget span{display:none!important}
      .goog-te-gadget{font-size:0!important}
      #google_translate_element{
        position:fixed!important;width:1px!important;height:1px!important;
        overflow:hidden!important;left:-9999px!important;top:-9999px!important
      }
      @media(max-width:650px){
        #aimrelax-language-box{top:7px;right:7px}
        #aimrelax-language-select{font-size:11px;padding:6px}
      }
    `;
    document.head.appendChild(style);
  }

  function addUI() {
    if (document.getElementById("aimrelax-language-box")) return;

    const box = document.createElement("div");
    box.id = "aimrelax-language-box";
    box.setAttribute("aria-label", "Language");

    const select = document.createElement("select");
    select.id = "aimrelax-language-select";

    LANGS.forEach(lang => {
      const option = document.createElement("option");
      option.value = lang.code;
      option.textContent = lang.label;
      select.appendChild(option);
    });

    select.value = getLang();
    select.addEventListener("change", () => chooseLanguage(select.value));
    box.appendChild(select);
    document.body.appendChild(box);

    const hidden = document.createElement("div");
    hidden.id = "google_translate_element";
    document.body.appendChild(hidden);
  }

  function loadGoogleTranslate() {
    if (getLang() === "hy") return;
    if (window.google && window.google.translate) {
      try { window.google.translate.TranslateElement({pageLanguage: SOURCE_LANG, autoDisplay:false}, "google_translate_element"); } catch(e) {}
      return;
    }

    window.googleTranslateElementInit = function () {
      try {
        new google.translate.TranslateElement(
          { pageLanguage: SOURCE_LANG, autoDisplay: false },
          "google_translate_element"
        );
      } catch (e) {}
    };

    const s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.head.appendChild(s);
  }

  function boot() {
    if (!document.head || !document.body) return;
    addStyles();
    addUI();
    loadGoogleTranslate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, {once:true});
  } else {
    boot();
  }

  window.AIMRELAX_LANGUAGE = {
    get: getLang,
    set: chooseLanguage,
    languages: LANGS
  };
})();
