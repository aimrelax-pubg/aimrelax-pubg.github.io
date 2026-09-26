(function () {
    "use strict";

    const STORAGE_KEY = "aimrelax_language";

    const LANGUAGES = {
        hy: "🇦🇲 Հայերեն",
        ru: "🇷🇺 Русский",
        en: "🇬🇧 English"
    };

    /*
     * ============================================================
     * AIMRELAX-PUBG LANGUAGE SYSTEM
     * Safe UI-only translator
     * ============================================================
     *
     * IMPORTANT:
     * - Does NOT use MutationObserver
     * - Does NOT translate user messages
     * - Does NOT translate nicknames
     * - Does NOT modify Supabase data
     * - Does NOT modify notification routing
     * - Does NOT scan/rewrite the whole document repeatedly
     */

    const T = {

        /* =========================
           NAVIGATION
        ========================= */

        "Գլխավոր": {
            ru: "Главная",
            en: "Home"
        },

        "Գլխավոր էջ": {
            ru: "Главная",
            en: "Home"
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

        "Մեդիա": {
            ru: "Медиа",
            en: "Media"
        },

        "Նկարներ": {
            ru: "Фотографии",
            en: "Photos"
        },

        "Քվեարկություն": {
            ru: "Голосование",
            en: "Voting"
        },

        "Կապ": {
            ru: "Контакты",
            en: "Contact"
        },

        "Համայնք": {
            ru: "Сообщество",
            en: "Community"
        },

        "Կլան": {
            ru: "Клан",
            en: "Clan"
        },

        "Պրոֆիլ": {
            ru: "Профиль",
            en: "Profile"
        },

        "Կարգավորումներ": {
            ru: "Настройки",
            en: "Settings"
        },

        "Դուրս գալ": {
            ru: "Выйти",
            en: "Logout"
        },

        "ԵԼՔ": {
            ru: "ВЫЙТИ",
            en: "LOGOUT"
        },

        "Մուտք": {
            ru: "Войти",
            en: "Login"
        },

        "ՄՈՒՏՔ / ԳՐԱՆՑՈՒՄ": {
            ru: "ВХОД / РЕГИСТРАЦИЯ",
            en: "LOGIN / REGISTER"
        },

        "Գրանցվել": {
            ru: "Регистрация",
            en: "Register"
        },

        "Ադմին պանել": {
            ru: "Админ-панель",
            en: "Admin panel"
        },

        "🛡️ Ադմին պանել": {
            ru: "🛡️ Админ-панель",
            en: "🛡️ Admin panel"
        },


        /* =========================
           HERO / MAIN PAGE
        ========================= */

        "ՊԱՇՏՈՆԱԿԱՆ ԿԼԱՆԱՅԻՆ ԿԱՅՔ": {
            ru: "ОФИЦИАЛЬНЫЙ САЙТ КЛАНА",
            en: "OFFICIAL CLAN WEBSITE"
        },

        "ԲԱՐԻ ԳԱԼՈՒՍՏ AIMRELAX ՊԱՇՏՈՆԱԿԱՆ ԿԼԱՆ": {
            ru: "ДОБРО ПОЖАЛОВАТЬ НА ОФИЦИАЛЬНЫЙ САЙТ КЛАНА AIMRELAX",
            en: "WELCOME TO THE OFFICIAL AIMRELAX CLAN WEBSITE"
        },

        "ԽԱՂԱ • ԳԵՐԻՇԽԻՐ • ԿՐԿԻՆ ՀԱՂԹԻՐ": {
            ru: "ИГРАЙ • ДОМИНИРУЙ • ПОБЕЖДАЙ СНОВА",
            en: "PLAY • DOMINATE • WIN AGAIN"
        },

        "ՄԻԱՆԱԼ AIMRELAX-ԻՆ": {
            ru: "ПРИСОЕДИНИТЬСЯ К AIMRELAX",
            en: "JOIN AIMRELAX"
        },

        "ՄԻԱՆԱԼ ԿԼԱՆԻՆ": {
            ru: "ПРИСОЕДИНИТЬСЯ К КЛАНУ",
            en: "JOIN THE CLAN"
        },

        "Միանալ Կլանին": {
            ru: "Присоединиться к клану",
            en: "Join the Clan"
        },

        "📲 ՆԵՐԲԵՌՆԵԼ ՀԱՎԵԼՎԱԾԸ": {
            ru: "📲 СКАЧАТЬ ПРИЛОЖЕНИЕ",
            en: "📲 DOWNLOAD APP"
        },

        "ՄԵՐ ՍՈՑ. ԷՋԵՐԸ": {
            ru: "НАШИ СОЦИАЛЬНЫЕ СТРАНИЦЫ",
            en: "OUR SOCIAL PAGES"
        },


        /* =========================
           SECTIONS
        ========================= */

        "Ով ենք մենք": {
            ru: "Кто мы",
            en: "Who we are"
        },

        "Կլանի Մասին": {
            ru: "О клане",
            en: "About the Clan"
        },

        "Մեր նպատակը": {
            ru: "Наша цель",
            en: "Our Goal"
        },

        "Մեր Թիմը": {
            ru: "Наша команда",
            en: "Our Team"
        },

        "Մեր Ուղին": {
            ru: "Наш путь",
            en: "Our Journey"
        },

        "Մեր Խաղացողները": {
            ru: "Наши игроки",
            en: "Our Players"
        },

        "Ձեռքբերումներ": {
            ru: "Достижения",
            en: "Achievements"
        },

        "Հաղթանակներ": {
            ru: "Победы",
            en: "Victories"
        },

        "ԼԱՎԱԳՈՒՅՆ ՖՐԱԳԵՐ": {
            ru: "ЛУЧШИЕ ФРАГИ",
            en: "BEST FRAGS"
        },

        "ՇՈՒՏՈՎ": {
            ru: "СКОРО",
            en: "COMING SOON"
        },

        "Հիմնադրվել է": {
            ru: "Основан",
            en: "Founded"
        },

        "Խաղացողներ": {
            ru: "Игроки",
            en: "Players"
        },

        "Մրցաշարեր": {
            ru: "Турниры",
            en: "Tournaments"
        },

        "Երկիր": {
            ru: "Страна",
            en: "Country"
        },


        /* =========================
           BUTTONS
        ========================= */

        "🗳 Քվեարկություն": {
            ru: "🗳 Голосование",
            en: "🗳 Voting"
        },

        "ՔՎԵԱՐԿԵԼ": {
            ru: "ГОЛОСОВАТЬ",
            en: "VOTE"
        },

        "Քվեարկել": {
            ru: "Голосовать",
            en: "Vote"
        },

        "ԿԱՊ ՀԱՍՏԱՏԵԼ": {
            ru: "СВЯЗАТЬСЯ С НАМИ",
            en: "CONTACT US"
        },

        "ՈՒՂԱՐԿԵԼ ՆԱՄԱԿԸ": {
            ru: "ОТПРАВИТЬ СООБЩЕНИЕ",
            en: "SEND MESSAGE"
        },

        "Պահպանել": {
            ru: "Сохранить",
            en: "Save"
        },

        "Ջնջել": {
            ru: "Удалить",
            en: "Delete"
        },

        "Բացել": {
            ru: "Открыть",
            en: "Open"
        },

        "Փակել": {
            ru: "Закрыть",
            en: "Close"
        },

        "Չեղարկել": {
            ru: "Отменить",
            en: "Cancel"
        },

        "Հաստատել": {
            ru: "Подтвердить",
            en: "Confirm"
        },

        "Այո": {
            ru: "Да",
            en: "Yes"
        },

        "Ոչ": {
            ru: "Нет",
            en: "No"
        },

        "Փնտրել": {
            ru: "Поиск",
            en: "Search"
        },

        "Բեռնել": {
            ru: "Загрузить",
            en: "Load"
        },

        "Սպասեք...": {
            ru: "Подождите...",
            en: "Please wait..."
        },

        "Ավելացնել": {
            ru: "Добавить",
            en: "Add"
        },

        "⬆️ Ավելացնել": {
            ru: "⬆️ Добавить",
            en: "⬆️ Add"
        },

        "🗑️ Ջնջել": {
            ru: "🗑️ Удалить",
            en: "🗑️ Delete"
        },


        /* =========================
           MEDIA
        ========================= */

        "📷 Նկար ընտրել": {
            ru: "📷 Выбрать изображение",
            en: "📷 Choose image"
        },

        "🎬 Վիդեոներ և նկարներ": {
            ru: "🎬 Видео и фотографии",
            en: "🎬 Videos and Photos"
        },

        "💬 Մեկնաբանություններ": {
            ru: "💬 Комментарии",
            en: "💬 Comments"
        },

        "Մեկնաբանություն...": {
            ru: "Комментарий...",
            en: "Comment..."
        },

        "Մեկնաբանել": {
            ru: "Прокомментировать",
            en: "Comment"
        },


        /* =========================
           PLAYERS / CLAN
        ========================= */

        "Խաղացողները բեռնվում են...": {
            ru: "Игроки загружаются...",
            en: "Loading players..."
        },

        "Խաղացողներ բեռնվում են...": {
            ru: "Игроки загружаются...",
            en: "Loading players..."
        },

        "Ընկերներ": {
            ru: "Друзья",
            en: "Friends"
        },

        "👥 Ընկերներ": {
            ru: "👥 Друзья",
            en: "👥 Friends"
        },

        "👥 Իմ ընկերները": {
            ru: "👥 Мои друзья",
            en: "👥 My Friends"
        },

        "⭐ Իմ ընկերները": {
            ru: "⭐ Мои друзья",
            en: "⭐ My Friends"
        },

        "📨 Ուղարկված / ստացված հայտեր": {
            ru: "📨 Отправленные / полученные заявки",
            en: "📨 Sent / received requests"
        },

        "Ընկերության հայտեր": {
            ru: "Заявки в друзья",
            en: "Friend Requests"
        },

        "Ուղարկել հայտ": {
            ru: "Отправить заявку",
            en: "Send Request"
        },

        "Ընդունել": {
            ru: "Принять",
            en: "Accept"
        },

        "Մերժել": {
            ru: "Отклонить",
            en: "Decline"
        },

        "Հեռացնել ընկերներից": {
            ru: "Удалить из друзей",
            en: "Remove Friend"
        },


        /* =========================
           AUTH
        ========================= */

        "Մուտք գործեք": {
            ru: "Войдите",
            en: "Log in"
        },

        "Էլ․ փոստ": {
            ru: "Электронная почта",
            en: "Email"
        },

        "Ձեր E-mail": {
            ru: "Ваш E-mail",
            en: "Your E-mail"
        },

        "Գաղտնաբառ": {
            ru: "Пароль",
            en: "Password"
        },

        "Վերականգնել գաղտնաբառը": {
            ru: "Восстановить пароль",
            en: "Reset password"
        },

        "Հաստատել գաղտնաբառը": {
            ru: "Подтвердить пароль",
            en: "Confirm password"
        },

        "Մուտք գործել": {
            ru: "Войти",
            en: "Login"
        },

        "Գրանցում": {
            ru: "Регистрация",
            en: "Registration"
        },

        "Գրանցվել": {
            ru: "Зарегистрироваться",
            en: "Register"
        },

        "Դուրս գալ": {
            ru: "Выйти",
            en: "Logout"
        },


        /* =========================
           CONTACT
        ========================= */

        "Ձեր նամակը": {
            ru: "Ваше сообщение",
            en: "Your message"
        },

        "Ուղարկել": {
            ru: "Отправить",
            en: "Send"
        },

        "Հետադարձ Կապ": {
            ru: "Обратная связь",
            en: "Contact Us"
        },

        "Հետադարձ կապ": {
            ru: "Обратная связь",
            en: "Contact Us"
        },


        /* =========================
           CHAT
        ========================= */

        "💬 Չատ": {
            ru: "💬 Чат",
            en: "💬 Chat"
        },

        "💬 Անձնական Chat": {
            ru: "💬 Личный чат",
            en: "💬 Private Chat"
        },

        "Գրեք հաղորդագրություն...": {
            ru: "Введите сообщение...",
            en: "Write a message..."
        },

        "Ուղարկել հաղորդագրություն": {
            ru: "Отправить сообщение",
            en: "Send message"
        },

        "Օնլայն": {
            ru: "Онлайн",
            en: "Online"
        },

        "Օֆլայն": {
            ru: "Офлайн",
            en: "Offline"
        },

        "Վերջին այցելություն": {
            ru: "Последний визит",
            en: "Last seen"
        },

        "Գրում է...": {
            ru: "Печатает...",
            en: "Typing..."
        },

        "Ձայնագրում...": {
            ru: "Запись...",
            en: "Recording..."
        },

        "Չեղարկել ձայնագրությունը": {
            ru: "Отменить запись",
            en: "Cancel recording"
        },


        /* =========================
           NOTIFICATIONS
        ========================= */

        "Ծանուցումներ": {
            ru: "Уведомления",
            en: "Notifications"
        },

        "Նոր հաղորդագրություն": {
            ru: "Новое сообщение",
            en: "New message"
        },

        "Նոր ծանուցում": {
            ru: "Новое уведомление",
            en: "New notification"
        },

        "Դուք ունեք նոր հաղորդագրություն": {
            ru: "У вас новое сообщение",
            en: "You have a new message"
        },


        /* =========================
           WEATHER
        ========================= */

        "🇦🇲 Հայաստան": {
            ru: "🇦🇲 Армения",
            en: "🇦🇲 Armenia"
        },

        "Եղանակը բեռնվում է...": {
            ru: "Загрузка погоды...",
            en: "Loading weather..."
        },

        "☀️ Պարզ": {
            ru: "☀️ Ясно",
            en: "☀️ Clear"
        },

        "🌤️ Մասամբ ամպամած": {
            ru: "🌤️ Переменная облачность",
            en: "🌤️ Partly cloudy"
        },

        "☁️ Ամպամած": {
            ru: "☁️ Облачно",
            en: "☁️ Cloudy"
        },

        "🌧️ Անձրև": {
            ru: "🌧️ Дождь",
            en: "🌧️ Rain"
        },

        "❄️ Ձյուն": {
            ru: "❄️ Снег",
            en: "❄️ Snow"
        },

        "⛈️ Ամպրոպ": {
            ru: "⛈️ Гроза",
            en: "⛈️ Thunderstorm"
        },


        /* =========================
           1VS1
        ========================= */

        "🎯 1VS1 Bottle": {
            ru: "🎯 1VS1 Bottle",
            en: "🎯 1VS1 Bottle"
        },

        "1VS1": {
            ru: "1VS1",
            en: "1VS1"
        },

        "Մրցաշար": {
            ru: "Турнир",
            en: "Tournament"
        },

        "Մասնակիցներ": {
            ru: "Участники",
            en: "Participants"
        },

        "Հաղթող": {
            ru: "Победитель",
            en: "Winner"
        },

        "Հաստատել մասնակցությունը": {
            ru: "Подтвердить участие",
            en: "Confirm participation"
        },


        /* =========================
           EXAM / QUIZ
        ========================= */

        "📋 Հարցաթերթիկ": {
            ru: "📋 Анкета",
            en: "📋 Questionnaire"
        },

        "🧠 PUBG ՔՆՆՈՒԹՅՈՒՆ": {
            ru: "🧠 ЭКЗАМЕН PUBG",
            en: "🧠 PUBG EXAM"
        },

        "🧠 PUBG ՔՆՆՈՒԹՅԱՆ ԱՐԴՅՈՒՆՔՆԵՐ": {
            ru: "🧠 РЕЗУЛЬТАТЫ ЭКЗАМЕНА PUBG",
            en: "🧠 PUBG EXAM RESULTS"
        },

        "Քննություն": {
            ru: "Экзамен",
            en: "Exam"
        },

        "Արդյունքներ": {
            ru: "Результаты",
            en: "Results"
        },

        "Հարց": {
            ru: "Вопрос",
            en: "Question"
        },

        "Պատասխան": {
            ru: "Ответ",
            en: "Answer"
        },

        "Հաջորդ": {
            ru: "Далее",
            en: "Next"
        },

        "Նախորդ": {
            ru: "Назад",
            en: "Previous"
        },

        "Ավարտել": {
            ru: "Завершить",
            en: "Finish"
        },

        "Սկսել": {
            ru: "Начать",
            en: "Start"
        },


        /* =========================
           APPLICATIONS
        ========================= */

        "Կլանի հայտ": {
            ru: "Заявка в клан",
            en: "Clan Application"
        },

        "Կլանի հայտեր": {
            ru: "Заявки в клан",
            en: "Clan Applications"
        },

        "Դիմում": {
            ru: "Заявка",
            en: "Application"
        },

        "Դիմումները բեռնվում են...": {
            ru: "Заявки загружаются...",
            en: "Loading applications..."
        },

        "Ընդունել հայտը": {
            ru: "Принять заявку",
            en: "Accept application"
        },

        "Մերժել հայտը": {
            ru: "Отклонить заявку",
            en: "Reject application"
        },


        /* =========================
           VALIDATION
        ========================= */

        "Խնդրում ենք գրել ձեր PUBG անունը": {
            ru: "Пожалуйста, введите ваш PUBG никнейм",
            en: "Please enter your PUBG nickname"
        },

        "Խնդրում ենք գրել ձեր էլ․ փոստը": {
            ru: "Пожалуйста, введите ваш email",
            en: "Please enter your email"
        },

        "Խնդրում ենք գրել ձեր հաղորդագրությունը": {
            ru: "Пожалуйста, напишите сообщение",
            en: "Please enter your message"
        },

        "Լրացրեք բոլոր դաշտերը": {
            ru: "Заполните все поля",
            en: "Fill in all fields"
        },

        "Սխալ": {
            ru: "Ошибка",
            en: "Error"
        },

        "Հաջողությամբ": {
            ru: "Успешно",
            en: "Success"
        },

        "Պատրաստ է": {
            ru: "Готово",
            en: "Done"
        },

        "Բեռնվում է...": {
            ru: "Загрузка...",
            en: "Loading..."
        },

        "Խնդրում ենք սպասել...": {
            ru: "Пожалуйста, подождите...",
            en: "Please wait..."
        },


        /* =========================
           COMMUNITY
        ========================= */

        "Համայնք": {
            ru: "Сообщество",
            en: "Community"
        },

        "Համայնքի անդամներ": {
            ru: "Участники сообщества",
            en: "Community Members"
        },

        "Ընկերների ցուցակ": {
            ru: "Список друзей",
            en: "Friends List"
        },

        "Որոնել խաղացող": {
            ru: "Найти игрока",
            en: "Find player"
        },

        "Ուղարկված հայտեր": {
            ru: "Отправленные заявки",
            en: "Sent Requests"
        },

        "Ստացված հայտեր": {
            ru: "Полученные заявки",
            en: "Received Requests"
        },


        /* =========================
           SETTINGS
        ========================= */

        "⚙️ Կարգավորումներ": {
            ru: "⚙️ Настройки",
            en: "⚙️ Settings"
        },

        "Կարգավորումներ": {
            ru: "Настройки",
            en: "Settings"
        },

        "Պահպանել փոփոխությունները": {
            ru: "Сохранить изменения",
            en: "Save changes"
        },

        "Փոփոխությունները պահպանված են": {
            ru: "Изменения сохранены",
            en: "Changes saved"
        },


        /* =========================
           GENERAL
        ========================= */

        "Մեր նպատակը": {
            ru: "Наша цель",
            en: "Our Goal"
        },

        "Մեր ճանապարհը": {
            ru: "Наш путь",
            en: "Our Journey"
        },

        "Շնորհակալություն": {
            ru: "Спасибо",
            en: "Thank you"
        },

        "Բարի գալուստ": {
            ru: "Добро пожаловать",
            en: "Welcome"
        },

        "Այստեղ դեռ ոչինչ չկա": {
            ru: "Здесь пока ничего нет",
            en: "Nothing here yet"
        },

        "Ոչ մի արդյունք": {
            ru: "Нет результатов",
            en: "No results"
        }
    };


    /* ============================================================
       LANGUAGE HELPERS
       ============================================================ */

    function getLanguage() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (LANGUAGES[saved]) {
            return saved;
        }

        return "hy";
    }


    function saveLanguage(lang) {
        if (!LANGUAGES[lang]) {
            lang = "hy";
        }

        localStorage.setItem(STORAGE_KEY, lang);
    }


    function normalizeText(text) {
        return String(text || "")
            .replace(/\s+/g, " ")
            .trim();
    }


    function translateText(text, lang) {

        if (!text) {
            return text;
        }

        const normalized = normalizeText(text);

        if (!T[normalized]) {
            return text;
        }

        if (lang === "hy") {
            return T[normalized].hy || normalized;
        }

        return T[normalized][lang] || text;
    }


    /*
     * Save original UI text.
     * WeakMap prevents modification of application/user data.
     */

    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();


    function translateElementText(element, lang) {

        if (!element) {
            return;
        }

        /*
         * Ignore dangerous / user-content areas.
         */

        if (
            element.closest(
                "script,style,noscript,textarea," +
                "input,[contenteditable='true']," +
                ".chat-message," +
                ".private-message," +
                ".comment-row," +
                ".friend-row," +
                ".player," +
                ".profile-name," +
                ".user-box," +
                ".vote-row"
            )
        ) {
            return;
        }


        /*
         * Only direct text nodes.
         */

        Array.from(element.childNodes).forEach(function (node) {

            if (node.nodeType !== Node.TEXT_NODE) {
                return;
            }

            const source =
                originalText.has(node)
                    ? originalText.get(node)
                    : node.nodeValue;

            if (!originalText.has(node)) {
                originalText.set(node, node.nodeValue);
            }

            const translated =
                translateText(source, lang);

            if (translated !== source) {
                node.nodeValue = translated;
            } else if (lang === "hy") {
                node.nodeValue = source;
            }
        });
    }


    /*
     * Translate ONLY known static UI elements.
     * No full-document rewriting.
     */

    function translateUI(lang) {

        const selectors = [

            "nav a",
            "nav button",

            ".btn",
            ".buttons a",
            ".buttons button",

            ".section-title",
            ".section-title small",
            ".section-title h2",

            ".card h3",
            ".achievement h3",
            ".achievement p",

            ".gallery-item",

            ".social",

            ".account-open-btn",
            ".account-tabs button",
            ".account-modal-card button",

            ".friends-menu-btn",
            ".friends-menu-title",
            ".friends-menu-popup h4",

            ".private-chat-fab",
            ".private-chat-head button",
            ".voice-record-btn",
            ".voice-cancel-btn",

            ".auth-card h3",
            ".auth-card button",
            ".auth-link",

            ".vote-card h3",
            ".vote-card button",

            ".community-help",

            ".loading-text",

            "#pwa-install-btn",

            "#contact-form button",

            "#private-messages",

            "#voice-recording-status"
        ];


        document.querySelectorAll(
            selectors.join(",")
        ).forEach(function (element) {

            translateElementText(element, lang);

        });


        /*
         * Specific IDs.
         */

        const ids = [

            "friends-menu-btn",
            "account-open-btn",
            "admin-menu-btn",
            "header-logout-btn",

            "clan",
            "players",
            "achievements",
            "gallery",
            "auth-vote",

            "vote-btn",
            "vote-total",

            "private-chat-fab",
            "private-messages",

            "arm-weather"
        ];


        ids.forEach(function (id) {

            const element =
                document.getElementById(id);

            if (element) {
                translateElementText(element, lang);
            }

        });
    }


    /* ============================================================
       ATTRIBUTES
       ============================================================ */

    function translateAttributes(lang) {

        const attributes = [
            "placeholder",
            "title",
            "aria-label"
        ];

        document.querySelectorAll(
            "input,textarea,button,[title],[aria-label]"
        ).forEach(function (element) {

            /*
             * Never touch user-entered input values.
             */

            if (
                element.closest(
                    "#aimrelax-language-selector"
                )
            ) {
                return;
            }


            attributes.forEach(function (attribute) {

                if (!element.hasAttribute(attribute)) {
                    return;
                }

                if (!originalAttributes.has(element)) {
                    originalAttributes.set(
                        element,
                        {}
                    );
                }

                const saved =
                    originalAttributes.get(element);


                if (
                    !Object.prototype.hasOwnProperty.call(
                        saved,
                        attribute
                    )
                ) {
                    saved[attribute] =
                        element.getAttribute(attribute);
                }


                const original =
                    saved[attribute];

                const translated =
                    translateText(original, lang);


                element.setAttribute(
                    attribute,
                    translated
                );

            });

        });
    }


    /* ============================================================
       SELECTOR
       ============================================================ */

    function createSelector() {

        if (
            document.getElementById(
                "aimrelax-language-selector"
            )
        ) {
            return;
        }


        const wrapper =
            document.createElement("div");

        wrapper.id =
            "aimrelax-language-selector";


        wrapper.innerHTML = `
            <select id="aimrelax-language" aria-label="Language">
                <option value="hy">🇦🇲 Հայերեն</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="en">🇬🇧 English</option>
            </select>
        `;


        const style =
            document.createElement("style");

        style.textContent = `

            #aimrelax-language-selector {
                position: fixed;
                top: 12px;
                right: 12px;
                z-index: 999999;
            }

            #aimrelax-language {
                background: #111;
                color: #fff;
                border: 1px solid #ff7200;
                border-radius: 7px;
                padding: 8px 11px;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                outline: none;
                box-shadow: 0 4px 15px rgba(0,0,0,.35);
            }

            #aimrelax-language:hover {
                border-color: #fff;
            }

            #aimrelax-language:focus {
                border-color: #ff7200;
            }

            @media (max-width: 650px) {

                #aimrelax-language-selector {
                    top: 7px;
                    right: 7px;
                }

                #aimrelax-language {
                    padding: 7px 8px;
                    font-size: 11px;
                }
            }
        `;


        document.head.appendChild(style);

        document.body.appendChild(wrapper);


        const select =
            document.getElementById(
                "aimrelax-language"
            );


        select.value = getLanguage();


        select.addEventListener(
            "change",
            function () {

                setLanguage(
                    this.value
                );

            }
        );
    }


    /* ============================================================
       MAIN LANGUAGE FUNCTION
       ============================================================ */

    function setLanguage(lang) {

        if (!LANGUAGES[lang]) {
            lang = "hy";
        }


        saveLanguage(lang);


        document.documentElement.lang =
            lang;


        /*
         * IMPORTANT:
         * Only one controlled UI pass.
         * No MutationObserver.
         */

        translateUI(lang);

        translateAttributes(lang);


        const select =
            document.getElementById(
                "aimrelax-language"
            );


        if (select) {
            select.value = lang;
        }


        /*
         * Let other AIMRELAX scripts know
         * that the language changed.
         */

        window.dispatchEvent(
            new CustomEvent(
                "aimrelax-language-changed",
                {
                    detail: {
                        language: lang
                    }
                }
            )
        );
    }


    /* ============================================================
       PUBLIC API
       ============================================================ */

    window.AIMRELAX_LANGUAGE = {

        setLanguage: setLanguage,

        getLanguage: getLanguage,

        languages: LANGUAGES,

        translations: T,

        translate: function (text, lang) {

            return translateText(
                text,
                lang || getLanguage()
            );

        }
    };


    /* ============================================================
       INIT
       ============================================================ */

    function init() {

        try {

            createSelector();

            const language =
                getLanguage();

            setLanguage(language);

        } catch (error) {

            /*
             * Language system must NEVER
             * break the main website.
             */

            console.error(
                "AIMRELAX language system error:",
                error
            );

        }
    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();

    }

})();
