/* =========================================================
   AIMRELAX-PUBG
   GLOBAL LANGUAGE SYSTEM
   Armenian / Russian / English

   Supported:
   index.html
   1vs1.html
   clan-applications.html
   exam.html
   exam-admin.html
   media.html
   quiz.html

   DO NOT add this file to sw.js
   ========================================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "aimrelax_language";

  const LANGUAGES = {
    hy: "🇦🇲 Հայերեն",
    ru: "🇷🇺 Русский",
    en: "🇬🇧 English"
  };

  /*
   * Armenian is the original/base language of the website.
   * The script remembers the original Armenian text and translates
   * only known UI strings.
   */

  const T = {

    /* =========================
       GENERAL
       ========================= */

    "Մուտք": {
      ru: "Вход",
      en: "Login"
    },

    "ՄՈՒՏՔ": {
      ru: "ВХОД",
      en: "LOGIN"
    },

    "Մուտք գործել": {
      ru: "Войти",
      en: "Log in"
    },

    "ՄՈՒՏՔ ԳՈՐԾԵԼ": {
      ru: "ВОЙТИ",
      en: "LOG IN"
    },

    "Գրանցում": {
      ru: "Регистрация",
      en: "Registration"
    },

    "ԳՐԱՆՑՈՒՄ": {
      ru: "РЕГИСТРАЦИЯ",
      en: "REGISTRATION"
    },

    "Գրանցվել": {
      ru: "Зарегистрироваться",
      en: "Register"
    },

    "ԳՐԱՆՑՎԵԼ": {
      ru: "ЗАРЕГИСТРИРОВАТЬСЯ",
      en: "REGISTER"
    },

    "Ելք": {
      ru: "Выход",
      en: "Logout"
    },

    "ԵԼՔ ՀԱՇՎԻՑ": {
      ru: "ВЫЙТИ ИЗ АККАУНТА",
      en: "LOG OUT"
    },

    "Պահպանել": {
      ru: "Сохранить",
      en: "Save"
    },

    "ՊԱՀՊԱՆԵԼ ՓՈՓՈԽՈՒԹՅՈՒՆՆԵՐԸ": {
      ru: "СОХРАНИТЬ ИЗМЕНЕНИЯ",
      en: "SAVE CHANGES"
    },

    "Չեղարկել": {
      ru: "Отмена",
      en: "Cancel"
    },

    "Փակել": {
      ru: "Закрыть",
      en: "Close"
    },

    "Հաստատել": {
      ru: "Подтвердить",
      en: "Confirm"
    },

    "Ջնջել": {
      ru: "Удалить",
      en: "Delete"
    },

    "Հեռացնել": {
      ru: "Удалить",
      en: "Remove"
    },

    "Ընդունել": {
      ru: "Принять",
      en: "Accept"
    },

    "Մերժել": {
      ru: "Отклонить",
      en: "Reject"
    },

    "Ուղարկել": {
      ru: "Отправить",
      en: "Send"
    },

    "Բեռնել": {
      ru: "Загрузить",
      en: "Load"
    },

    "Որոնել": {
      ru: "Поиск",
      en: "Search"
    },

    "Կարգավորումներ": {
      ru: "Настройки",
      en: "Settings"
    },

    "⚙️ Կարգավորումներ": {
      ru: "⚙️ Настройки",
      en: "⚙️ Settings"
    },


    /* =========================
       ACCOUNT
       ========================= */

    "🔐 Մուտք": {
      ru: "🔐 Вход",
      en: "🔐 Login"
    },

    "👤 Ստեղծել հաշիվ": {
      ru: "👤 Создать аккаунт",
      en: "👤 Create account"
    },

    "🔄 Վերականգնել գաղտնաբառը": {
      ru: "🔄 Восстановить пароль",
      en: "🔄 Reset password"
    },

    "👤 Իմ հաշիվը": {
      ru: "👤 Мой аккаунт",
      en: "👤 My account"
    },

    "Ձեր E-mail": {
      ru: "Ваш E-mail",
      en: "Your E-mail"
    },

    "Գաղտնաբառ": {
      ru: "Пароль",
      en: "Password"
    },

    "Գաղտնաբառ (առնվազն 6 նիշ)": {
      ru: "Пароль (минимум 6 символов)",
      en: "Password (minimum 6 characters)"
    },

    "Կրկնել գաղտնաբառը": {
      ru: "Повторите пароль",
      en: "Repeat password"
    },

    "PUBG Nickname": {
      ru: "PUBG Nickname",
      en: "PUBG Nickname"
    },

    "Մոռացե՞լ եք գաղտնաբառը": {
      ru: "Забыли пароль?",
      en: "Forgot your password?"
    },

    "Վերադառնալ մուտք": {
      ru: "Вернуться ко входу",
      en: "Back to login"
    },

    "ՈՒՂԱՐԿԵԼ ՀՂՈՒՄԸ": {
      ru: "ОТПРАВИТЬ ССЫЛКУ",
      en: "SEND LINK"
    },

    "⚙️ Անձնական կարգավորումներ": {
      ru: "⚙️ Личные настройки",
      en: "⚙️ Personal settings"
    },

    "Նոր Nickname": {
      ru: "Новый Nickname",
      en: "New Nickname"
    },

    "Նոր E-mail": {
      ru: "Новый E-mail",
      en: "New E-mail"
    },

    "Ընթացիկ գաղտնաբառ (եթե փոխում եք գաղտնաբառը)": {
      ru: "Текущий пароль (если меняете пароль)",
      en: "Current password (if changing password)"
    },

    "Նոր գաղտնաբառ (ըստ ցանկության)": {
      ru: "Новый пароль (необязательно)",
      en: "New password (optional)"
    },

    "Մուտք եք գործել որպես": {
      ru: "Вы вошли как",
      en: "You are logged in as"
    },

    "Ձեր գրանցումը հաջողությամբ կատարվել է": {
      ru: "Ваша регистрация успешно завершена",
      en: "Your registration was successful"
    },

    "Ձեր E-mail-ը հաստատված է։ Այժմ կարող եք մուտք գործել և մասնակցել քվեարկությանը։": {
      ru: "Ваш E-mail подтверждён. Теперь вы можете войти и участвовать в голосовании.",
      en: "Your E-mail is verified. You can now log in and participate in the voting."
    },

    "Google մուտք": {
      ru: "Вход через Google",
      en: "Google login"
    },

    "🔵 Մուտք Google-ով": {
      ru: "🔵 Войти через Google",
      en: "🔵 Login with Google"
    },


    /* =========================
       FRIENDS / CHAT
       ========================= */

    "Ընկեր": {
      ru: "Друг",
      en: "Friend"
    },

    "👤 Ընկերության հայտեր": {
      ru: "👤 Заявки в друзья",
      en: "👤 Friend requests"
    },

    "Ընկերության հայտ": {
      ru: "Заявка в друзья",
      en: "Friend request"
    },

    "Նոր հայտ չկա։": {
      ru: "Новых заявок нет.",
      en: "No new requests."
    },

    "Դեռ ընկերներ չունեք։": {
      ru: "У вас пока нет друзей.",
      en: "You don't have any friends yet."
    },

    "Նախ մուտք գործեք։": {
      ru: "Сначала войдите.",
      en: "Please log in first."
    },

    "Չգտնվեց։": {
      ru: "Ничего не найдено.",
      en: "Nothing found."
    },

    "+ Ընկեր": {
      ru: "+ Друг",
      en: "+ Friend"
    },

    "🟢 Օնլայն": {
      ru: "🟢 Онлайн",
      en: "🟢 Online"
    },

    "⚪ Օֆլայն": {
      ru: "⚪ Офлайн",
      en: "⚪ Offline"
    },

    "Հեռացնել": {
      ru: "Удалить",
      en: "Remove"
    },

    "CHAT": {
      ru: "ЧАТ",
      en: "CHAT"
    },

    "Դուք": {
      ru: "Вы",
      en: "You"
    },

    "🗑️ Ջնջել": {
      ru: "🗑️ Удалить",
      en: "🗑️ Delete"
    },

    "Անձնական Chat-ի համար նախ ավելացրեք ընկեր։": {
      ru: "Сначала добавьте друга для личного чата.",
      en: "Add a friend first to use private chat."
    },

    "Մուտք գործեք՝ անձնական Chat-ից օգտվելու համար։": {
      ru: "Войдите, чтобы использовать личный чат.",
      en: "Log in to use private chat."
    },

    "Նոր հաղորդագրություն": {
      ru: "Новое сообщение",
      en: "New message"
    },

    "Նոր ծանուցում": {
      ru: "Новое уведомление",
      en: "New notification"
    },


    /* =========================
       NOTIFICATIONS
       ========================= */

    "Ծանուցումներ": {
      ru: "Уведомления",
      en: "Notifications"
    },

    "Ծանուցումները բեռնվում են...": {
      ru: "Уведомления загружаются...",
      en: "Loading notifications..."
    },

    "Կարդացված դարձնել": {
      ru: "Отметить как прочитанные",
      en: "Mark as read"
    },

    "Մուտք գործեք՝ ծանուցումները միացնելու համար։": {
      ru: "Войдите, чтобы включить уведомления.",
      en: "Log in to enable notifications."
    },

    "Նոր ծանուցում": {
      ru: "Новое уведомление",
      en: "New notification"
    },


    /* =========================
       MAIN PAGE
       ========================= */

    "Պաշտոնական կլանային կայք": {
      ru: "Официальный сайт клана",
      en: "Official clan website"
    },

    "Խաղացողներ": {
      ru: "Игроки",
      en: "Players"
    },

    "Քվեարկություն": {
      ru: "Голосование",
      en: "Voting"
    },

    "Ձեռքբերումներ": {
      ru: "Достижения",
      en: "Achievements"
    },

    "Կապ": {
      ru: "Контакты",
      en: "Contact"
    },

    "Մեր մասին": {
      ru: "О нас",
      en: "About us"
    },

    "Խաղացողներ": {
      ru: "Игроки",
      en: "Players"
    },

    "Ձեռքբերումներ": {
      ru: "Достижения",
      en: "Achievements"
    },

    "Պատկերասրահ": {
      ru: "Галерея",
      en: "Gallery"
    },

    "Կապ մեզ հետ": {
      ru: "Связаться с нами",
      en: "Contact us"
    },

    "Դեռևս չկա։": {
      ru: "Пока нет.",
      en: "Not available yet."
    },


    /* =========================
       VOTING
       ========================= */

    "Քվեարկել": {
      ru: "Голосовать",
      en: "Vote"
    },

    "Քվեարկել խաղացողի օգտին": {
      ru: "Проголосовать за игрока",
      en: "Vote for a player"
    },

    "Ձայն": {
      ru: "Голос",
      en: "Vote"
    },

    "Ձայներ": {
      ru: "Голоса",
      en: "Votes"
    },

    "Ընդհանուր ձայներ": {
      ru: "Всего голосов",
      en: "Total votes"
    },


    /* =========================
       1 VS 1
       ========================= */

    "1VS1": {
      ru: "1VS1",
      en: "1VS1"
    },

    "1VS1 փուլ": {
      ru: "Раунд 1VS1",
      en: "1VS1 round"
    },

    "Նոր 1VS1 փուլը ստեղծվեց": {
      ru: "Новый раунд 1VS1 создан",
      en: "New 1VS1 round created"
    },

    "մասնակից": {
      ru: "участников",
      en: "participants"
    },

    "մասնակիցներ": {
      ru: "участников",
      en: "participants"
    },

    "խաղ": {
      ru: "игр",
      en: "games"
    },

    "խաղացող սպասման մեջ": {
      ru: "игрок ожидает",
      en: "player waiting"
    },

    "խաղացող սպասման մեջ։": {
      ru: "игрок ожидает.",
      en: "player waiting."
    },

    "Չհաջողվեց ստեղծել փուլ։": {
      ru: "Не удалось создать раунд.",
      en: "Failed to create round."
    },

    "🎰 ՊՏՏԵԼ ԲՈՒՏԻԼԿԱՆ": {
      ru: "🎰 КРУТИТЬ БУТЫЛКУ",
      en: "🎰 SPIN THE BOTTLE"
    },


    /* =========================
       APPLICATIONS
       ========================= */

    "Դիմումներ": {
      ru: "Заявки",
      en: "Applications"
    },

    "Կլանային դիմումներ": {
      ru: "Заявки в клан",
      en: "Clan applications"
    },

    "Հաստատել դիմումը": {
      ru: "Одобрить заявку",
      en: "Approve application"
    },

    "Մերժել դիմումը": {
      ru: "Отклонить заявку",
      en: "Reject application"
    },

    "Դիմումը հաստատվեց։": {
      ru: "Заявка одобрена.",
      en: "Application approved."
    },

    "Դիմումը մերժվեց։": {
      ru: "Заявка отклонена.",
      en: "Application rejected."
    },


    /* =========================
       EXAM
       ========================= */

    "Քննություն": {
      ru: "Экзамен",
      en: "Exam"
    },

    "Քննություն հանձնել": {
      ru: "Пройти экзамен",
      en: "Take the exam"
    },

    "Սկսել քննությունը": {
      ru: "Начать экзамен",
      en: "Start exam"
    },

    "Ավարտել քննությունը": {
      ru: "Завершить экзамен",
      en: "Finish exam"
    },

    "Չհաջողվեց ավարտել քննությունը։": {
      ru: "Не удалось завершить экзамен.",
      en: "Failed to finish the exam."
    },

    "Արդյունք": {
      ru: "Результат",
      en: "Result"
    },

    "Արդյունքները": {
      ru: "Результаты",
      en: "Results"
    },

    "Ճիշտ պատասխան": {
      ru: "Правильный ответ",
      en: "Correct answer"
    },

    "Ճիշտ պատասխաններ": {
      ru: "Правильные ответы",
      en: "Correct answers"
    },

    "Սխալ պատասխան": {
      ru: "Неправильный ответ",
      en: "Incorrect answer"
    },

    "Հաջողությամբ": {
      ru: "Успешно",
      en: "Successfully"
    },

    "Քննությունը ավարտված է": {
      ru: "Экзамен завершён",
      en: "Exam completed"
    },


    /* =========================
       MEDIA
       ========================= */

    "🎬 Վիդեոներ և նկարներ": {
      ru: "🎬 Видео и фотографии",
      en: "🎬 Videos and photos"
    },

    "Նյութերը հրապարակվում են միայն Owner/Admin-ի հաստատումից հետո։": {
      ru: "Материалы публикуются только после одобрения Owner/Admin.",
      en: "Materials are published only after Owner/Admin approval."
    },

    "➕ Ավելացնել նյութ": {
      ru: "➕ Добавить материал",
      en: "➕ Add media"
    },

    "Վերնագիր": {
      ru: "Название",
      en: "Title"
    },

    "Նկար կամ վիդեո": {
      ru: "Фото или видео",
      en: "Image or video"
    },

    "Առավելագույնը 50 MB": {
      ru: "Максимум 50 MB",
      en: "Maximum 50 MB"
    },

    "Նկարագրություն": {
      ru: "Описание",
      en: "Description"
    },

    "📤 Ուղարկել հաստատման": {
      ru: "📤 Отправить на проверку",
      en: "📤 Submit for approval"
    },

    "Չհաջողվեց բեռնել նյութերը։": {
      ru: "Не удалось загрузить материалы.",
      en: "Failed to load media."
    },

    "Հաստատված նյութ դեռ չկա։": {
      ru: "Одобренных материалов пока нет.",
      en: "No approved media yet."
    },

    "Ստուգվում է…": {
      ru: "Проверка…",
      en: "Checking…"
    },

    "👤 Մուտք գործած օգտատեր": {
      ru: "👤 Авторизованный пользователь",
      en: "👤 Logged-in user"
    },

    "🔒 Մուտք գործեք՝ նյութ ավելացնելու համար": {
      ru: "🔒 Войдите, чтобы добавить материал",
      en: "🔒 Log in to add media"
    },


    /* =========================
       COMMON STATUS
       ========================= */

    "Բեռնվում է...": {
      ru: "Загрузка...",
      en: "Loading..."
    },

    "Բեռնվում է…": {
      ru: "Загрузка…",
      en: "Loading…"
    },

    "Խնդրում ենք սպասել...": {
      ru: "Пожалуйста, подождите...",
      en: "Please wait..."
    },

    "Հաջողությամբ կատարվեց։": {
      ru: "Успешно выполнено.",
      en: "Completed successfully."
    },

    "Փոփոխությունները պահպանվեցին։": {
      ru: "Изменения сохранены.",
      en: "Changes saved."
    },

    "Չհաջողվեց։": {
      ru: "Не удалось.",
      en: "Failed."
    },

    "Սխալ տեղի ունեցավ։": {
      ru: "Произошла ошибка.",
      en: "An error occurred."
    },

    "Նախ մուտք գործեք։": {
      ru: "Сначала войдите.",
      en: "Please log in first."
    }
  };


  /* =========================================================
     EXTRA ATTRIBUTE TRANSLATIONS
     ========================================================= */

  const ATTR_TRANSLATIONS = {

    "Ձեր E-mail": {
      ru: "Ваш E-mail",
      en: "Your E-mail"
    },

    "Գաղտնաբառ": {
      ru: "Пароль",
      en: "Password"
    },

    "Կրկնել գաղտնաբառը": {
      ru: "Повторите пароль",
      en: "Repeat password"
    },

    "Նոր Nickname": {
      ru: "Новый Nickname",
      en: "New Nickname"
    },

    "Նոր E-mail": {
      ru: "Новый E-mail",
      en: "New E-mail"
    },

    "Նոր գաղտնաբառ (ըստ ցանկության)": {
      ru: "Новый пароль (необязательно)",
      en: "New password (optional)"
    }
  };


  /* =========================================================
     LANGUAGE
     ========================================================= */

  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && LANGUAGES[saved]) {
      return saved;
    }

    return "hy";
  }


  let currentLanguage = getLanguage();


  function saveLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }


  function translate(text, lang = currentLanguage) {

    if (!text) {
      return text;
    }

    const clean = String(text).trim();

    if (!clean) {
      return text;
    }

    if (lang === "hy") {
      return clean;
    }

    const item = T[clean];

    if (!item) {
      return text;
    }

    return item[lang] || text;
  }


  /* =========================================================
     TRANSLATE DOM
     ========================================================= */

  const translatedNodes = new WeakMap();


  function shouldIgnoreNode(node) {

    if (!node || !node.parentElement) {
      return true;
    }

    const parent = node.parentElement;

    const tag = parent.tagName?.toLowerCase();

    if (
      tag === "script" ||
      tag === "style" ||
      tag === "noscript" ||
      tag === "textarea"
    ) {
      return true;
    }

    if (
      parent.closest(
        "script,style,noscript,textarea,[data-no-translate],[contenteditable='true']"
      )
    ) {
      return true;
    }

    return false;
  }


  function translateTextNode(node) {

    if (shouldIgnoreNode(node)) {
      return;
    }

    let original = translatedNodes.get(node);

    if (original === undefined) {

      original = node.nodeValue;

      translatedNodes.set(node, original);
    }

    const originalTrimmed = original.trim();

    if (!originalTrimmed) {
      return;
    }

    const translated = translate(originalTrimmed);

    if (translated === originalTrimmed) {
      return;
    }

    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";

    node.nodeValue = leading + translated + trailing;
  }


  function translateAttributes(root = document) {

    const elements = root.querySelectorAll
      ? root.querySelectorAll("input,textarea,button,[title],[aria-label]")
      : [];

    elements.forEach(el => {

      ["placeholder", "title", "aria-label"].forEach(attr => {

        if (!el.hasAttribute(attr)) {
          return;
        }

        const value = el.getAttribute(attr);

        if (!value) {
          return;
        }

        const translated = ATTR_TRANSLATIONS[value] || translate(value);

        if (translated !== value) {
          el.setAttribute(attr, translated);
        }
      });
    });
  }


  function translateDOM(root = document.body) {

    if (!root) {
      return;
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {

          if (shouldIgnoreNode(node)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];

    let node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }

    nodes.forEach(translateTextNode);

    translateAttributes(root);
  }


  /* =========================================================
     DATA-I18N SUPPORT
     ========================================================= */

  function translateMarkedElements(root = document) {

    const elements = root.querySelectorAll
      ? root.querySelectorAll("[data-i18n]")
      : [];

    elements.forEach(el => {

      const key = el.getAttribute("data-i18n");

      if (!key) {
        return;
      }

      const translated = translate(key);

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        if (el.placeholder) {
          el.placeholder = translated;
        }
      } else {
        el.textContent = translated;
      }
    });
  }


  /* =========================================================
     LANGUAGE SELECTOR
     ========================================================= */

  function createLanguageSelector() {

    if (document.getElementById("aimrelax-language-switcher")) {
      return;
    }

    const wrapper = document.createElement("div");

    wrapper.id = "aimrelax-language-switcher";

    wrapper.innerHTML = `
      <button
        id="aimrelax-language-button"
        type="button"
        aria-label="Language"
      >
        ${LANGUAGES[currentLanguage]}
      </button>

      <div id="aimrelax-language-menu">
        <button type="button" data-lang="hy">🇦🇲 Հայերեն</button>
        <button type="button" data-lang="ru">🇷🇺 Русский</button>
        <button type="button" data-lang="en">🇬🇧 English</button>
      </div>
    `;

    document.body.appendChild(wrapper);

    const style = document.createElement("style");

    style.id = "aimrelax-language-style";

    style.textContent = `
      #aimrelax-language-switcher{
        position:fixed;
        right:14px;
        top:14px;
        z-index:999999;
        font-family:Arial,Helvetica,sans-serif;
      }

      #aimrelax-language-button{
        background:#111;
        color:#fff;
        border:1px solid #ff7a00;
        border-radius:7px;
        padding:8px 11px;
        font-size:12px;
        font-weight:700;
        cursor:pointer;
        box-shadow:0 4px 18px rgba(0,0,0,.4);
      }

      #aimrelax-language-button:hover{
        background:#ff7a00;
        color:#000;
      }

      #aimrelax-language-menu{
        display:none;
        position:absolute;
        right:0;
        top:calc(100% + 6px);
        min-width:145px;
        background:#111;
        border:1px solid #333;
        border-radius:8px;
        padding:5px;
        box-shadow:0 8px 25px rgba(0,0,0,.55);
      }

      #aimrelax-language-menu.open{
        display:block;
      }

      #aimrelax-language-menu button{
        width:100%;
        display:block;
        border:0;
        background:transparent;
        color:#fff;
        text-align:left;
        padding:9px 10px;
        border-radius:5px;
        cursor:pointer;
        font-size:13px;
      }

      #aimrelax-language-menu button:hover{
        background:#222;
        color:#ff7a00;
      }

      @media(max-width:650px){
        #aimrelax-language-switcher{
          top:8px;
          right:8px;
        }

        #aimrelax-language-button{
          padding:7px 8px;
          font-size:11px;
        }
      }
    `;

    document.head.appendChild(style);


    const button =
      document.getElementById("aimrelax-language-button");

    const menu =
      document.getElementById("aimrelax-language-menu");


    button.addEventListener("click", event => {

      event.stopPropagation();

      menu.classList.toggle("open");
    });


    menu.querySelectorAll("[data-lang]").forEach(item => {

      item.addEventListener("click", () => {

        const lang = item.dataset.lang;

        setLanguage(lang);

        menu.classList.remove("open");
      });
    });


    document.addEventListener("click", event => {

      if (!wrapper.contains(event.target)) {
        menu.classList.remove("open");
      }
    });
  }


  /* =========================================================
     SET LANGUAGE
     ========================================================= */

  function setLanguage(lang) {

    if (!LANGUAGES[lang]) {
      return;
    }

    currentLanguage = lang;

    saveLanguage(lang);

    document.documentElement.lang = lang;

    /*
     * Rebuild from the original Armenian text.
     * This prevents:
     * Armenian → Russian → English → Russian
     * from breaking translations.
     */

    restoreOriginalText();

    translateDOM();

    translateMarkedElements();

    const button =
      document.getElementById("aimrelax-language-button");

    if (button) {
      button.textContent = LANGUAGES[lang];
    }

    /*
     * Allow existing page JavaScript to react to
     * language changes if needed.
     */

    window.dispatchEvent(
      new CustomEvent("aimrelax-language-changed", {
        detail: {
          language: lang
        }
      })
    );
  }


  /* =========================================================
     RESTORE ORIGINAL TEXT
     ========================================================= */

  function restoreOriginalText() {

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];

    let node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }

    nodes.forEach(node => {

      const original = translatedNodes.get(node);

      if (original !== undefined) {
        node.nodeValue = original;
      }
    });
  }


  /* =========================================================
     DYNAMIC CONTENT
     ========================================================= */

  let observer;


  function startObserver() {

    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver(mutations => {

      for (const mutation of mutations) {

        if (mutation.type === "characterData") {

          translateTextNode(mutation.target);

          continue;
        }


        mutation.addedNodes.forEach(node => {

          if (node.nodeType === Node.TEXT_NODE) {

            translateTextNode(node);

          } else if (node.nodeType === Node.ELEMENT_NODE) {

            translateDOM(node);

            translateMarkedElements(node);
          }
        });
      }
    });


    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.AIMRELAX_LANGUAGE = {

    getLanguage,

    setLanguage,

    translate,

    languages: LANGUAGES,

    translations: T,

    refresh() {

      restoreOriginalText();

      translateDOM();

      translateMarkedElements();
    }
  };


  /* =========================================================
     INIT
     ========================================================= */

  function initLanguageSystem() {

    document.documentElement.lang = currentLanguage;

    createLanguageSelector();

    /*
     * First save original DOM state.
     */
    translateDOM();

    /*
     * Apply selected language.
     */
    setLanguage(currentLanguage);

    /*
     * Watch dynamically created chat/notification/status UI.
     */
    startObserver();
  }


  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initLanguageSystem,
      { once: true }
    );

  } else {

    initLanguageSystem();
  }

})();
