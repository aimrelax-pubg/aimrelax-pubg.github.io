(function () {
    "use strict";

    const STORAGE_KEY = "aimrelax_language";

    const LANGUAGES = {
        hy: "🇦🇲 Հայերեն",
        ru: "🇷🇺 Русский",
        en: "🇬🇧 English"
    };

    const T = {
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
            ru: "Сообществона",
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

        "ՊԱՇՏՈՆԱԿԱՆ ԿԼԱՆԱՅԻՆ ԿԱՅՔ": {
            ru: "ОФИЦИАЛЬНЫЙ САЙТ КЛАНА",
            en: "OFFICIAL CLAN WEBSITE"
        },
        "ՄԻԱՆԱԼ AIMRELAX-ԻՆ": {
            ru: "ПРИСОЕДИНИТЬСЯ К AIMRELAX",
            en: "JOIN AIMRELAX"
        },
        "ՄԵՐ ՍՈՑ. ԷՋԵՐԸ": {
            ru: "НАШИ СОЦИАЛЬНЫЕ СТРАНИЦЫ",
            en: "OUR SOCIAL PAGES"
        },

        "🗳 Քվեարկություն": {
            ru: "🗳 Голосование",
            en: "🗳 Voting"
        },
        "ՔՎԵԱՐԿԵԼ": {
            ru: "ГОЛОСОВАТЬ",
            en: "VOTE"
        },
        "Խաղացողները բեռնվում են...": {
            ru: "Игроки загружаются...",
            en: "Loading players..."
        },

        "ԿԱՊ ՀԱՍՏԱՏԵԼ": {
            ru: "СВЯЗАТЬСЯ С НАМИ",
            en: "CONTACT US"
        },
        "ՈՒՂԱՐԿԵԼ ՆԱՄԱԿԸ": {
            ru: "ОТПРАВИТЬ СООБЩЕНИЕ",
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
        "Օնլայն": {
            ru: "Онлайн",
            en: "Online"
        },
        "Օֆլայն": {
            ru: "Офлайн",
            en: "Offline"
        },
        "Չեղարկել": {
            ru: "Отменить",
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
        "Վերականգնել գաղտնաբառը": {
            ru: "Восстановить пароль",
            en: "Reset password"
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
        }
    };

    /*
     * Պահպանում ենք յուրաքանչյուր text node-ի սկզբնական
     * արժեքը, որպեսզի AM → RU → EN → AM նորմալ աշխատի։
     */
    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();

    function getLanguage() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return LANGUAGES[saved] ? saved : "hy";
    }

    function saveLanguage(lang) {
        if (!LANGUAGES[lang]) {
            lang = "hy";
        }

        localStorage.setItem(STORAGE_KEY, lang);
    }

    function translate(source, lang) {
        const key = source.trim();

        if (!T[key]) {
            return source;
        }

        if (lang === "hy") {
            return source;
        }

        const translated = T[key][lang];

        if (!translated) {
            return source;
        }

        const start = source.indexOf(key);
        const before = start >= 0 ? source.substring(0, start) : "";
        const after = start >= 0
            ? source.substring(start + key.length)
            : "";

        return before + translated + after;
    }

    function shouldIgnoreText(node) {
        const parent = node.parentElement;

        if (!parent) {
            return true;
        }

        const tag = parent.tagName;

        if (
            tag === "SCRIPT" ||
            tag === "STYLE" ||
            tag === "NOSCRIPT" ||
            tag === "TEXTAREA"
        ) {
            return true;
        }

        if (
            parent.closest("#aimrelax-language-selector")
        ) {
            return true;
        }

        if (parent.isContentEditable) {
            return true;
        }

        return !node.nodeValue.trim();
    }

    function translateNode(node, lang) {
        if (shouldIgnoreText(node)) {
            return;
        }

        if (!originalText.has(node)) {
            originalText.set(node, node.nodeValue);
        }

        const source = originalText.get(node);

        node.nodeValue = translate(source, lang);
    }

    function translateAllText(lang) {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        const nodes = [];

        let node;

        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        nodes.forEach(function (textNode) {
            translateNode(textNode, lang);
        });
    }

    function translateAttributes(lang) {
        const elements = document.querySelectorAll(
            "[placeholder], [title], [aria-label]"
        );

        elements.forEach(function (element) {

            if (
                element.closest("#aimrelax-language-selector")
            ) {
                return;
            }

            ["placeholder", "title", "aria-label"].forEach(
                function (attribute) {

                    if (!element.hasAttribute(attribute)) {
                        return;
                    }

                    const value =
                        element.getAttribute(attribute);

                    if (!originalAttributes.has(element)) {
                        originalAttributes.set(
                            element,
                            {}
                        );
                    }

                    const saved =
                        originalAttributes.get(element);

                    if (!saved[attribute]) {
                        saved[attribute] = value;
                    }

                    const source =
                        saved[attribute];

                    element.setAttribute(
                        attribute,
                        translate(source, lang)
                    );
                }
            );
        });
    }

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

            #aimrelax-language:hover {
                border-color: #fff;
            }

            @media (max-width: 600px) {
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

        select.value = getLanguage();

        select.addEventListener(
            "change",
            function () {
                setLanguage(this.value);
            }
        );
    }

    function setLanguage(lang) {

        if (!LANGUAGES[lang]) {
            lang = "hy";
        }

        saveLanguage(lang);

        document.documentElement.lang = lang;

        /*
         * Միայն մեկ անգամ ենք ամբողջ էջը անցնում։
         * Ոչ մի recursive MutationObserver չկա։
         */
        translateAllText(lang);
        translateAttributes(lang);

        const select =
            document.getElementById(
                "aimrelax-language"
            );

        if (select) {
            select.value = lang;
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

    /*
     * Դինամիկ նոր տարրերի համար օգտագործում ենք
     * շատ թեթև observer։
     *
     * Այն ՉԻ վերամշակում ամբողջ document.body-ը։
     */
    function startObserver() {

        const observer =
            new MutationObserver(
                function (mutations) {

                    const lang = getLanguage();

                    mutations.forEach(
                        function (mutation) {

                            mutation.addedNodes.forEach(
                                function (node) {

                                    if (
                                        node.nodeType !== 1
                                    ) {
                                        return;
                                    }

                                    if (
                                        node.id ===
                                        "aimrelax-language-selector"
                                    ) {
                                        return;
                                    }

                                    const walker =
                                        document.createTreeWalker(
                                            node,
                                            NodeFilter.SHOW_TEXT
                                        );

                                    const textNodes = [];

                                    let textNode;

                                    while (
                                        (textNode =
                                            walker.nextNode())
                                    ) {
                                        textNodes.push(
                                            textNode
                                        );
                                    }

                                    textNodes.forEach(
                                        function (text) {
                                            translateNode(
                                                text,
                                                lang
                                            );
                                        }
                                    );
                                }
                            );
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

    function init() {

        createSelector();

        /*
         * Եթե լեզուն նախկինում ընտրված է,
         * կիրառում ենք այն։
         */
        setLanguage(getLanguage());

        startObserver();
    }

    window.AIMRELAX_LANGUAGE = {
        setLanguage: setLanguage,
        getLanguage: getLanguage,
        languages: LANGUAGES,
        translations: T
    };

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }

})();
