(function () {
    "use strict";

    const STORAGE_KEY = "aimrelax_language";
    const DEFAULT_LANGUAGE = "hy";

    const LANGUAGES = {
        hy: "🇦🇲 Հայերեն",
        ru: "🇷🇺 Русский",
        en: "🇬🇧 English"
    };

    /*
     * ============================================================
     * AIMRELAX-PUBG
     * GLOBAL LANGUAGE SYSTEM
     * Armenian / Russian / English
     * ============================================================
     *
     * IMPORTANT:
     * - One file for all HTML pages
     * - No MutationObserver
     * - No Supabase modification
     * - No nickname translation
     * - No chat/comment translation
     * - No notification routing modification
     * - Works with dynamically rendered UI through safe re-scan
     */

    const translations = {

        /* ========================================================
           GENERAL / NAVIGATION
        ======================================================== */

        "Գլխավոր": {
            ru: "Главная",
            en: "Home"
        },

        "Գլխավոր էջ": {
            ru: "Главная",
            en: "Home"
        },

        "← Գլխավոր": {
            ru: "← Главная",
            en: "← Home"
        },

        "Մեր մասին": {
            ru: "О нас",
            en: "About"
        },

        "Կլան": {
            ru: "Клан",
            en: "Clan"
        },

        "Խաղացողներ": {
            ru: "Игроки",
            en: "Players"
        },

        "Ձեռքբերումներ": {
            ru: "Достижения",
            en: "Achievements"
        },

        "Նկարներ": {
            ru: "Фотографии",
            en: "Photos"
        },

        "Վիդեոներ": {
            ru: "Видео",
            en: "Videos"
        },

        "Մեդիա": {
            ru: "Медиа",
            en: "Media"
        },

        "Համայնք": {
            ru: "Сообщество",
            en: "Community"
        },

        "Քվեարկություն": {
            ru: "Голосование",
            en: "Voting"
        },

        "Հետադարձ Կապ": {
            ru: "Обратная связь",
            en: "Contact Us"
        },

        "Հետադարձ կապ": {
            ru: "Обратная связь",
            en: "Contact Us"
        },

        "Կապ": {
            ru: "Контакты",
            en: "Contact"
        },

        "Կարգավորումներ": {
            ru: "Настройки",
            en: "Settings"
        },

        "⚙️ Կարգավորումներ": {
            ru: "⚙️ Настройки",
            en: "⚙️ Settings"
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
            ru: "Вход",
            en: "Login"
        },

        "ՄՈՒՏՔ / ԳՐԱՆՑՈՒՄ": {
            ru: "ВХОД / РЕГИСТРАЦИЯ",
            en: "LOGIN / REGISTER"
        },

        "Մուտք / Գրանցում": {
            ru: "Вход / Регистрация",
            en: "Login / Register"
        },

        "Գրանցում": {
            ru: "Регистрация",
            en: "Registration"
        },

        "Գրանցվել": {
            ru: "Зарегистрироваться",
            en: "Register"
        },

        "Ադմին պանել": {
            ru: "Админ-панель",
            en: "Admin Panel"
        },

        "🛡️ Ադմին պանել": {
            ru: "🛡️ Админ-панель",
            en: "🛡️ Admin Panel"
        },


        /* ========================================================
           HOME
        ======================================================== */

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

        "📲 ՆԵՐԲԵՌՆԵԼ ՀԱՎԵԼՎԱԾԸ": {
            ru: "📲 СКАЧАТЬ ПРИЛОЖЕНИЕ",
            en: "📲 DOWNLOAD APP"
        },

        "Մեր Խաղացողները": {
            ru: "Наши игроки",
            en: "Our Players"
        },

        "Միանալ Կլանին": {
            ru: "Присоединиться к клану",
            en: "Join the Clan"
        },

        "ՄԻԱՆԱԼ ԿԼԱՆԻՆ": {
            ru: "ПРИСОЕДИНИТЬСЯ К КЛАНУ",
            en: "JOIN THE CLAN"
        },

        "🎯 1VS1 Bottle": {
            ru: "🎯 1VS1 Bottle",
            en: "🎯 1VS1 Bottle"
        },

        "📋 Հարցաթերթիկ": {
            ru: "📋 Анкета",
            en: "📋 Questionnaire"
        },

        "🎬 Վիդեոներ և նկարներ": {
            ru: "🎬 Видео и фотографии",
            en: "🎬 Videos and Photos"
        },

        "🧠 PUBG ՔՆՆՈՒԹՅՈՒՆ": {
            ru: "🧠 ЭКЗАМЕН PUBG",
            en: "🧠 PUBG EXAM"
        },

        "🧠 PUBG ՔՆՆՈՒԹՅԱՆ ԱՐԴՅՈՒՆՔՆԵՐ": {
            ru: "🧠 РЕЗУЛЬТАТЫ ЭКЗАМЕНА PUBG",
            en: "🧠 PUBG EXAM RESULTS"
        },


        /* ========================================================
           ABOUT
        ======================================================== */

        "Ով ենք մենք": {
            ru: "Кто мы",
            en: "Who We Are"
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

        "Մեր ճանապարհը": {
            ru: "Наш путь",
            en: "Our Journey"
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


        /* ========================================================
           ACCOUNT / AUTH
        ======================================================== */

        "Էլ․ փոստ": {
            ru: "Электронная почта",
            en: "Email"
        },

        "Էլ. փոստ": {
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

        "Հաստատել գաղտնաբառը": {
            ru: "Подтвердить пароль",
            en: "Confirm password"
        },

        "Մուտք գործել": {
            ru: "Войти",
            en: "Login"
        },

        "Մուտք գործեք": {
            ru: "Войдите",
            en: "Log in"
        },

        "Վերականգնել գաղտնաբառը": {
            ru: "Восстановить пароль",
            en: "Reset Password"
        },

        "Նոր գաղտնաբառ": {
            ru: "Новый пароль",
            en: "New Password"
        },

        "Հիշել ինձ": {
            ru: "Запомнить меня",
            en: "Remember me"
        },


        /* ========================================================
           FRIENDS
        ======================================================== */

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


        /* ========================================================
           CHAT
        ======================================================== */

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


        /* ========================================================
           NOTIFICATIONS
        ======================================================== */

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


        /* ========================================================
           MEDIA
        ======================================================== */

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

        "Վերբեռնել": {
            ru: "Загрузить",
            en: "Upload"
        },

        "Ավելացնել": {
            ru: "Добавить",
            en: "Add"
        },

        "🗑️ Ջնջել": {
            ru: "🗑️ Удалить",
            en: "🗑️ Delete"
        },

        "Ջնջել": {
            ru: "Удалить",
            en: "Delete"
        },


        /* ========================================================
           1VS1
        ======================================================== */

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

        "Դադարեցված": {
            ru: "Приостановлен",
            en: "Paused"
        },

        "⏸️ Դադարեցված": {
            ru: "⏸️ Приостановлен",
            en: "⏸️ Paused"
        },

        "Ավարտված": {
            ru: "Завершён",
            en: "Finished"
        },

        "🏁 Ավարտված": {
            ru: "🏁 Завершён",
            en: "🏁 Finished"
        },

        "🟢 Ակտիվ": {
            ru: "🟢 Активен",
            en: "🟢 Active"
        },

        "Խաղերը ժամանակավորապես դադարեցված են": {
            ru: "Игры временно приостановлены",
            en: "Games are temporarily paused"
        },

        "Այս փուլը ավարտված է": {
            ru: "Этот раунд завершён",
            en: "This round is finished"
        },

        "ՎԵՐՋՆԱԿԱՆ ՀԱՂԹՈՂ": {
            ru: "ФИНАЛЬНЫЙ ПОБЕДИТЕЛЬ",
            en: "FINAL WINNER"
        },

        "Վերջնական հաղթող": {
            ru: "Финальный победитель",
            en: "Final winner"
        },

        "Ընտրեք այս փուլի հաղթողին։ Սա չի փոխում բուտիլկայի խաղացողների ցանկը։": {
            ru: "Выберите победителя этого раунда. Это не изменяет список игроков бутылки.",
            en: "Choose the winner of this round. This does not change the bottle player list."
        },

        "Ընտրել նիկը…": {
            ru: "Выбрать ник...",
            en: "Select nickname..."
        },

        "💾 Պահպանել հաղթողին": {
            ru: "💾 Сохранить победителя",
            en: "💾 Save winner"
        },

        "Այս փուլում զույգեր չկան։": {
            ru: "В этом раунде нет пар.",
            en: "There are no pairs in this round."
        },

        "Չհաջողվեց բեռնել 1VS1 արդյունքը։": {
            ru: "Не удалось загрузить результат 1VS1.",
            en: "Failed to load the 1VS1 result."
        },

        "Չհաջողվեց բեռնել ցանկը։": {
            ru: "Не удалось загрузить список.",
            en: "Failed to load the list."
        },

        "Ցանկը դատարկ է։ Սեղմեք «Վերցնել index.html-ից»։": {
            ru: "Список пуст. Нажмите «Получить из index.html».",
            en: "The list is empty. Click \"Get from index.html\"."
        },

        "Մասնակցում է": {
            ru: "Участвует",
            en: "Participating"
        },

        "Նիկը դատարկ լինել չի կարող։": {
            ru: "Ник не может быть пустым.",
            en: "Nickname cannot be empty."
        },

        "Չհաջողվեց պահպանել խաղացողին։": {
            ru: "Не удалось сохранить игрока.",
            en: "Failed to save player."
        },

        "Խաղացողը պահպանվեց։": {
            ru: "Игрок сохранён.",
            en: "Player saved."
        },


        /* ========================================================
           CLAN APPLICATIONS
        ======================================================== */

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


        /* ========================================================
           EXAM
        ======================================================== */

        "PUBG ՔՆՆՈՒԹՅՈՒՆ": {
            ru: "ЭКЗАМЕН PUBG",
            en: "PUBG EXAM"
        },

        "PUBG Քննություն": {
            ru: "Экзамен PUBG",
            en: "PUBG Exam"
        },

        "Քննություն": {
            ru: "Экзамен",
            en: "Exam"
        },

        "Սկսել քննությունը": {
            ru: "Начать экзамен",
            en: "Start Exam"
        },

        "Սկսել": {
            ru: "Начать",
            en: "Start"
        },

        "Շարունակել": {
            ru: "Продолжить",
            en: "Continue"
        },

        "Հաջորդ հարց →": {
            ru: "Следующий вопрос →",
            en: "Next question →"
        },

        "🏆 Հանձնել քննությունը": {
            ru: "🏆 Сдать экзамен",
            en: "🏆 Submit Exam"
        },

        "Հանձնել քննությունը": {
            ru: "Сдать экзамен",
            en: "Submit Exam"
        },

        "Խնդրում ենք ընտրել պատասխան։": {
            ru: "Пожалуйста, выберите ответ.",
            en: "Please select an answer."
        },

        "Արդյունք": {
            ru: "Результат",
            en: "Result"
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


        /* ========================================================
           EXAM ADMIN
        ======================================================== */

        "Քննության արդյունքներ": {
            ru: "Результаты экзамена",
            en: "Exam Results"
        },

        "Ընդհանուր մասնակիցներ": {
            ru: "Всего участников",
            en: "Total Participants"
        },

        "Միջին արդյունք": {
            ru: "Средний результат",
            en: "Average Score"
        },

        "Կատարյալ արդյունքներ": {
            ru: "Идеальные результаты",
            en: "Perfect Scores"
        },

        "Դեռ ոչ ոք քննություն չի հանձնել։": {
            ru: "Пока никто не сдал экзамен.",
            en: "No one has taken the exam yet."
        },

        "❌ Չհաջողվեց բեռնել արդյունքները։": {
            ru: "❌ Не удалось загрузить результаты.",
            en: "❌ Failed to load results."
        },

        "Օգտատեր": {
            ru: "Пользователь",
            en: "User"
        },


        /* ========================================================
           QUIZ
        ======================================================== */

        "QUIZ": {
            ru: "QUIZ",
            en: "QUIZ"
        },

        "📚 AIMRELAX Quiz": {
            ru: "📚 AIMRELAX Quiz",
            en: "📚 AIMRELAX Quiz"
        },

        "Որքա՞ն լավ ես ճանաչում AIMRELAX-ը։ 1–5 հարցերը գնահատվում են ավտոմատ, 6–8-ը ազատ պատասխաններ են և տեսանելի են միայն Admin/Owner-ին։": {
            ru: "Насколько хорошо ты знаешь AIMRELAX? Вопросы 1–5 оцениваются автоматически, а 6–8 — свободные ответы, доступные только Admin/Owner.",
            en: "How well do you know AIMRELAX? Questions 1–5 are graded automatically, while 6–8 are free-text answers visible only to Admin/Owner."
        },

        "🔒 Մուտք է անհրաժեշտ": {
            ru: "🔒 Требуется вход",
            en: "🔒 Login Required"
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
            en: "🛡️ Admin / Owner — Answers"
        },

        "Բեռնվում է…": {
            ru: "Загрузка…",
            en: "Loading…"
        },

        "Բեռնվում է...": {
            ru: "Загрузка...",
            en: "Loading..."
        },


        /* ========================================================
           WEATHER
        ======================================================== */

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


        /* ========================================================
           GENERAL STATUS / FORMS
        ======================================================== */

        "Պահպանել": {
            ru: "Сохранить",
            en: "Save"
        },

        "Պահպանել փոփոխությունները": {
            ru: "Сохранить изменения",
            en: "Save changes"
        },

        "Փոփոխությունները պահպանված են": {
            ru: "Изменения сохранены",
            en: "Changes saved"
        },

        "Փակել": {
            ru: "Закрыть",
            en: "Close"
        },

        "Բացել": {
            ru: "Открыть",
            en: "Open"
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

        "Ուղարկել": {
            ru: "Отправить",
            en: "Send"
        },

        "Փնտրել": {
            ru: "Поиск",
            en: "Search"
        },

        "Սպասեք...": {
            ru: "Подождите...",
            en: "Please wait..."
        },

        "Խնդրում ենք սպասել...": {
            ru: "Пожалуйста, подождите...",
            en: "Please wait..."
        },

        "Բեռնվում է...": {
            ru: "Загрузка...",
            en: "Loading..."
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

        "Ոչ մի արդյունք": {
            ru: "Нет результатов",
            en: "No results"
        },

        "Այստեղ դեռ ոչինչ չկա": {
            ru: "Здесь пока ничего нет",
            en: "Nothing here yet"
        },


        /* ========================================================
           CONTACT
        ======================================================== */

        "Ձեր նամակը": {
            ru: "Ваше сообщение",
            en: "Your message"
        },

        "Ձեր հաղորդագրությունը": {
            ru: "Ваше сообщение",
            en: "Your message"
        },

        "ՈՒՂԱՐԿԵԼ ՆԱՄԱԿԸ": {
            ru: "ОТПРАВИТЬ СООБЩЕНИЕ",
            en: "SEND MESSAGE"
        },

        "ԿԱՊ ՀԱՍՏԱՏԵԼ": {
            ru: "СВЯЗАТЬСЯ С НАМИ",
            en: "CONTACT US"
        },


        /* ========================================================
           COMMON VALIDATION
        ======================================================== */

        "Լրացրեք բոլոր դաշտերը": {
            ru: "Заполните все поля",
            en: "Fill in all fields"
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
            ru: "Пожалуйста, напишите ваше сообщение",
            en: "Please enter your message"
        },


        /* ========================================================
           EXTRA COMMON STRINGS
        ======================================================== */

        "Բարի գալուստ": {
            ru: "Добро пожаловать",
            en: "Welcome"
        },

        "Շնորհակալություն": {
            ru: "Спасибо",
            en: "Thank you"
        },

        "Ընտրել": {
            ru: "Выбрать",
            en: "Select"
        },

        "Հաջորդ էջ": {
            ru: "Следующая страница",
            en: "Next page"
        },

        "Նախորդ էջ": {
            ru: "Предыдущая страница",
            en: "Previous page"
        }
    };


    /* ============================================================
       PROTECTED AREAS
       ============================================================ */

    const PROTECTED_SELECTORS = [
        "script",
        "style",
        "noscript",
        "textarea",
        "input",
        "[contenteditable='true']",

        ".chat-message",
        ".private-message",
        ".comment-row",

        ".player h3",
        ".player .nickname",
        ".player-name",
        ".profile-name",
        ".friend-row .friend-name",

        ".roster-name",
        ".winner-name",

        "#private-messages",
        ".private-messages",

        "[data-user-content='true']"
    ];


    function isProtected(element) {

        if (!element) {
            return true;
        }

        try {
            return !!element.closest(
                PROTECTED_SELECTORS.join(",")
            );
        } catch (e) {
            return false;
        }
    }


    /* ============================================================
       TEXT NORMALIZATION
       ============================================================ */

    function normalize(text) {

        return String(text || "")
            .replace(/\u00A0/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    function getTranslation(original, lang) {

        const key = normalize(original);

        if (!key) {
            return original;
        }

        const item = translations[key];

        if (!item) {
            return original;
        }

        if (lang === "hy") {
            return item.hy || key;
        }

        return item[lang] || original;

    }


    /* ============================================================
       ORIGINAL TEXT STORAGE
       ============================================================ */

    const originalTextNodes = new WeakMap();
    const originalAttributes = new WeakMap();


    /* ============================================================
       TEXT TRANSLATION
       ============================================================ */

    function translateTextNode(node, lang) {

        if (!node || node.nodeType !== Node.TEXT_NODE) {
            return;
        }

        const parent = node.parentElement;

        if (!parent || isProtected(parent)) {
            return;
        }

        if (!originalTextNodes.has(node)) {
            originalTextNodes.set(
                node,
                node.nodeValue
            );
        }

        const original =
            originalTextNodes.get(node);

        const translated =
            getTranslation(
                original,
                lang
            );

        if (translated !== original) {
            node.nodeValue = translated;
        } else if (lang === "hy") {
            node.nodeValue = original;
        }
    }


    function translateElement(element, lang) {

        if (!element || isProtected(element)) {
            return;
        }

        /*
         * Do not recursively scan huge user/data containers.
         */

        const walker =
            document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function (node) {

                        if (!node.parentElement) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        if (
                            isProtected(
                                node.parentElement
                            )
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

        const nodes = [];

        let current;

        while (
            (current = walker.nextNode())
        ) {
            nodes.push(current);
        }

        nodes.forEach(function (node) {
            translateTextNode(
                node,
                lang
            );
        });
    }


    /* ============================================================
       ATTRIBUTE TRANSLATION
       ============================================================ */

    const TRANSLATABLE_ATTRIBUTES = [
        "placeholder",
        "title",
        "aria-label"
    ];


    function translateAttributes(lang) {

        const elements =
            document.querySelectorAll(
                "input,textarea,button,[title],[aria-label]"
            );

        elements.forEach(function (element) {

            if (isProtected(element)) {
                return;
            }

            TRANSLATABLE_ATTRIBUTES.forEach(
                function (attribute) {

                    if (
                        !element.hasAttribute(
                            attribute
                        )
                    ) {
                        return;
                    }

                    if (
                        !originalAttributes.has(
                            element
                        )
                    ) {
                        originalAttributes.set(
                            element,
                            {}
                        );
                    }

                    const saved =
                        originalAttributes.get(
                            element
                        );

                    if (
                        !Object.prototype.hasOwnProperty.call(
                            saved,
                            attribute
                        )
                    ) {
                        saved[attribute] =
                            element.getAttribute(
                                attribute
                            );
                    }

                    const original =
                        saved[attribute];

                    const translated =
                        getTranslation(
                            original,
                            lang
                        );

                    element.setAttribute(
                        attribute,
                        translated
                    );

                }
            );

        });

    }


    /* ============================================================
       PAGE-SPECIFIC STATIC/DYNAMIC AREAS
       ============================================================ */

    function translatePage(lang) {

        /*
         * Main visible document.
         *
         * We intentionally exclude:
         * chat
         * comments
         * nicknames
         * user-generated content
         */

        const roots = [

            document.querySelector("header"),
            document.querySelector("main"),
            document.querySelector("footer"),

            document.querySelector(".wrap"),

            document.querySelector(".hero"),

            document.querySelector("#auth-vote"),

            document.querySelector("#login"),
            document.querySelector("#already"),
            document.querySelector("#result"),
            document.querySelector("#admin"),

            document.querySelector("#matches"),
            document.querySelector("#roster-manager"),

            document.querySelector("#examScreen"),
            document.querySelector("#startScreen"),
            document.querySelector("#resultScreen"),

            document.querySelector(".account-modal"),
            document.querySelector(".profile-modal"),

            document.querySelector(".community-grid"),

            document.querySelector(".private-chat-popup")

        ];

        const uniqueRoots = [];

        roots.forEach(function (root) {

            if (
                root &&
                uniqueRoots.indexOf(root) === -1
            ) {
                uniqueRoots.push(root);
            }

        });


        if (!uniqueRoots.length) {

            translateElement(
                document.body,
                lang
            );

        } else {

            uniqueRoots.forEach(
                function (root) {

                    translateElement(
                        root,
                        lang
                    );

                }
            );

        }


        translateAttributes(lang);
    }


    /* ============================================================
       LANGUAGE SELECTOR
       ============================================================ */

    function createLanguageSelector() {

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
            <select
                id="aimrelax-language"
                aria-label="Language"
            >
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
                top: 10px;
                right: 10px;
                z-index: 999999;
            }

            #aimrelax-language {
                appearance: auto;
                background: #111;
                color: #fff;
                border: 1px solid #ff7200;
                border-radius: 7px;
                padding: 7px 9px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                outline: none;
                box-shadow: 0 4px 18px rgba(0,0,0,.35);
            }

            #aimrelax-language:hover {
                border-color: #fff;
            }

            #aimrelax-language:focus {
                border-color: #ff7200;
            }

            @media(max-width:650px) {
                #aimrelax-language-selector {
                    top: 6px;
                    right: 6px;
                }

                #aimrelax-language {
                    padding: 6px 7px;
                    font-size: 10px;
                }
            }
        `;


        document.head.appendChild(
            style
        );

        document.body.appendChild(
            wrapper
        );


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


    /* ============================================================
       LANGUAGE STORAGE
       ============================================================ */

    function getLanguage() {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (
            saved === "hy" ||
            saved === "ru" ||
            saved === "en"
        ) {
            return saved;
        }

        return DEFAULT_LANGUAGE;
    }


    function saveLanguage(lang) {

        localStorage.setItem(
            STORAGE_KEY,
            lang
        );

    }


    /* ============================================================
       MAIN LANGUAGE FUNCTION
       ============================================================ */

    function setLanguage(lang) {

        if (
            lang !== "hy" &&
            lang !== "ru" &&
            lang !== "en"
        ) {
            lang = DEFAULT_LANGUAGE;
        }


        saveLanguage(lang);


        document.documentElement.lang =
            lang;


        /*
         * Translate currently available UI.
         */

        translatePage(lang);


        /*
         * Update selector.
         */

        const select =
            document.getElementById(
                "aimrelax-language"
            );

        if (select) {
            select.value = lang;
        }


        /*
         * Some pages render content from Supabase
         * shortly after page load.
         *
         * We do a few controlled delayed passes.
         *
         * NO MutationObserver.
         */

        setTimeout(function () {

            try {
                translatePage(lang);
            } catch (e) {}

        }, 500);


        setTimeout(function () {

            try {
                translatePage(lang);
            } catch (e) {}

        }, 1500);


        setTimeout(function () {

            try {
                translatePage(lang);
            } catch (e) {}

        }, 3000);


        /*
         * Tell existing AIMRELAX code that
         * language has changed.
         */

        try {

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

        } catch (e) {}

    }


    /* ============================================================
       PUBLIC API
       ============================================================ */

    window.AIMRELAX_LANGUAGE = {

        setLanguage: setLanguage,

        getLanguage: getLanguage,

        translate: function (
            text,
            lang
        ) {

            return getTranslation(
                text,
                lang || getLanguage()
            );

        },

        languages: LANGUAGES,

        translations: translations,

        refresh: function () {

            translatePage(
                getLanguage()
            );

        }

    };


    /* ============================================================
       INITIALIZATION
       ============================================================ */

    function init() {

        try {

            createLanguageSelector();

            setLanguage(
                getLanguage()
            );

        } catch (error) {

            /*
             * Language system must never
             * break the website.
             */

            console.error(
                "AIMRELAX language error:",
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
