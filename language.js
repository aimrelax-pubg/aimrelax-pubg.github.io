(function () {
"use strict";

const KEY = "aimrelax_language";

const LANG = {
  hy: "🇦🇲 Հայերեն",
  ru: "🇷🇺 Русский",
  en: "🇬🇧 English"
};

const UI = {

  "Գլխավոր էջ": ["Главная", "Home"],
  "Կլան": ["Клан", "Clan"],
  "Խաղացողներ": ["Игроки", "Players"],
  "Նվաճումներ": ["Достижения", "Achievements"],
  "Նկարներ": ["Изображения", "Gallery"],
  "Հետադարձ Կապ": ["Контакты", "Contact"],

  "👥 Ընկերներ": ["👥 Друзья", "👥 Friends"],
  "👥 Իմ ընկերները": ["👥 Мои друзья", "👥 My friends"],
  "📨 Ուղարկված / ստացված հայտեր": [
    "📨 Отправленные / полученные заявки",
    "📨 Sent / received requests"
  ],
  "⭐ Իմ ընկերները": ["⭐ Мои друзья", "⭐ My friends"],
  "ՄՈՒՏՔ / ԳՐԱՆՑՈՒՄ": ["ВХОД / РЕГИСТРАЦИЯ", "LOGIN / REGISTER"],
  "⚙️ Կարգավորումներ": ["⚙️ Настройки", "⚙️ Settings"],
  "🛡️ Ադմին պանել": ["🛡️ Панель администратора", "🛡️ Admin panel"],
  "ԵԼՔ": ["ВЫЙТИ", "LOG OUT"],

  "Ծանուցումներ": ["Уведомления", "Notifications"],
  "Ընկերության հայտեր": ["Заявки в друзья", "Friend requests"],

  "🇦🇲 Հայաստան": ["🇦🇲 Армения", "🇦🇲 Armenia"],
  "Եղանակը բեռնվում է...": ["Загрузка погоды...", "Loading weather..."],

  "ԽԱՂԱ • ԳԵՐԻՇԽԻՐ • ԿՐԿԻՆ ՀԱՂԹԻՐ":
    ["ИГРАЙ • ДОМИНИРУЙ • ПОБЕЖДАЙ СНОВА",
     "PLAY • DOMINATE • WIN AGAIN"],

  "ԲԱՐԻ ԳԱԼՈՒՍՏ AIMRELAX ՊԱՇՏՈՆԱԿԱՆ ԿԼԱՆ":
    ["ДОБРО ПОЖАЛОВАТЬ НА ОФИЦИАЛЬНЫЙ САЙТ AIMRELAX",
     "WELCOME TO THE OFFICIAL AIMRELAX CLAN"],

  "📲 ՆԵՐԲԵՌՆԵԼ ՀԱՎԵԼՎԱԾԸ":
    ["📲 СКАЧАТЬ ПРИЛОЖЕНИЕ",
     "📲 DOWNLOAD APP"],

  "Մեր Խաղացողները": ["Наши игроки", "Our Players"],
  "Միանալ Կլանին": ["Присоединиться к клану", "Join the Clan"],
  "🎯 1VS1 Bottle": ["🎯 1VS1 Bottle", "🎯 1VS1 Battle"],
  "📋 Հարցաթերթիկ": ["📋 Анкета", "📋 Questionnaire"],
  "🎬 Վիդեոներ և նկարներ": ["🎬 Видео и изображения", "🎬 Videos & Images"],
  "🧠 PUBG ՔՆՆՈՒԹՅՈՒՆ": ["🧠 ЭКЗАМЕН PUBG", "🧠 PUBG EXAM"],
  "🧠 PUBG ՔՆՆՈՒԹՅԱՆ ԱՐԴՅՈՒՆՔՆԵՐ":
    ["🧠 РЕЗУЛЬТАТЫ ЭКЗАМЕНА PUBG",
     "🧠 PUBG EXAM RESULTS"],

  "Ով ենք մենք": ["Кто мы", "Who We Are"],
  "Կլանի Մասին": ["О клане", "About the Clan"],
  "Մեր նպատակը": ["Наша цель", "Our Goal"],
  "Մեր Թիմը": ["Наша команда", "Our Team"],
  "Ձեռքբերումներ": ["Достижения", "Achievements"],
  "Մեր Ուղին": ["Наш путь", "Our Journey"],

  "Մրցակցային PUBG Mobile կլան՝ ստեղծված այն խաղացողների համար, ովքեր սիրում են թիմային աշխատանքը, մրցակցությունը և հմտությունների կատարելագործումը։":
    ["Соревновательный клан PUBG Mobile для игроков, которые любят командную работу, конкуренцию и совершенствование навыков.",
     "A competitive PUBG Mobile clan for players who love teamwork, competition and improving their skills."],

  "Կազմավորենք ուժեղ թիմ, մասնակցենք մրցաշարերի և ստեղծենք հմուտ PUBG Mobile խաղացողների համայնք։":
    ["Создадим сильную команду, будем участвовать в турнирах и создадим сообщество опытных игроков PUBG Mobile.",
     "Build a strong team, participate in tournaments and create a community of skilled PUBG Mobile players."],

  "Հիմնադրվել է": ["Основан", "Founded"],
  "Խաղացողներ": ["Игроки", "Players"],
  "Մրցաշարեր": ["Турниры", "Tournaments"],
  "Երկիր": ["Страна", "Country"],

  "Մրցաշարեր": ["Турниры", "Tournaments"],
  "Հաղթանակներ": ["Победы", "Victories"],
  "ԼԱՎԱԳՈՒՅՆ ՖՐԱԳԵՐ": ["ЛУЧШИЕ ФРАГИ", "BEST FRAGS"],
  "ՇՈՒՏՈՎ": ["СКОРО", "COMING SOON"],

  "ՄԵԴԻԱ": ["МЕДИА", "MEDIA"],
  "ՊԱՏԿԵՐՆԵՐ": ["ИЗОБРАЖЕНИЯ", "IMAGES"],
  "ՆԿԱՐ": ["ИЗОБРАЖЕНИЕ", "IMAGE"],
  "📷 Նկար ընտրել": ["📷 Выбрать изображение", "📷 Choose image"],
  "⬆️ Ավելացնել": ["⬆️ Добавить", "⬆️ Add"],
  "🗑️ Ջնջել": ["🗑️ Удалить", "🗑️ Delete"],
  "💬 Մեկնաբանություններ": ["💬 Комментарии", "💬 Comments"],
  "Մեկնաբանություն...": ["Комментарий...", "Comment..."],

  "ՀԱՄԱՅՆՔ": ["СООБЩЕСТВО", "COMMUNITY"],
  "🗳 Քվեարկություն": ["🗳 Голосование", "🗳 Voting"],
  "Մուտք գործեք և ընտրեք խաղացողին։ Յուրաքանչյուր հաշիվ կարող է քվեարկել միայն մեկ անգամ։":
    ["Войдите и выберите игрока. Каждый аккаунт может голосовать только один раз.",
     "Log in and choose a player. Each account can vote only once."],
  "Խաղացողները բեռնվում են...":
    ["Игроки загружаются...", "Loading players..."],
  "ՔՎԵԱՐԿԵԼ": ["ГОЛОСОВАТЬ", "VOTE"],
  "Ընդհանուր՝ 0 հոգի": ["Всего: 0 человек", "Total: 0 people"],

  "ԿԱՊ ՀԱՍՏԱՏԵԼ": ["СВЯЗАТЬСЯ С НАМИ", "CONTACT US"],
  "ՄԻԱՆԱԼ AIMRELAX-ԻՆ": ["ПРИСОЕДИНИТЬСЯ К AIMRELAX", "JOIN AIMRELAX"],
  "ՄԵՐ ՍՈՑ. ԷՋԵՐԸ": ["НАШИ СОЦ. СТРАНИЦЫ", "OUR SOCIAL PAGES"],
  "ԼԻԴԵՐԻ TIKTOK": ["TIKTOK ЛИДЕРА", "LEADER'S TIKTOK"],
  "Ձեր E-mail": ["Ваш E-mail", "Your E-mail"],
  "Ձեր նամակը": ["Ваше сообщение", "Your message"],
  "ՈՒՂԱՐԿԵԼ ՆԱՄԱԿԸ": ["ОТПРАВИТЬ СООБЩЕНИЕ", "SEND MESSAGE"],

  "💬 Չատ": ["💬 Чат", "💬 Chat"],
  "💬 Անձնական Chat": ["💬 Личный чат", "💬 Private Chat"],
  "Բացեք ընկերոջ CHAT-ը՝ զրույցը սկսելու համար։":
    ["Откройте CHAT друга, чтобы начать разговор.",
     "Open a friend's CHAT to start a conversation."],
  "🔴 Ձայնագրում է…": ["🔴 Идёт запись…", "🔴 Recording…"],
  "Գրեք հաղորդագրություն...": ["Введите сообщение...", "Write a message..."],
  "Էմոջիներ": ["Эмодзи", "Emoji"],
  "Նկար / տեսանյութ / ֆայլ": ["Изображение / видео / файл", "Image / video / file"],
  "Ձայնային հաղորդագրություն": ["Голосовое сообщение", "Voice message"],
  "Չեղարկել": ["Отменить", "Cancel"],

  "🔔 Ծանուցումներ": ["🔔 Уведомления", "🔔 Notifications"],
  "Ծանուցումները անջատված են։":
    ["Уведомления отключены.", "Notifications are disabled."],
  "🔔 Միացնել ծանուցումները":
    ["🔔 Включить уведомления", "🔔 Enable notifications"],

  "🔐 Հայտ ուղարկելու համար անհրաժեշտ է գրանցվել և մուտք գործել։":
    ["🔐 Для отправки заявки необходимо зарегистрироваться и войти.",
     "🔐 You must register and log in to submit an application."],

  "Բոլոր 30 հարցերին պատասխանելը պարտադիր է։":
    ["Необходимо ответить на все 30 вопросов.",
     "All 30 questions are required."],

  "Հայտը ուղարկվում է...":
    ["Заявка отправляется...", "Submitting application..."],

  "Խնդրում ենք պատասխանել բոլոր 30 հարցերին։":
    ["Пожалуйста, ответьте на все 30 вопросов.",
     "Please answer all 30 questions."],

  "Հայտը հաջողությամբ ուղարկվեց։ Սպասեք Admin-ի պատասխանին։":
    ["Заявка успешно отправлена. Ожидайте ответа администратора.",
     "Application sent successfully. Wait for the Admin's response."],

  "Չհաջողվեց ուղարկել հայտը։":
    ["Не удалось отправить заявку.", "Failed to submit application."],

  "Ծանուցումները միացված են ✅":
    ["Уведомления включены ✅", "Notifications enabled ✅"],

  "Մուտք գործեք՝ ծանուցումները միացնելու համար։":
    ["Войдите, чтобы включить уведомления.",
     "Log in to enable notifications."],

  "Բեռնվում է...": ["Загрузка...", "Loading..."],
  "Նոր ծանուցումներ չկան։":
    ["Новых уведомлений нет.", "No new notifications."],

  "Հենց հիմա": ["Только что", "Just now"],
  "րոպե առաջ": ["мин. назад", "minutes ago"],
  "ժամ առաջ": ["ч. назад", "hours ago"],
  "օր առաջ": ["дн. назад", "days ago"]
};

const ATTR = {
  "Ծանուցումներ": ["Уведомления", "Notifications"],
  "Ընկերության հայտեր": ["Заявки в друзья", "Friend requests"],
  "Փնտրել nickname-ով": ["Поиск по nickname", "Search by nickname"],
  "Էմոջիներ": ["Эмодзи", "Emoji"],
  "Նկար / տեսանյութ / ֆայլ": ["Изображение / видео / файл", "Image / video / file"],
  "Ձայնային հաղորդագրություն": ["Голосовое сообщение", "Voice message"],
  "Չեղարկել": ["Отменить", "Cancel"]
};

function getLang() {
  const x = localStorage.getItem(KEY);
  return LANG[x] ? x : "hy";
}

function tr(text, lang) {
  if (!text) return text;

  const clean = text.trim();
  const item = UI[clean];

  if (!item || lang === "hy") return text;

  return item[lang === "ru" ? 0 : 1];
}

function setText(el, lang) {
  if (!el) return;

  if (!el.dataset.arText) {
    el.dataset.arText = el.textContent;
  }

  const original = el.dataset.arText;
  el.textContent = tr(original, lang);
}

function setAttr(el, attr, lang) {
  if (!el) return;

  const key = "ar" + attr;

  if (!el.dataset[key]) {
    el.dataset[key] = el.getAttribute(attr) || "";
  }

  const original = el.dataset[key];

  if (ATTR[original]) {
    el.setAttribute(
      attr,
      lang === "hy"
        ? original
        : ATTR[original][lang === "ru" ? 0 : 1]
    );
  }
}

function applyLanguage(lang) {

  document.documentElement.lang = lang;
  localStorage.setItem(KEY, lang);

  /*
   * HEADER
   */
  document.querySelectorAll("nav a").forEach(setText);

  setText(document.getElementById("friends-menu-btn"), lang);
  setText(document.querySelector(".friends-menu-title"), lang);
  setText(document.getElementById("account-open-btn"), lang);
  setText(document.getElementById("user-settings-menu"), lang);
  setText(document.getElementById("admin-menu-btn"), lang);
  setText(document.getElementById("header-logout-btn"), lang);

  document.querySelectorAll(".friend-notify-title")
    .forEach(x => setText(x, lang));

  document.querySelectorAll(".loading-text")
    .forEach(x => setText(x, lang));

  /*
   * HERO
   */
  setText(document.getElementById("arm-weather"), lang);

  document.querySelector(".hero p") &&
    setText(document.querySelector(".hero p"), lang);

  setText(document.getElementById("pwa-install-btn"), lang);

  document.querySelectorAll(".buttons > *")
    .forEach(x => setText(x, lang));

  /*
   * SECTIONS
   */
  document.querySelectorAll("#clan .section-title small")
    .forEach(x => setText(x, lang));

  document.querySelectorAll("#clan .section-title h2")
    .forEach(x => setText(x, lang));

  document.querySelectorAll("#clan .card h3, #clan .card p")
    .forEach(x => setText(x, lang));

  document.querySelectorAll("#clan .stat span")
    .forEach(x => setText(x, lang));

  document.querySelectorAll("#players .section-title small, #players .section-title h2")
    .forEach(x => setText(x, lang));

  document.querySelectorAll("#achievements .section-title small, #achievements .section-title h2")
    .forEach(x => setText(x, lang));

  document.querySelectorAll(".achievement h3, .achievement p")
    .forEach(x => setText(x, lang));

  document.querySelectorAll("#gallery .section-title small, #gallery .section-title h2")
    .forEach(x => setText(x, lang));

  document.querySelectorAll(".gallery-placeholder")
    .forEach(x => setText(x, lang));

  document.querySelectorAll(".gallery-upload-label")
    .forEach(x => {
      if (x.childNodes[0]) {
        if (!x.dataset.arText) {
          x.dataset.arText = x.childNodes[0].nodeValue;
        }
        x.childNodes[0].nodeValue =
          tr(x.dataset.arText, lang);
      }
    });

  document.querySelectorAll(".gallery-upload-btn, .gallery-delete-btn")
    .forEach(x => setText(x, lang));

  document.querySelectorAll(".comments-title")
    .forEach(x => setText(x, lang));

  document.querySelectorAll("#auth-vote .section-title h2")
    .forEach(x => setText(x, lang));

  document.querySelectorAll(".community-card h3")
    .forEach(x => setText(x, lang));

  document.querySelectorAll(".community-help")
    .forEach(x => setText(x, lang));

  setText(document.getElementById("vote-btn"), lang);
  setText(document.getElementById("vote-total"), lang);

  /*
   * CONTACT
   */
  document.querySelectorAll("#contact .section-title small, #contact .section-title h2")
    .forEach(x => setText(x, lang));

  document.querySelectorAll("#contact > .container > p")
    .forEach(x => setText(x, lang));

  setText(document.querySelector("#contact-form button"), lang);

  /*
   * PRIVATE CHAT
   */
  setText(document.getElementById("private-chat-fab"), lang);
  setText(document.getElementById("private-messages")?.querySelector(".loading-text"), lang);
  setText(document.getElementById("voice-recording-status"), lang);

  const input = document.getElementById("private-input");

  if (input) {
    input.placeholder =
      lang === "hy"
        ? "Գրեք հաղորդագրություն..."
        : lang === "ru"
          ? "Введите сообщение..."
          : "Write a message...";
  }

  /*
   * GALLERY COMMENT PLACEHOLDERS
   */
  document.querySelectorAll(".comment-input")
    .forEach(x => {
      x.placeholder =
        lang === "hy"
          ? "Մեկնաբանություն..."
          : lang === "ru"
            ? "Комментарий..."
            : "Comment...";
    });

  /*
   * ATTRIBUTES
   */
  document.querySelectorAll("[title]").forEach(x => {
    setAttr(x, "title", lang);
  });

  /*
   * LANGUAGE SELECT
   */
  const select = document.getElementById("aimrelax-language");

  if (select) {
    select.value = lang;
  }
}

function createSelector() {

  if (document.getElementById("aimrelax-language-selector")) {
    return;
  }

  const box = document.createElement("div");

  box.id = "aimrelax-language-selector";

  box.innerHTML = `
    <select id="aimrelax-language">
      <option value="hy">🇦🇲 Հայերեն</option>
      <option value="ru">🇷🇺 Русский</option>
      <option value="en">🇬🇧 English</option>
    </select>
  `;

  const style = document.createElement("style");

  style.textContent = `
    #aimrelax-language-selector{
      position:fixed;
      top:12px;
      right:12px;
      z-index:999999;
    }

    #aimrelax-language{
      background:#111;
      color:#fff;
      border:1px solid #ff7200;
      border-radius:7px;
      padding:8px 11px;
      font-size:13px;
      font-weight:700;
      cursor:pointer;
      outline:none;
    }

    #aimrelax-language:hover{
      border-color:#fff;
    }

    @media(max-width:600px){
      #aimrelax-language-selector{
        top:8px;
        right:8px;
      }

      #aimrelax-language{
        padding:7px 8px;
        font-size:12px;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(box);

  document.getElementById("aimrelax-language")
    .addEventListener("change", function () {
      applyLanguage(this.value);
    });
}

function init() {

  createSelector();

  /*
   * Կարևոր.
   * Այստեղ այլևս MutationObserver չկա։
   */
  applyLanguage(getLang());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.AIMRELAX_LANGUAGE = {
  setLanguage: applyLanguage,
  getLanguage: getLang
};

})();
