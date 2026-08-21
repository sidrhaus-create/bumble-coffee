# Отправка заявок с формы «ПАРТНЁРАМ»

Статический сайт (GitHub Pages) **не может** отправлять почту сам — нужен один
серверless-обработчик. Он лежит здесь: `api/partners.js`. Ключи живут только в
переменных окружения хостинга, в браузер не попадает ничего секретного.

## 1. Почтовый провайдер

Заведите аккаунт в **Resend** (resend.com, бесплатный тариф — 3 000 писем/мес)
и подтвердите домен `bumblephoenix.ru` (DNS-записи SPF/DKIM даёт панель Resend).
Скопируйте API-ключ.

Альтернативы без изменения кода фронтенда: SendGrid, Postmark, Brevo, SMTP через
nodemailer — меняется только функция `sendMail` в `api/partners.js`.

## 2. Деплой обработчика

**Vercel (проще всего)**

1. Создайте пустой проект, положите файл как `api/partners.js`.
2. Settings → Environment Variables:
   - `RESEND_API_KEY` = ключ из Resend
   - `MAIL_FROM` = `Bumble Coffee <site@bumblephoenix.ru>` (домен должен быть подтверждён)
   - `MAIL_TO` = `info@bumblephoenix.ru`
   - `ALLOW_ORIGIN` = адрес сайта, например `https://bumblephoenix.ru`
3. Deploy → адрес функции: `https://<проект>.vercel.app/api/partners`

**Netlify** — тот же файл как `netlify/functions/partners.js`, те же переменные,
адрес: `https://<сайт>.netlify.app/.netlify/functions/partners`.

## 3. Подключение фронтенда

В `Bumble Partners.dc.html` (и в копии внутри `tilda-build/`) свойство
`endpoint` по умолчанию **пустое** — форма намеренно не показывает успех, пока
адрес не задан. Впишите полный URL функции:

```
&quot;endpoint&quot;:{ ... &quot;default&quot;:&quot;https://<проект>.vercel.app/api/partners&quot; ... }
```

или задайте его в панели Tweaks (раздел «Отправка заявки»).

## 4. Проверка

Отправьте тестовую заявку. Экран «СПАСИБО. СВЯЖЕМСЯ С ВАМИ. / ЗАЯВКА ПРИНЯТА»
появляется **только** после ответа 2xx от функции. При любой ошибке показывается
«НЕ УДАЛОСЬ ОТПРАВИТЬ. ПОПРОБУЙТЕ ЕЩЁ РАЗ.», введённые данные остаются на месте,
причина пишется в консоль. Письмо приходит на `info@bumblephoenix.ru` с темой
«Новая заявка партнёра — Bumble Coffee» и полями Имя / Телефон / Почта / Тема обращения.
