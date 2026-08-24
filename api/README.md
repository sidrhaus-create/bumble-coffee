# api/

**В этой сборке серверный код НЕ используется.**

Форма «ПАРТНЁРАМ» больше не обращается к бэкенду: она передаёт заявку родительской
странице Tilda через `postMessage` и ждёт подтверждения.

* iframe → parent: `{ type: 'BUMBLE_PARTNERS_SUBMIT', data: { name, phone, email, subject } }`
* parent → iframe: `{ type: 'BUMBLE_PARTNERS_RESULT', ok: true | false, error? }`

Экран «СПАСИБО. СВЯЖЕМСЯ С ВАМИ.» показывается только при `ok: true` с origin
`https://bumblephoenix.ru`. Письмо отправляет нативная форма Tilda на
info@bumblephoenix.ru.

## Если в вашей старой папке `api/` лежали свои файлы

Я их не видел и не могу восстановить. Перед заменой папки скопируйте старую `api/`
в сторону: если хостинг (Vercel / Netlify Functions) до сих пор её вызывает, положите
свои файлы обратно сюда. Сайт от этого не изменится — он в эту папку не обращается.

## Если позже понадобится свой обработчик

Положите сюда serverless-функцию (например `partners.js` для Vercel) и в
`Bumble Partners.html` замените мост `postMessage` на `fetch('/api/partners', …)`.
