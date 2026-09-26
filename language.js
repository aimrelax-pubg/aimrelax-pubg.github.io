```javascript
/* =========================================================
   AIMRELAX-PUBG
   Multi-language system
   Armenian / Russian / English
   ========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "aimrelax_language";

    const LANGUAGES = {
        hy: {
            name: "Հայերեն",
            flag: "🇦🇲"
        },
        ru: {
            name: "Русский",
            flag: "🇷🇺"
        },
        en: {
            name: "English",
            flag: "🇬🇧"
        }
    };

    /*
     * IMPORTANT:
     * Add translations here using:
     *
     * "Armenian text": {
     *     hy: "Հայերեն",
     *     ru: "Русский",
     *     en: "English"
     * }
     *
     * The system will automatically replace matching
     * visible text and placeholders.
     */

    const T = {

        /* ===== NAVIGATION ===== */

        "Գլխավոր": {
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

        "Մուտք": {
            ru: "Войти",
            en: "Login"
        },

        "Գրանցվել": {
            ru: "Регистрация",
            en: "Register"
        },


        /* ===== HOME ===== */

        "ՊԱՇՏՈՆԱԿԱՆ ԿԼԱՆԱՅԻՆ ԿԱՅՔ": {
            ru: "ОФИЦИАЛЬНЫЙ САЙТ КЛАНА",
            en: "OFFICIAL CLAN WEBSITE"
        },

        "AIMRELAX COMMUNITY": {
            ru: "AIMRELAX COMMUNITY",
            en: "AIMRELAX COMMUNITY"
        },

        "ՄԻԱՆԱԼ AIMRELAX-ԻՆ": {
            ru: "ПРИСОЕДИНИТЬСЯ К AIMRELAX",
            en: "JOIN AIMRELAX"
        },

        "ՄԵՐ ՍՈՑ. ԷՋԵՐԸ": {
            ru: "НАШИ СОЦИАЛЬНЫЕ СТРАНИЦЫ",
            en: "OUR SOCIAL PAGES"
        },


        /* ===== COMMUNITY ===== */

        "🗳 Քվեարկություն": {
            ru: "🗳 Голосование",
            en: "🗳 Voting"
        },

        "Մուտք գործեք և ընտրեք խաղացողին։ Յուրաքանչյուր հաշիվ կարող է քվեարկել միայն մեկ անգամ։": {
            ru: "Войдите в аккаунт и выберите игрока. Каждый аккаунт может проголосовать только один раз.",
            en: "Log in and choose a player. Each account can vote only once."
        },

        "Խաղացողները բեռնվում են...": {
            ru: "Игроки загружаются...",
            en: "Loading players..."
        },

        "ՔՎԵԱՐԿԵԼ": {
            ru: "ГОЛОСОВАТЬ",
            en: "VOTE"
        },

        "Ընդհանուր՝ 0 հոգի": {
            ru: "Всего: 0 человек",
            en: "Total: 0 people"
        },


        /* ===== CONTACT ===== */

        "ԿԱՊ ՀԱՍՏԱՏԵԼ": {
            ru: "СВЯЗАТЬСЯ С НАМИ",
            en: "CONTACT US"
        },

        "ՈՒՂԱՐԿԵԼ ՆԱՄԱԿԸ": {
            ru: "ОТПРАВИТЬ ПИСЬМО",
            en: "SEND MESSAGE"
        },

        "Ձեր E-mail": {
            ru: "Ваш E-mail",
            en: "Your E-mail"
        },

        "Ձեր նամակը": {
            ru: "Ваше сообщение",
            en: "Your message"
        },

        "Նամակը հաջողությամբ ուղարկվեց ✅": {
            ru: "Сообщение успешно отправлено ✅",
            en: "Message sent successfully ✅"
        },

        "Չհաջողվեց ուղարկել նամակը ❌": {
            ru: "Не удалось отправить сообщение ❌",
            en: "Failed to send message ❌"
        },


        /* ===== CHAT ===== */

        "💬 Չատ": {
            ru: "💬 Чат",
            en: "💬 Chat"
        },

        "💬 Անձնական Chat": {
            ru: "💬 Личный чат",
            en: "💬 Private Chat"
        },

        "Բացեք ընկերոջ CHAT-ը՝ զրույցը սկսելու համար։": {
            ru: "Откройте чат с другом, чтобы начать разговор.",
            en: "Open a friend's chat to start a conversation."
        },

        "Մուտք գործեք՝ անձնական Chat-ից օգտվելու համար։": {
            ru: "Войдите, чтобы использовать личный чат.",
            en: "Log in to use the private chat."
        },

        "Չհաջողվեց բեռնել ընկերներին։": {
            ru: "Не удалось загрузить друзей.",
            en: "Failed to load friends."
        },

        "Անձնական Chat-ի համար նախ ավելացրեք ընկեր։": {
            ru: "Сначала добавьте друга для личного чата.",
            en: "Add a friend first to use private chat."
        },

        "Գրեք հաղորդագրություն...": {
            ru: "Введите сообщение...",
            en: "Write a message..."
        },

        "Ձայնագրում է…": {
            ru: "Идёт запись…",
            en: "Recording…"
        },

        "Չեղարկել": {
            ru: "Отменить",
            en: "Cancel"
        },

        "typing…": {
            ru: "печатает…",
            en: "typing…"
        },

        "Օնլայն": {
            ru: "Онлайн",
            en: "Online"
        },

        "Օֆլայն": {
            ru: "Офлайн",
            en: "Offline"
        },

        "վերջին անգամ՝ անհայտ": {
            ru: "последний раз: неизвестно",
            en: "last seen: unknown"
        },

        "Միայն ուղարկողը կարող է ջնջել այս հաղորդագրությունը։": {
            ru: "Только отправитель может удалить это сообщение.",
            en: "Only the sender can delete this message."
        },

        "Ջնջե՞լ հաղորդագրությունը երկուսիդ մոտ։": {
            ru: "Удалить сообщение у обоих?",
            en: "Delete the message for both?"
        },

        "Չհաջողվեց ջնջել։": {
            ru: "Не удалось удалить.",
            en: "Failed to delete."
        },

        "Ջնջվեց երկուսիդ մոտ ✅": {
            ru: "Сообщение удалено у обоих ✅",
            en: "Message deleted for both ✅"
        },

        "Չհաջողվեց բեռնել Chat-ը։": {
            ru: "Не удалось загрузить чат.",
            en: "Failed to load chat."
        },


        /* ===== MEDIA ===== */

        "📷 Նկար ընտրել": {
            ru: "📷 Выбрать изображение",
            en: "📷 Choose image"
        },

        "⬆️ Ավելացնել": {
            ru: "⬆️ Добавить",
            en: "⬆️ Add"
        },

        "🗑️ Ջնջել": {
            ru: "🗑️ Удалить",
            en: "🗑️ Delete"
        },

        "💬 Մեկնաբանություններ": {
            ru: "💬 Комментарии",
            en: "💬 Comments"
        },

        "Մեկնաբանություն...": {
            ru: "Комментарий...",
            en: "Comment..."
        },

        "ՆԿԱՐ": {
            ru: "ИЗОБРАЖЕНИЕ",
            en: "IMAGE"
        },


        /* ===== AUTH ===== */

        "Մուտք գործեք": {
            ru: "Войдите",
            en: "Log in"
        },

        "Էլ․ փոստ": {
            ru: "Электронная почта",
            en: "Email"
        },

        "Գաղտնաբառ": {
            ru: "Пароль",
            en: "Password"
        },

        "Հաստատել": {
            ru: "Подтвердить",
            en: "Confirm"
        },

        "Փակել": {
            ru: "Закрыть",
            en: "Close"
        },

        "Վերականգնել գաղտնաբառը": {
            ru: "Восстановить пароль",
            en: "Reset password"
        },


        /* ===== COMMON ===== */

        "Այո": {
            ru: "Да",
            en: "Yes"
        },

        "Ոչ": {
            ru: "Нет",
            en: "No"
        },

        "Պահպանել": {
            ru: "Сохранить",
            en: "Save"
        },

        "Ջնջել": {
            ru: "Удалить",
            en: "Delete"
        },

        "Չեղարկել": {
            ru: "Отменить",
            en: "Cancel"
        },

        "Բացել": {
            ru: "Открыть",
            en: "Open"
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


        /* ===== WEATHER ===== */

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

        "🌦️ Անձրևային": {
            ru: "🌦️ Дождливо",
            en: "🌦️ Showers"
        },

        "⛈️ Ամպրոպ": {
            ru: "⛈️ Гроза",
            en: "⛈️ Thunderstorm"
        },

        "Եղանակը հասանելի չէ": {
            ru: "Погода недоступна",
            en: "Weather unavailable"
        },


        /* ===== VALIDATION ===== */

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

        "Խնդրում ենք լրացնել այս դաշտը": {
            ru: "Пожалуйста, заполните это поле",
            en: "Please fill in this field"
        },

        "Խնդրում ենք գրել ճիշտ էլ․ փոստի հասցե": {
            ru: "Пожалуйста, введите правильный email",
            en: "Please enter a valid email address"
        }

    };


    /* =========================================================
       LANGUAGE HELPERS
       ========================================================= */

    function getLanguage() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved && LANGUAGES[saved]) {
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


    function translateText(text, lang) {
        if (!text) return text;

        const clean = text.trim();

        if (!T[clean]) {
            return text;
        }

        if (lang === "hy") {
            return clean;
        }

        return T[clean][lang] || clean;
    }


    /* =========================================================
       TEXT NODE TRANSLATION
       ========================================================= */

    function translateTextNodes(root, lang) {

        if (!root) return;

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {

                    if (!node.nodeValue.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    const parent = node.parentElement;

                    if (!parent) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    const tag = parent.tagName;

                    if (
                        tag === "SCRIPT" ||
                        tag === "STYLE" ||
                        tag === "NOSCRIPT"
                    ) {
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

        nodes.forEach(textNode => {

            const original =
                textNode.nodeValue;

            const trimmed =
                original.trim();

            const translated =
                translateText(trimmed, lang);

            if (translated !== trimmed) {

                const start =
                    original.indexOf(trimmed);

                const before =
                    original.substring(0, start);

                const after =
                    original.substring(
                        start + trimmed.length
                    );

                textNode.nodeValue =
                    before +
                    translated +
                    after;
            }
        });
    }


    /* =========================================================
       PLACEHOLDERS
       ========================================================= */

    function translatePlaceholders(lang) {

        document
            .querySelectorAll(
                "input[placeholder], textarea[placeholder]"
            )
            .forEach(element => {

                const value =
                    element.getAttribute("placeholder");

                const translated =
                    translateText(value, lang);

                if (translated !== value) {
                    element.setAttribute(
                        "placeholder",
                        translated
                    );
                }
            });
    }


    /* =========================================================
       TITLE / ARIA / TOOLTIP
       ========================================================= */

    function translateAttributes(lang) {

        document
            .querySelectorAll(
                "[title], [aria-label]"
            )
            .forEach(element => {

                ["title", "aria-label"].forEach(attr => {

                    const value =
                        element.getAttribute(attr);

                    if (!value) return;

                    const translated =
                        translateText(value, lang);

                    if (translated !== value) {
                        element.setAttribute(
                            attr,
                            translated
                        );
                    }
                });
            });
    }


    /* =========================================================
       LANGUAGE SELECTOR
       ========================================================= */

    function createLanguageSelector() {

        if (document.getElementById(
            "aimrelax-language-selector"
        )) {
            return;
        }

        const wrapper =
            document.createElement("div");

        wrapper.id =
            "aimrelax-language-selector";

        wrapper.innerHTML = `
            <select id="aimrelax-language">
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
                appearance: none;
                -webkit-appearance: none;
                background: #111;
                color: #fff;
                border: 1px solid #ff7200;
                border-radius: 7px;
                padding: 8px 11px;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                outline: none;
            }

            #aimrelax-language select:hover {
                border-color: #fff;
            }

            @media(max-width:600px) {
                #aimrelax-language-selector {
                    top: 8px;
                    right: 8px;
                }

                #aimrelax-language {
                    padding: 7px 8px;
                    font-size: 12px;
                }
            }
        `;

        document.head.appendChild(style);

        document.body.appendChild(wrapper);

        const select =
            document.getElementById(
                "aimrelax-language"
            );

        select.value =
            getLanguage();

        select.addEventListener(
            "change",
            function () {

                setLanguage(
                    this.value
                );

            }
        );
    }


    /* =========================================================
       APPLY LANGUAGE
       ========================================================= */

    function setLanguage(lang) {

        if (!LANGUAGES[lang]) {
            lang = "hy";
        }

        saveLanguage(lang);

        document.documentElement
            .setAttribute(
                "lang",
                lang
            );

        translateTextNodes(
            document.body,
            lang
        );

        translatePlaceholders(
            lang
        );

        translateAttributes(
            lang
        );

        const selector =
            document.getElementById(
                "aimrelax-language"
            );

        if (selector) {
            selector.value = lang;
        }

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


    /* =========================================================
       MUTATION OBSERVER
       ========================================================= */

    function startObserver() {

        const observer =
            new MutationObserver(
                mutations => {

                    const lang =
                        getLanguage();

                    mutations.forEach(
                        mutation => {

                            mutation.addedNodes
                                .forEach(node => {

                                    if (
                                        node.nodeType === 1
                                    ) {

                                        translateTextNodes(
                                            node,
                                            lang
                                        );

                                        translatePlaceholders(
                                            lang
                                        );

                                        translateAttributes(
                                            lang
                                        );
                                    }
                                });
                        }
                    );
                }
            );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* =========================================================
       INITIALIZATION
       ========================================================= */

    function init() {

        createLanguageSelector();

        setLanguage(
            getLanguage()
        );

        startObserver();
    }


    /* =========================================================
       PUBLIC API
       ========================================================= */

    window.AIMRELAX_LANGUAGE = {

        setLanguage,

        getLanguage,

        languages: LANGUAGES,

        translations: T

    };


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
```
