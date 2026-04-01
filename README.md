# IQ Dental — Сайт стоматологической клиники

Fullstack-проект сайта стоматологии с онлайн-записью, админ-панелью и интеграциями.

## Стек

### Backend
- **Express** + **TypeScript** — REST API
- **Prisma 7** + **PostgreSQL** (Supabase) — БД, отдельная схема `iq`
- **JWT** — access (15 мин) + refresh (7 дней) токены
- **Zod** — валидация входных данных
- **Telegraf** — Telegram-бот с inline-кнопками
- **SMS.ru** — SMS-уведомления пациентам
- **SSE** — realtime уведомления в админку
- **Pino** — логирование
- **node-cron** — парсинг отзывов с 2GIS/Яндекс.Карт

### Frontend
- **Next.js** + **TypeScript** + **Tailwind CSS**
- **GSAP** — анимации
- **shadcn/ui** — UI-компоненты

## Структура

```
dental/
├── backend/           # API сервер (порт 4000)
│   ├── src/
│   │   ├── routes/    # auth, doctors, services, bookings, reviews, promotions, portfolio, upload, stats, settings
│   │   ├── middleware/ # JWT auth, zod validate, async error handler
│   │   ├── lib/       # SMS, Telegram, SSE, парсинг отзывов, логгер, валидаторы, XSS
│   │   └── seed.ts    # Заполнение БД тестовыми данными
│   └── prisma/
│       └── schema.prisma  # 8 моделей
├── frontend/          # Next.js приложение (порт 3000)
└── API_DOCS.md        # Документация API
```

## Быстрый старт

### Backend
```bash
cd backend
cp .env.example .env     # заполнить переменные
npm install
npx prisma generate
npm run seed             # заполнить БД данными
npm run dev              # http://localhost:4000
```

### Frontend
```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                  # http://localhost:3000
```

## API

Полная документация: [API_DOCS.md](API_DOCS.md)

| Роут | Публичный | Админский |
|---|---|---|
| `/api/auth` | — | login, refresh, setup |
| `/api/doctors` | GET | CRUD |
| `/api/services` | GET | CRUD |
| `/api/bookings` | POST запись | GET, PUT статус, DELETE |
| `/api/reviews` | GET, POST | модерация, DELETE |
| `/api/promotions` | GET | CRUD |
| `/api/portfolio` | GET | CRUD |
| `/api/upload` | — | загрузка фото |
| `/api/stats` | — | статистика |
| `/api/settings` | — | настройки клиники |
| `/api/events` | SSE | — |

## Безопасность

- Helmet + CORS + Rate limiting
- JWT с refresh-токенами, bcrypt (12 раундов)
- Zod-валидация + XSS-санитизация
- Проверка расписания врача и пересечения записей
- Один номер телефона = одна активная заявка

## Интеграции

- **Telegram** — уведомления менеджеру + кнопки подтверждения/отклонения
- **SMS.ru** — SMS при создании, подтверждении и отмене записи
- **2GIS / Яндекс.Карт** — автопарсинг отзывов (cron каждые 6ч)
- **Supabase Storage** — хранение фото
- **SSE** — realtime обновления в админ-панели

## Деплой

- **Backend** → Render
- **Frontend** → Vercel
- **БД** → Supabase (PostgreSQL)

## Команда

- Backend — [@ueeet](https://github.com/ueeet)
- Frontend — [@tagirov3322-blip](https://github.com/tagirov3322-blip)
