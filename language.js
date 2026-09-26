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
            ru: "Зарегистрироваться",
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

        "Նամակը հաջողությամբ ուղարկվեց ✅": {
            ru: "Сообщение успешно отправлено ✅",
            en: "Message sent successfully ✅"
        },

        "Չհաջողվեց ուղարկել նամակը ❌": {
            ru: "Не удалось отправить сообщение ❌",
            en: "Failed to send message ❌"
        },

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
            en: "Log in to use private chat."
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

        "Օնլայն": {
            ru: "Онлайн",
            en: "Online"
        },

        "Օֆլայն": {
            ru: "Офлайн",
            en: "Offline"
        },

        "Ջնջել": {
            ru: "Удалить",
            en: "Delete"
        },

        "Պահպանել": {
            ru: "Сохранить",
            en: "Save"
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

        "Էլ․ փոստ": {
            ru: "Электронная почта",
            en: "Email"
        },

        "Գաղտնաբառ": {
            ru: "Пароль",
            en: "Password"
        },

        "Այո": {
            ru: "Да",
            en: "Yes"
        },

        "Ոչ": {
            ru: "Нет",
            en: "No"
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

        "ՆԿԱՐ": {
            ru: "ИЗОБРАЖЕНИЕ",
            en: "IMAGE"
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

        "Եղանակը հասանելի չէ": {
            ru: "Погода недоступна",
            en: "Weather unavailable"
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
        },

        "Նոր հաղորդագրություն": {
            ru: "Новое сообщение",
            en: "New message"
        },

        "Նոր ծանուցում": {
            ru: "Новое уведомление",
            en: "New notification"
        },

        "Ծանուցումներ": {
            ru: "Уведомления",
            en: "Notifications"
        },

        "Դիմումներ": {
            ru: "Заявки",
            en: "Applications"
        },

        "Կլանային դիմումներ": {
            ru: "Заявки в клан",
            en: "Clan applications"
        },

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

        "Քննությունը ավարտված է": {
            ru: "Экзамен завершён",
            en: "Exam completed"
        },

        "1VS1": {
            ru: "1VS1",
            en: "1VS1"
        },

        "1VS1 փուլ": {
            ru: "Раунд 1VS1",
            en: "1VS1 round"
        },

        "Մասնակիցներ": {
            ru: "Участники",
            en: "Participants"
        },

        "🎬 Վիդեոներ և նկարներ": {
            ru: "🎬 Видео и фотографии",
            en: "🎬 Videos and photos"
        },

        "➕ Ավելացնել նյութ": {
            ru: "➕ Добавить материал",
            en: "➕ Add media"
        },

        "Վերնագիր": {
            ru: "Название",
            en: "Title"
        },

        "Նկարագրություն": {
            ru: "Описание",
            en: "Description"
        },

        "Նկար կամ վիդեո": {
            ru: "Фото или видео",
            en: "Image or video"
        },

        "📤 Ուղարկել հաստատման": {
            ru: "📤 Отправить на проверку",
            en: "📤 Submit for approval"
        },

        "Բեռնվում է...": {
            ru: "Загрузка...",
            en: "Loading..."
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
        }
    };


    let currentLanguage = localStorage.getItem(STORAGE_KEY);

    if (!LANGUAGES[currentLanguage]) {
        currentLanguage = "hy";
    }


    function getLanguage() {
        return currentLanguage;
    }


    function translate(text) {

        if (!text) {
            return text;
        }

        const value = String(text);
        const trimmed = value.trim();

        if (!T[trimmed]) {
            return value;
        }

        if (currentLanguage === "hy") {
            return trimmed;
        }

        return T[trimmed][currentLanguage] || trimmed;
    }


    function createSelector() {

        if (document.getElementById("aimrelax-language-selector")) {
            return;
        }

        const box = document.createElement("div");

        box.id = "aimrelax-language-selector";

        box.innerHTML = `
            <select id="aimrelax-language-select">
                <option value="hy">🇦🇲 Հայերեն</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="en">🇬🇧 English</option>
            </select>
        `;

        const style = document.createElement("style");

        style.textContent = `
            #aimrelax-language-selector {
                position: fixed;
                top: 12px;
                right: 12px;
                z-index: 2147483647;
            }

            #aimrelax-language-select {
                appearance: auto;
                -webkit-appearance: auto;
                background: #111;
                color: #fff;
                border: 2px solid #ff7200;
                border-radius: 8px;
                padding: 8px 10px;
                min-width: 125px;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                outline: none;
            }

            #aimrelax-language-select:hover {
                border-color: #fff;
            }

            #aimrelax-language-select option {
                background: #111;
                color: #fff;
            }

            @media (max-width: 600px) {
                #aimrelax-language-selector {
                    top: 8px;
                    right: 8px;
                }

                #aimrelax-language-select {
                    min-width: 115px;
                    padding: 7px 8px;
                    font-size: 12px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(box);

        const select = document.getElementById(
            "aimrelax-language-select"
        );

        select.value = currentLanguage;

        select.addEventListener("change", function () {
            setLanguage(this.value);
        });
    }


    function translateTextNodes(root) {

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT
        );

        const nodes = [];

        let node;

        while ((node = walker.nextNode())) {

            const parent = node.parentElement;

            if (!parent) {
                continue;
            }

            const tag = parent.tagName;

            if (
                tag === "SCRIPT" ||
                tag === "STYLE" ||
                tag === "NOSCRIPT"
            ) {
                continue;
            }

            if (
                parent.closest(
                    "#aimrelax-language-selector"
                )
            ) {
                continue;
            }

            const original = node.nodeValue;
            const trimmed = original.trim();

            if (!trimmed) {
                continue;
            }

            nodes.push({
                node,
                original
            });
        }


        nodes.forEach(item => {

            const translated = translate(item.original);

            if (translated === item.original) {
                return;
            }

            const original = item.original;
            const trimmed = original.trim();

            const start = original.indexOf(trimmed);

            const before = original.substring(
                0,
                start
            );

            const after = original.substring(
                start + trimmed.length
            );

            item.node.nodeValue =
                before +
                translated +
                after;
        });
    }


    function translatePlaceholders() {

        document
            .querySelectorAll(
                "input[placeholder], textarea[placeholder]"
            )
            .forEach(element => {

                const value =
                    element.getAttribute("placeholder");

                if (!value) {
                    return;
                }

                const translated = translate(value);

                if (translated !== value) {
                    element.setAttribute(
                        "placeholder",
                        translated
                    );
                }
            });
    }


    function translateAttributes() {

        document
            .querySelectorAll("[title], [aria-label]")
            .forEach(element => {

                ["title", "aria-label"].forEach(attribute => {

                    const value =
                        element.getAttribute(attribute);

                    if (!value) {
                        return;
                    }

                    const translated =
                        translate(value);

                    if (translated !== value) {
                        element.setAttribute(
                            attribute,
                            translated
                        );
                    }
                });
            });
    }


    function setLanguage(language) {

        if (!LANGUAGES[language]) {
            language = "hy";
        }

        currentLanguage = language;

        localStorage.setItem(
            STORAGE_KEY,
            language
        );

        document.documentElement.lang =
            language;

        translateTextNodes(document.body);
        translatePlaceholders();
        translateAttributes();

        const select =
            document.getElementById(
                "aimrelax-language-select"
            );

        if (select) {
            select.value = language;
        }

        window.dispatchEvent(
            new CustomEvent(
                "aimrelax-language-changed",
                {
                    detail: {
                        language
                    }
                }
            )
        );
    }


    function startObserver() {

        const observer =
            new MutationObserver(
                mutations => {

                    mutations.forEach(mutation => {

                        mutation.addedNodes.forEach(node => {

                            if (
                                node.nodeType !==
                                Node.ELEMENT_NODE
                            ) {
                                return;
                            }

                            if (
                                node.id ===
                                "aimrelax-language-selector"
                            ) {
                                return;
                            }

                            translateTextNodes(node);
                            translatePlaceholders();
                            translateAttributes();
                        });
                    });
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

        setLanguage(currentLanguage);

        startObserver();
    }


    window.AIMRELAX_LANGUAGE = {
        getLanguage,
        setLanguage,
        translate,
        languages: LANGUAGES,
        translations: T
    };


    if (
        document.readyState ===
        "loading"
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
