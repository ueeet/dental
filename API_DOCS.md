# API Documentation — Dental Clinic

Base URL: `http://localhost:4000/api`

## Аутентификация

Все POST/PUT/DELETE запросы (кроме публичных) требуют заголовок:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth

### POST /auth/login
Вход администратора.

**Body:**
```json
{
  "login": "admin",
  "password": "пароль"
}
```

**Response 200:**
```json
{
  "token": "jwt_token_here"
}
```

**Response 401:**
```json
{
  "error": "Неверный логин или пароль"
}
```

---

## Услуги (Services)

### GET /services
Получить все услуги.

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Чистка зубов",
    "description": "Профессиональная чистка...",
    "price": 3000,
    "duration": 60,
    "category": "Гигиена",
    "isActive": true,
    "createdAt": "2026-04-01T00:00:00.000Z"
  }
]
```

### POST /services *(admin)*
Создать услугу.

### PUT /services/:id *(admin)*
Обновить услугу.

### DELETE /services/:id *(admin)*
Удалить услугу.

---

## Врачи (Doctors)

### GET /doctors
Получить всех врачей.

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Иванов Иван Иванович",
    "specialty": "Терапевт",
    "experience": 10,
    "photo": "https://...",
    "description": "Опытный специалист...",
    "isActive": true,
    "schedule": {
      "monday": { "start": "09:00", "end": "18:00" },
      "tuesday": { "start": "09:00", "end": "18:00" }
    }
  }
]
```

### POST /doctors *(admin)*
Создать врача.

### PUT /doctors/:id *(admin)*
Обновить врача.

### DELETE /doctors/:id *(admin)*
Удалить врача.

---

## Записи на приём (Bookings)

### GET /bookings *(admin)*
Получить все записи.

**Query params:**
- `status` — фильтр по статусу (new, confirmed, completed, cancelled)
- `doctorId` — фильтр по врачу

### POST /bookings
Создать запись (публичный).

**Body:**
```json
{
  "patientName": "Петров Пётр",
  "phone": "+79001234567",
  "doctorId": 1,
  "serviceId": 1,
  "date": "2026-04-15",
  "time": "10:00",
  "comment": "Болит зуб",
  "consentGiven": true
}
```

**Валидация:**
- Один номер телефона = одна активная заявка
- `consentGiven` должен быть `true`
- Дата/время должны попадать в график врача

### PUT /bookings/:id *(admin)*
Обновить статус записи.

### DELETE /bookings/:id *(admin)*
Удалить запись.

---

## Портфолио (Portfolio)

### GET /portfolio
Получить все работы.

**Query params:**
- `doctorId` — фильтр по врачу
- `category` — фильтр по категории

### POST /portfolio *(admin)*
Добавить работу.

### DELETE /portfolio/:id *(admin)*
Удалить работу.

---

## Загрузка файлов (Upload)

### POST /upload *(admin)*
Загрузить изображение.

**Content-Type:** `multipart/form-data`
**Field:** `file`

**Response 200:**
```json
{
  "url": "https://xxx.supabase.co/storage/v1/object/public/photos/filename.jpg"
}
```

---

## Статистика (Stats)

### GET /stats *(admin)*
Статистика для админки.

**Response 200:**
```json
{
  "totalBookings": 150,
  "newBookings": 12,
  "completedBookings": 100,
  "cancelledBookings": 10,
  "popularServices": [...],
  "bookingsByMonth": [...]
}
```
