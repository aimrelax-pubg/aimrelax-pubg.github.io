/* AIMRELAX-PUBG LOCAL LANGUAGE SYSTEM
   Google Translate չի օգտագործվում։
   Nickname-ները ավտոմատ պաշտպանված են։
*/

(function () {
  "use strict";

  const KEY = "aimrelax_language";
  const DEFAULT_LANG = "hy";

  const LANGS = [
    ["hy", "🇦🇲 Հայերեն"],
    ["ru", "🇷🇺 Русский"],
    ["en", "🇬🇧 English"]
  ];

  /*
   ============================================================
   NICKNAME PROTECTION
   ============================================================
   HTML-ում nickname-ների վրա class ավելացնելու կարիք չկա։
  */

  const NICKNAMES = new Set([
    "MOMPO",
    "DOMPO",
    "INFERNO",
    "KOKO",
    "KØKØ",
    "PRINCES",
    "YUKI",
    "WAY",
    "WAYツ",
    "AKA",
    "LOGIN",
    "FURY",
    "IMFERNO",
    "AGILE",
    "ANGRY",
    "MANE",
    "DOUBLEV",
    "SCARY",
    "SIMBA",
    "CAT",
    "HOV",
    "KAR",
    "FAN",
    "REY",
    "R E Y",
    "IMPAER",
    "IMPÆR",
    "BETON",
    "BOX3R",
    "STALIN",
    "ZOMPO"
  ]);

  /*
   AIM prefix-ով nickname-ները նույնպես պաշտպանված են։
   Օրինակ՝ 『Aim』MOMPO
  */

  function normalizeNickname(value) {
    return String(value || "")
      .replace(/『Aim』/gi, "")
      .replace(/[『』]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }

  function isKnownNickname(text) {
    const clean = normalizeNickname(text);

    if (!clean) return false;

    if (NICKNAMES.has(clean)) {
      return true;
    }

    /*
     『Aim』MOMPO
     『Aim』DOMPO
     『Aim』KØKØ
     և այլն
    */
    if (/^AIM[\s:_-]*[A-Z0-9ØÆツ『』]+$/i.test(clean)) {
      const withoutAim = clean
        .replace(/^AIM[\s:_-]*/i, "")
        .trim();

      if (NICKNAMES.has(withoutAim)) {
        return true;
      }
    }

    return false;
  }

  /*
   Եթե nickname-ը գտնվում է նման տարրի մեջ,
   նույնպես երբեք չի թարգմանվում։
  */

  const NICKNAME_PARENT_SELECTORS = [
    ".nickname",
    ".player-name",
    ".username",
    ".chat-nickname",
    ".friend-nickname",
    ".player-nickname",

    "[data-nickname]",
    "[data-player-name]",
    "[data-username]",

    '[class*="nickname"]',
    '[class*="player-name"]',
    '[class*="username"]',
    '[class*="friend-name"]',
    '[id*="nickname"]',
    '[id*="player-name"]',
    '[id*="username"]'
  ];

  function isNicknameElement(element) {
    if (!element || element.nodeType !== 1) {
      return false;
    }

    /*
     Առաջինը՝ class/id/data attribute-ներով։
    */
    for (const selector of NICKNAME_PARENT_SELECTORS) {
      try {
        if (element.matches(selector) || element.closest(selector)) {
          return true;
        }
      } catch (e) {}
    }

    /*
     Երկրորդը՝ հենց տեքստով։
    */
    const text = element.textContent?.trim();

    if (text && isKnownNickname(text)) {
      return true;
    }

    /*
     Եթե element-ի մեջ կա միայն մեկ text node
     և դրա արժեքը nickname է։
    */
    if (
      element.childNodes &&
      element.childNodes.length === 1 &&
      element.firstChild.nodeType === Node.TEXT_NODE
    ) {
      if (isKnownNickname(element.firstChild.nodeValue)) {
        return true;
      }
    }

    return false;
  }

  function isNicknameTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return false;
    }

    const text = node.nodeValue || "";
    const clean = text.trim();

    if (isKnownNickname(clean)) {
      return true;
    }

    const parent = node.parentElement;

    if (parent && isNicknameElement(parent)) {
      return true;
    }

    /*
     Հենց AIM nickname-ը text node-ի մեջ լինի։
    */
    if (/『Aim』/i.test(clean)) {
      const withoutAim = clean
        .replace(/『Aim』/gi, "")
        .trim();

      if (isKnownNickname(withoutAim)) {
        return true;
      }
    }

    return false;
  }

  /*
   ============================================================
   TRANSLATIONS
   ============================================================
  */

  const T = {

    "Մուտք": {
      ru: "Войти",
      en: "Login"
    },

    "Գրանցում": {
      ru: "Регистрация",
      en: "Register"
    },

    "Մուտք / Գրանցում": {
      ru: "Вход / Регистрация",
      en: "Login / Register"
    },

    "Մուտք գործել": {
      ru: "Войти",
      en: "Sign in"
    },

    "Գրանցվել": {
      ru: "Зарегистрироваться",
      en: "Sign up"
    },

    "Դուրս գալ": {
      ru: "Выйти",
      en: "Logout"
    },

    "Պրոֆիլ": {
      ru: "Профиль",
      en: "Profile"
    },

    "Կարգավորումներ": {
      ru: "Настройки",
      en: "Settings"
    },

    "Ընկերներ": {
      ru: "Друзья",
      en: "Friends"
    },

    "Խմբեր": {
      ru: "Группы",
      en: "Groups"
    },

    "Խումբ": {
      ru: "Группа",
      en: "Group"
    },

    "Չատ": {
      ru: "Чат",
      en: "Chat"
    },

    "Անձնական չատ": {
      ru: "Личный чат",
      en: "Private chat"
    },

    "Խմբային չատ": {
      ru: "Групповой чат",
      en: "Group chat"
    },

    "Ուղարկել": {
      ru: "Отправить",
      en: "Send"
    },

    "Ջնջել": {
      ru: "Удалить",
      en: "Delete"
    },

    "Փակել": {
      ru: "Закрыть",
      en: "Close"
    },

    "Հաստատել": {
      ru: "Подтвердить",
      en: "Confirm"
    },

    "Չեղարկել": {
      ru: "Отмена",
      en: "Cancel"
    },

   
