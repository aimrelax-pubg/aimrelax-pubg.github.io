/* =========================================================
   AIMRELAX-PUBG
   OWN LANGUAGE SYSTEM
   🇦🇲 Armenian / 🇷🇺 Russian / 🇬🇧 English

   NO GOOGLE TRANSLATE
   NO GOOGLE API
   NO EXTERNAL TRANSLATION SERVICE

   User-generated content is protected:
   - PUBG nicknames
   - chat messages
   - comments
   - user names
   - uploaded titles/descriptions
   ========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "aimrelax_language";

    const LANGUAGES = {
        hy: "🇦🇲 Հայերեն",
        ru: "🇷🇺 Русский",
        en: "🇬🇧 English"
    };

    /*
     * Translation format:
     *
     * "Հայերեն տեքստ": {
     *     ru: "Русский",
     *     en: "English"
     * }
     */

    const TRANSLATIONS = {

        /* =========================
           GENERAL NAVIGATION
           ========================= */

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

        "Մուտք / Գրանցում": {
            ru: "Вход / Регистрация",
            en: "Login / Register"
        },

        "← Գլխավոր": {
            ru: "← Главная",
            en: "← Home"
        },

        "← Վերադառնալ կայք": {
            ru: "← Вернуться на сайт",
            en: "← Back to website"
        },


        /* =========================
           MAIN PAGE
           ========================= */

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

        "ԿԱՊ ՀԱՍՏԱՏԵԼ": {
            ru: "СВЯЗАТЬСЯ С НАМИ",
            en: "CONTACT US"
        },

        "ՈՒՂԱՐԿԵԼ ՆԱՄԱԿԸ": {
            ru: "ОТПРАВИТЬ ПИСЬМО",
            en: "SEND EMAIL"
        },

        "Ով ենք մենք": {
            ru: "Кто мы",
            en: "Who we are"
        },

        "Կլանի Մասին": {
            ru: "О клане",
            en: "About the Clan"
        },

        "Մեր Թիմը": {
            ru: "Наша команда",
            en: "Our Team"
        },

        "Մեր Ուղին": {
            ru: "Наш путь",
            en: "Our Journey"
        },

        "Մեր նպատակը": {
            ru: "Наша цель",
            en: "Our Goal"
        },

        "Միանալ Կլանին": {
            ru: "Вступить в клан",
            en: "Join the Clan"
        },

        "Մեր Խաղացողները": {
            ru: "Наши игроки",
            en: "Our Players"
        },

        "Հիմնադրվել է": {
            ru: "Основан",
            en: "Founded"
        },

        "Երկիր": {
            ru: "Страна",
            en: "Country"
        },

        "Հաղթանակներ": {
            ru: "Победы",
            en: "Victories"
        },

        "Մրցաշարեր": {
            ru: "Турниры",
            en: "Tournaments"
        },

        "ԼԱՎԱԳՈՒՅՆ ՖՐԱԳԵՐ": {
            ru: "ЛУЧШИЕ ФРАГИ",
            en: "BEST FRAGS"
        },

        "ՊԱՏԿԵՐՆԵՐ": {
            ru: "ИЗОБРАЖЕНИЯ",
            en: "IMAGES"
        },

        "ՆԿԱՐ": {
            ru: "ИЗОБРАЖЕНИЕ",
            en: "IMAGE"
        },

        "ՇՈՒՏՈՎ": {
            ru: "СКОРО",
            en: "SOON"
        },


        /* =========================
           AUTH
           ========================= */

        "ՄՈՒՏՔ ԳՈՐԾԵԼ": {
            ru: "ВОЙТИ",
            en: "LOG IN"
        },

        "ՄՈՒՏՔ": {
            ru: "ВХОД",
            en: "LOGIN"
        },

        "ԳՐԱՆՑՈՒՄ": {
            ru: "РЕГИСТРАЦИЯ",
            en: "REGISTRATION"
        },

        "🔐 Մուտք": {
            ru: "🔐 Вход",
            en: "🔐 Login"
        },

        "👤 Ստեղծել հաշիվ": {
            ru: "👤 Создать аккаунт",
            en: "👤 Create account"
        },

        "👤 Իմ հաշիվը": {
            ru: "👤 Мой аккаунт",
            en: "👤 My Account"
        },

        "Մոռացե՞լ եք գաղտնաբառը": {
            ru: "Забыли пароль?",
            en: "Forgot your password?"
        },

        "🔄 Վերականգնել գաղտնաբառը": {
            ru: "🔄 Восстановить пароль",
            en: "🔄 Reset password"
        },

        "Վերադառնալ մուտք": {
            ru: "Вернуться ко входу",
            en: "Back to login"
        },

        "ԳՐԱՆՑՎԵԼ": {
            ru: "ЗАРЕГИСТРИРОВАТЬСЯ",
            en: "REGISTER"
        },

        "🔵 Մուտք Google-ով": {
            ru: "🔵 Войти через Google",
            en: "🔵 Sign in with Google"
        },

        "Մուտք եք գործել որպես": {
            ru: "Вы вошли как",
            en: "You are logged in as"
        },

        "Ձեր գրանցումը հաջողությամբ կատարվել է": {
            ru: "Регистрация успешно завершена",
            en: "Registration completed successfully"
        },

        "Նոր E-mail": {
            ru: "Новый E-mail",
            en: "New E-mail"
        },

        "Նոր գաղտնաբառ": {
            ru: "Новый пароль",
            en: "New password"
        },

        "Ընթացիկ գաղտնաբառ (եթե փոխում եք գաղտնաբառը)": {
            ru: "Текущий пароль (если меняете пароль)",
            en: "Current password (if changing password)"
        },

        "Նոր գաղտնաբառ (ըստ ցանկության)": {
            ru: "Новый пароль (необязательно)",
            en: "New password (optional)"
        },


        /* =========================
           FORM FIELDS
           ========================= */

        "Ձեր E-mail": {
            ru: "Ваш E-mail",
            en: "Your E-mail"
        },

        "Ձեր նամակը": {
            ru: "Ваше сообщение",
            en: "Your message"
        },

        "Էլ․ փոստ": {
            ru: "Электронная почта",
            en: "Email"
        },

        "Գաղտնաբառ": {
            ru: "Пароль",
            en: "Password"
        },

        "Կրկնել գաղտնաբառը": {
            ru: "Повторите пароль",
            en: "Repeat password"
        },

        "Գաղտնաբառ (առնվազն 6 նիշ)": {
            ru: "Пароль (минимум 6 символов)",
            en: "Password (at least 6 characters)"
        },

        "PUBG Nickname": {
            ru: "PUBG Nickname",
            en: "PUBG Nickname"
        },

        "Նոր Nickname": {
            ru: "Новый Nickname",
            en: "New Nickname"
        },


        /* =========================
           COMMON BUTTONS
           ========================= */

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

        "Բեռնվում է...": {
            ru: "Загрузка...",
            en: "Loading..."
        },

        "Բեռնվում է…": {
            ru: "Загрузка…",
            en: "Loading…"
        },

        "Ստուգվում է մուտքը...": {
            ru: "Проверка доступа...",
            en: "Checking access..."
        },


        /* =========================
           VOTING
           ========================= */

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

        "Ընտրեք խաղացող։": {
            ru: "Выберите игрока.",
            en: "Select a player."
        },

        "Դուք արդեն քվեարկել եք։": {
            ru: "Вы уже проголосовали.",
            en: "You have already voted."
        },

        "Դեռ ոչ ոք չի քվեարկել։": {
            ru: "Пока никто не проголосовал.",
            en: "Nobody has voted yet."
        },

        "Քվեարկելու համար նախ մուտք գործեք։": {
            ru: "Сначала войдите, чтобы проголосовать.",
            en: "Log in first to vote."
        },

        "Քվեարկությունը պահպանվում է...": {
            ru: "Голос сохраняется...",
            en: "Saving vote..."
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

        "Օնլայն": {
            ru: "Онлайн",
            en: "Online"
        },

        "Օֆլայն": {
            ru: "Офлайн",
            en: "Offline"
        },

        "typing…": {
            ru: "печатает…",
            en: "typing…"
        },

        "🔴 Ձայնագրում է…": {
            ru: "🔴 Идёт запись…",
            en: "🔴 Recording…"
        },


        /* =========================
           COMMENTS / MEDIA
           ========================= */

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

        "Միայն նկար է թույլատրվում։": {
            ru: "Разрешены только изображения.",
            en: "Only images are allowed."
        },

        "Նախ ընտրեք նկար։": {
            ru: "Сначала выберите изображение.",
            en: "Choose an image first."
        },

        "Նկարի չափը պետք է լինի մինչև 10MB։": {
            ru: "Размер изображения должен быть до 10 МБ.",
            en: "Image size must be up to 10 MB."
        },


        /* =========================
           NOTIFICATIONS
           ========================= */

        "🔔 Ծանուցումներ": {
            ru: "🔔 Уведомления",
            en: "🔔 Notifications"
        },

        "Ծանուցումները անջատված են։": {
            ru: "Уведомления отключены.",
            en: "Notifications are disabled."
        },

        "🔔 Միացնել ծանուցումները": {
            ru: "🔔 Включить уведомления",
            en: "🔔 Enable notifications"
        },

        "Նոր հաղորդագրություն": {
            ru: "Новое сообщение",
            en: "New message"
        },

        "Նոր ծանուցում": {
            ru: "Новое уведомление",
            en: "New notification"
        },

        "Հենց հիմա": {
            ru: "Только что",
            en: "Just now"
        },


        /* =========================
           END OF PART 1
           ========================= */
    };

    /*
     * The rest of the system is in Part 2.
     * Do not paste this file into GitHub until all parts
     * have been joined together.
     */
        /* =========================
           CLAN APPLICATIONS
           ========================= */

        "📋 Կլանի հայտեր": {
            ru: "📋 Заявки в клан",
            en: "📋 Clan Applications"
        },

        "📨 Նոր հայտեր": {
            ru: "📨 Новые заявки",
            en: "📨 New Applications"
        },

        "👥 Ընդունված մասնակիցներ": {
            ru: "👥 Принятые участники",
            en: "👥 Accepted Participants"
        },

        "Միանալ Կլանին": {
            ru: "Вступить в клан",
            en: "Join the Clan"
        },

        "Հայտ": {
            ru: "Заявка",
            en: "Application"
        },

        "Հայտեր": {
            ru: "Заявки",
            en: "Applications"
        },

        "Հայտը ուղարկվում է...": {
            ru: "Заявка отправляется...",
            en: "Application is being submitted..."
        },

        "Հայտը ուղարկվում է…": {
            ru: "Заявка отправляется…",
            en: "Application is being submitted…"
        },

        "✅ Հայտը հաջողությամբ ուղարկվեց։ Սպասեք Admin-ի պատասխանին։": {
            ru: "✅ Заявка успешно отправлена. Ожидайте ответа Admin.",
            en: "✅ Application sent successfully. Wait for an Admin response."
        },

        "Չհաջողվեց ուղարկել հայտը։": {
            ru: "Не удалось отправить заявку.",
            en: "Failed to send application."
        },

        "⏳ Դուք արդեն ունեք սպասող հայտ։": {
            ru: "⏳ У вас уже есть ожидающая заявка.",
            en: "⏳ You already have a pending application."
        },

        "🎉 Դուք արդեն ընդունված եք AIMRELAX կլան։": {
            ru: "🎉 Вы уже приняты в клан AIMRELAX.",
            en: "🎉 You have already been accepted into AIMRELAX."
        },

        "🔐 Նախ մուտք գործեք։": {
            ru: "🔐 Сначала войдите.",
            en: "🔐 Please log in first."
        },

        "🔐 Մուտք գործեք Admin հաշիվով։": {
            ru: "🔐 Войдите с аккаунтом Admin.",
            en: "🔐 Log in with an Admin account."
        },

        "⛔ Այս բաժինը հասանելի է միայն Admin/Owner-ին։": {
            ru: "⛔ Этот раздел доступен только Admin/Owner.",
            en: "⛔ This section is available only to Admin/Owner."
        },

        "Դիտեք նոր հայտերը, ընդունեք կամ մերժեք և տեսեք ընդունված մասնակիցներին։": {
            ru: "Просматривайте новые заявки, принимайте или отклоняйте их и смотрите принятых участников.",
            en: "View new applications, accept or reject them, and see accepted participants."
        },

        "Ընդունել": {
            ru: "Принять",
            en: "Accept"
        },

        "Մերժել": {
            ru: "Отклонить",
            en: "Reject"
        },

        "Ընդունված": {
            ru: "Принято",
            en: "Accepted"
        },

        "Մերժված": {
            ru: "Отклонено",
            en: "Rejected"
        },

        "Սպասվում է": {
            ru: "Ожидание",
            en: "Pending"
        },


        /* =========================
           ADMIN
           ========================= */

        "ADMIN PANEL": {
            ru: "ПАНЕЛЬ АДМИНИСТРАТОРА",
            en: "ADMIN PANEL"
        },

        "Admin": {
            ru: "Admin",
            en: "Admin"
        },

        "Owner": {
            ru: "Owner",
            en: "Owner"
        },

        "Կառավարում": {
            ru: "Управление",
            en: "Management"
        },

        "Ադմինիստրատոր": {
            ru: "Администратор",
            en: "Administrator"
        },

        "Մասնակից": {
            ru: "Участник",
            en: "Participant"
        },

        "Մասնակիցներ": {
            ru: "Участники",
            en: "Participants"
        },

        "Օգտատեր": {
            ru: "Пользователь",
            en: "User"
        },

        "Օգտատերեր": {
            ru: "Пользователи",
            en: "Users"
        },

        "Օգտատերը գտնված չէ։": {
            ru: "Пользователь не найден.",
            en: "User not found."
        },

        "Տվյալները բեռնվում են...": {
            ru: "Данные загружаются...",
            en: "Loading data..."
        },

        "Չհաջողվեց բեռնել տվյալները։": {
            ru: "Не удалось загрузить данные.",
            en: "Failed to load data."
        },

        "Չհաջողվեց բեռնել հայտերը։": {
            ru: "Не удалось загрузить заявки.",
            en: "Failed to load applications."
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

        "ՄԱՏՉ": {
            ru: "МАТЧ",
            en: "MATCH"
        },

        "ՀԱՇԻՎ": {
            ru: "СЧЁТ",
            en: "SCORE"
        },

        "ՀԱՂԹՈՂ": {
            ru: "ПОБЕДИТЕЛЬ",
            en: "WINNER"
        },

        "ՎԵՐՋՆԱԿԱՆ ՀԱՂԹՈՂ": {
            ru: "ФИНАЛЬНЫЙ ПОБЕДИТЕЛЬ",
            en: "FINAL WINNER"
        },

        "Հաղթող": {
            ru: "Победитель",
            en: "Winner"
        },

        "Ընտրել նիկը…": {
            ru: "Выберите ник…",
            en: "Select nickname…"
        },

        "Ընտրել նիկը...": {
            ru: "Выберите ник...",
            en: "Select nickname..."
        },

        "Խաղերը ժամանակավորապես դադարեցված են": {
            ru: "Игры временно приостановлены",
            en: "Games are temporarily paused"
        },

        "Ձեռքով կազմել զույգերը": {
            ru: "Создать пары вручную",
            en: "Create pairs manually"
        },

        "Վերջին փուլը": {
            ru: "Финальный этап",
            en: "Final round"
        },

        "Հաջորդ փուլ": {
            ru: "Следующий этап",
            en: "Next round"
        },

        "Նախորդ փուլ": {
            ru: "Предыдущий этап",
            en: "Previous round"
        },

        "Սկսել խաղը": {
            ru: "Начать игру",
            en: "Start game"
        },

        "Ավարտել խաղը": {
            ru: "Завершить игру",
            en: "Finish game"
        },

        "Վերագործարկել": {
            ru: "Перезапустить",
            en: "Restart"
        },

        "Նոր խաղ": {
            ru: "Новая игра",
            en: "New game"
        },

        "Հաստատե՞լ": {
            ru: "Подтвердить?",
            en: "Confirm?"
        },

        "Խաղը ավարտվե՞լ է։": {
            ru: "Игра завершена?",
            en: "Is the game finished?"
        },

        "Հաշիվը պահպանվեց": {
            ru: "Счёт сохранён",
            en: "Score saved"
        },

        "Հաշիվը չպահպանվեց": {
            ru: "Не удалось сохранить счёт",
            en: "Failed to save score"
        },


        /* =========================
           EXAM
           ========================= */

        "📋 Հարցաթերթիկ": {
            ru: "📋 Опросник",
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

        "ՀԱՆՁՆԵԼ": {
            ru: "СДАТЬ",
            en: "SUBMIT"
        },

        "ՀԱՋՈՐԴ": {
            ru: "СЛЕДУЮЩИЙ",
            en: "NEXT"
        },

        "ՆԱԽՈՐԴ": {
            ru: "ПРЕДЫДУЩИЙ",
            en: "PREVIOUS"
        },

        "ԱՐԴՅՈՒՆՔ": {
            ru: "РЕЗУЛЬТАТ",
            en: "RESULT"
        },

        "Ավարտել": {
            ru: "Завершить",
            en: "Finish"
        },

        "Փորձել կրկին": {
            ru: "Попробовать снова",
            en: "Try again"
        },

        "Ճիշտ": {
            ru: "Правильно",
            en: "Correct"
        },

        "Սխալ": {
            ru: "Неправильно",
            en: "Incorrect"
        },

        "Միավոր": {
            ru: "Баллы",
            en: "Points"
        },

        "Միավորներ": {
            ru: "Баллы",
            en: "Points"
        },

        "Ճիշտ պատասխան": {
            ru: "Правильный ответ",
            en: "Correct answer"
        },

        "Սխալ պատասխան": {
            ru: "Неправильный ответ",
            en: "Wrong answer"
        },

        "Հարց": {
            ru: "Вопрос",
            en: "Question"
        },

        "Հարցեր": {
            ru: "Вопросы",
            en: "Questions"
        },

        "Պատասխան": {
            ru: "Ответ",
            en: "Answer"
        },

        "Պատասխաններ": {
            ru: "Ответы",
            en: "Answers"
        },

        "Ազատ պատասխան": {
            ru: "Свободный ответ",
            en: "Free answer"
        },

        "Խնդրում ենք պատասխանել բոլոր 30 հարցերին։": {
            ru: "Пожалуйста, ответьте на все 30 вопросов.",
            en: "Please answer all 30 questions."
        },

        "❌ Տեղի ունեցավ անսպասելի սխալ։": {
            ru: "❌ Произошла непредвиденная ошибка.",
            en: "❌ An unexpected error occurred."
        },

        "Չհաջողվեց ավարտել քննությունը։": {
            ru: "Не удалось завершить экзамен.",
            en: "Failed to complete the exam."
        },

        "Քննությունը հաջողությամբ ավարտվեց։": {
            ru: "Экзамен успешно завершён.",
            en: "Exam completed successfully."
        },


        /* =========================
           QUIZ
           ========================= */

        "Որքա՞ն լավ ես ճանաչում AIMRELAX-ը։ 1–5 հարցերը գնահատվում են ավտոմատ, 6–8-ը ազատ պատասխաններ են և տեսանելի են միայն Admin/Owner-ին։": {
            ru: "Насколько хорошо вы знаете AIMRELAX? Вопросы 1–5 оцениваются автоматически, 6–8 — свободные ответы и видны только Admin/Owner.",
            en: "How well do you know AIMRELAX? Questions 1–5 are graded automatically; 6–8 are free-text answers visible only to Admin/Owner."
        },

        "🔒 Մուտք է անհրաժեշտ": {
            ru: "🔒 Требуется вход",
            en: "🔒 Login required"
        },

        "Quiz-ը հասանելի է գրանցված անդամներին։": {
            ru: "Quiz доступен зарегистрированным участникам.",
            en: "The Quiz is available to registered members."
        },

        "Մուտք / Գրանցում": {
            ru: "Вход / Регистрация",
            en: "Login / Register"
        },

        "✅ Դուք արդեն հանձնել եք Quiz-ը": {
            ru: "✅ Вы уже прошли Quiz",
            en: "✅ You have already completed the Quiz"
        },

        "🎉 Արդյունք": {
            ru: "🎉 Результат",
            en: "🎉 Result"
        },

        "Ազատ պատասխանները պահպանված են Admin/Owner-ի համար։": {
            ru: "Свободные ответы сохранены для Admin/Owner.",
            en: "Free-text answers are saved for Admin/Owner."
        },

        "🛡️ Admin / Owner — պատասխաններ": {
            ru: "🛡️ Admin / Owner — ответы",
            en: "🛡️ Admin / Owner — answers"
        },


        /* =========================
           MEDIA
           ========================= */

        "🎬 Վիդեոներ և նկարներ": {
            ru: "🎬 Видео и изображения",
            en: "🎬 Videos & Images"
        },

        "Վիդեոներ": {
            ru: "Видео",
            en: "Videos"
        },

        "Նկարներ": {
            ru: "Изображения",
            en: "Images"
        },

        "Ավելացնել վիդեո": {
            ru: "Добавить видео",
            en: "Add video"
        },

        "Ավելացնել նկար": {
            ru: "Добавить изображение",
            en: "Add image"
        },

        "Վերնագիր": {
            ru: "Название",
            en: "Title"
        },

        "Նկարագրություն": {
            ru: "Описание",
            en: "Description"
        },

        "Պահպանել": {
            ru: "Сохранить",
            en: "Save"
        },


        /* =========================
           ACCOUNT / PROFILE
           ========================= */

        "⚙️ Անձնական կարգավորումներ": {
            ru: "⚙️ Личные настройки",
            en: "⚙️ Personal settings"
        },

        "Անձնական տվյալներ": {
            ru: "Личные данные",
            en: "Personal information"
        },

        "Անուն": {
            ru: "Имя",
            en: "Name"
        },

        "Ազգանուն": {
            ru: "Фамилия",
            en: "Last name"
        },

        "Էլ․ փոստ": {
            ru: "Электронная почта",
            en: "Email"
        },

        "Հեռախոս": {
            ru: "Телефон",
            en: "Phone"
        },

        "Փոխել գաղտնաբառը": {
            ru: "Изменить пароль",
            en: "Change password"
        },

        "Փոխել E-mail-ը": {
            ru: "Изменить E-mail",
            en: "Change E-mail"
        },

        "Պրոֆիլը պահպանվեց։": {
            ru: "Профиль сохранён.",
            en: "Profile saved."
        },

        "Փոփոխությունները պահպանվեցին։": {
            ru: "Изменения сохранены.",
            en: "Changes saved."
        },


        /* =========================
           COMMON STATUS
           ========================= */

        "Հաջողությամբ": {
            ru: "Успешно",
            en: "Successfully"
        },

        "Սխալ": {
            ru: "Ошибка",
            en: "Error"
        },

        "Զգուշացում": {
            ru: "Предупреждение",
            en: "Warning"
        },

        "Տեղեկություն": {
            ru: "Информация",
            en: "Information"
        },

        "Խնդրում ենք սպասել...": {
            ru: "Пожалуйста, подождите...",
            en: "Please wait..."
        },

        "Խնդրում ենք սպասել…": {
            ru: "Пожалуйста, подождите…",
            en: "Please wait…"
        },

        "Պատրաստ է": {
            ru: "Готово",
            en: "Done"
        },

        "Չհաջողվեց": {
            ru: "Не удалось",
            en: "Failed"
        },

        "Փորձեք կրկին": {
            ru: "Попробуйте снова",
            en: "Try again"
        },


        /* =========================
           TIME
           ========================= */

        "Հենց հիմա": {
            ru: "Только что",
            en: "Just now"
        },

        "րոպե առաջ": {
            ru: "мин. назад",
            en: "min ago"
        },

        "րոպե": {
            ru: "минут",
            en: "minutes"
        },

        "ժամ առաջ": {
            ru: "ч. назад",
            en: "hours ago"
        },

        "ժամ": {
            ru: "час",
            en: "hour"
        },

        "օր առաջ": {
            ru: "дн. назад",
            en: "days ago"
        },

        "օր": {
            ru: "день",
            en: "day"
        }
