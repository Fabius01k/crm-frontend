# Описание эндпоинтов CRM-бэкенда

## Базовый URL
`http://localhost:3000` (или другой хост, где развернут сервер)

## Аутентификация
Используется JWT-токен в заголовке `Authorization: Bearer <token>`. Для некоторых эндпоинтов требуется роль `TEAMLEAD`.

## Роли пользователей
- `EMPLOYEE` – сотрудник
- `TEAMLEAD` – руководитель команды (имеет расширенные права)
- `INTERN` – стажёр

---

## Эндпоинты

### Аутентификация (`/auth`)

#### POST `/auth/login`
- **Описание:** Вход в систему, получение JWT-токена
- **Требования:** Нет
- **Тело запроса:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Ответ (успех):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### POST `/auth/refresh`
- **Описание:** Обновление access-токена с помощью refresh-токена (в куках)
- **Требования:** Нет
- **Тело запроса:** –
- **Ответ (успех):** Новый access-токен в том же формате, что и при логине

#### POST `/auth/logout`
- **Описание:** Выход из системы, инвалидация refresh-токена
- **Требования:** JWT
- **Тело запроса:** –
- **Ответ (успех):** `{ "message": "Logged out successfully" }`

### Компания (`/company`)

#### GET `/company/structure`
- **Описание:** Получение структуры компании (департаменты, позиции, графики работы, смены, грейды)
- **Требования:** Нет
- **Тело запроса:** –
- **Ответ (успех):**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "code": "support",
        "name": "Техподдержка",
        "isActive": true,
        "positions": [
          {
            "id": "uuid",
            "code": "support",
            "name": "Специалист техподдержки",
            "isActive": true,
            "workSchedule": { "id": "uuid", "code": "default", "name": "Стандартный график", "isActive": true },
            "shiftPreferences": [
              { "id": "uuid", "code": "morning", "name": "Утренняя смена", "isActive": true }
            ],
            "grades": [
              { "id": "uuid", "code": "middle", "name": "Middle", "isActive": true }
            ]
          }
        ]
      }
    ]
  }
  ```

### Пользователи (`/users`)

#### POST `/users`
- **Описание:** Создание нового пользователя
- **Требования:** JWT, роль `TEAMLEAD`
- **Тело запроса:** `CreateUserDto`
  ```json
  {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string?",
    "birthDate": "string (ISO date)",
    "phoneNumber": "string?",
    "tgLink": "string?",
    "role": "EMPLOYEE | TEAMLEAD | INTERN?",
    "department": "DepartmentCode?",
    "position": "PositionCode?",
    "shiftPreference": "ShiftPreferenceCode?",
    "grade": "UserGradeCode?"
  }
  ```
- **Ответ (успех):** Созданный пользователь с полями `id`, `email`, `role`, `profile`, `workInfo` (аналогично ответу `/users/:id/page`)

#### GET `/users`
- **Описание:** Получение списка пользователей с фильтрацией
- **Требования:** JWT, роль `TEAMLEAD`
- **Query-параметры:**
  - `department`: DepartmentCode?
  - `position`: PositionCode?
  - `grade`: UserGradeCode?
  - `workSchedule`: WorkScheduleCode?
  - `shiftPreference`: ShiftPreferenceCode?
  - `page`: number (default: 1)
- **Ответ (успех):** Массив пользователей с пагинацией (структура аналогична ответу `/users/:id/page`)

#### GET `/users/search`
- **Описание:** Поиск пользователей по строке
- **Требования:** JWT, роль `TEAMLEAD`
- **Query-параметр:** `q` (строка поиска)
- **Ответ (успех):** Массив пользователей, соответствующих поисковому запросу

#### GET `/users/me/page`
- **Описание:** Получение собственной страницы пользователя
- **Требования:** JWT
- **Тело запроса:** –
- **Ответ (успех):**
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "role": "EMPLOYEE",
    "profile": {
      "firstName": "Иван",
      "lastName": "Иванов",
      "middleName": "Иванович",
      "birthDate": "1990-01-01",
      "phoneNumber": "+79991234567",
      "tgLink": "@ivanov"
    },
    "workInfo": {
      "department": { "code": "support", "name": "Техподдержка" },
      "position": { "code": "support", "name": "Специалист техподдержки" },
      "shiftPreference": { "code": "morning", "name": "Утренняя смена" },
      "grade": { "code": "middle", "name": "Middle" },
      "workSchedule": { "code": "default", "name": "Стандартный график" }
    }
  }
  ```

#### GET `/users/:id/page`
- **Описание:** Получение страницы пользователя по ID
- **Требования:** Нет (публичный)
- **Тело запроса:** –
- **Ответ (успех):** Аналогично `/users/me/page`, но для указанного пользователя

#### PUT `/users/:id/profile`
- **Описание:** Обновление профиля пользователя
- **Требования:** JWT, роль `TEAMLEAD`
- **Тело запроса:** `UpdateUserProfileDto`
  ```json
  {
    "firstName": "string?",
    "lastName": "string?",
    "middleName": "string?",
    "birthDate": "string?",
    "phoneNumber": "string?",
    "tgLink": "string?"
  }
  ```
- **Ответ (успех):** Обновлённый профиль пользователя

#### PUT `/users/:id/work-info`
- **Описание:** Обновление рабочей информации пользователя
- **Требования:** JWT, роль `TEAMLEAD`
- **Тело запроса:** `UpdateUserWorkInfoDto`
  ```json
  {
    "department": "DepartmentCode?",
    "position": "PositionCode?",
    "shiftPreference": "ShiftPreferenceCode?",
    "grade": "UserGradeCode?"
  }
  ```
- **Ответ (успех):** Обновлённая рабочая информация пользователя

#### PUT `/users/me/password`
- **Описание:** Смена собственного пароля
- **Требования:** JWT, роль `TEAMLEAD`
- **Тело запроса:** `ChangeOwnPasswordDto`
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Ответ (успех):** `{ "message": "Password changed successfully" }`

#### PUT `/users/:id/password`
- **Описание:** Смена пароля пользователя администратором
- **Требования:** JWT, роль `TEAMLEAD`
- **Тело запроса:** `AdminChangePasswordDto`
  ```json
  {
    "newPassword": "string"
  }
  ```
- **Ответ (успех):** `{ "message": "Password changed successfully" }`

#### DELETE `/users/:id`
- **Описание:** Мягкое удаление/восстановление пользователя (флаг isDeleted)
- **Требования:** JWT, роль `TEAMLEAD`
- **Тело запроса:** `{ "isDeleted": boolean }`
- **Ответ (успех):** `{ "message": "User deleted/restored successfully" }`

---

## Коды справочников

### DepartmentCode
- `support`
- `vip_support`
- `it`
- `affiliate`
- `quality`

### PositionCode
- `support`
- `vip_support`
- `affiliate_manager`
- `quality_manager`
- `backend_developer`
- `frontend_developer`
- `fullstack_developer`
- `support_teamlead`
- `dev_teamlead`
- `vip_support_teamlead`
- `quality_teamlead`
- `affiliate_teamlead`

### ShiftPreferenceCode
- `morning`
- `day`
- `night`
- `mixed`

### UserGradeCode
- `junior`
- `middle`
- `senior`

### WorkScheduleCode
- `default`
- `shift_schedule`

---

## Примечания
1. Все даты передаются в формате ISO 8601 (YYYY-MM-DD).
2. Параметры запроса, помеченные `?`, являются необязательными.
3. Для эндпоинтов, требующих JWT, необходимо добавлять заголовок `Authorization: Bearer <token>`.
4. Роль `TEAMLEAD` требуется для управления пользователями (создание, редактирование, удаление).
5. При удалении пользователя используется мягкое удаление (флаг `isDeleted`), эндпоинт `DELETE /users/:id` принимает `{ "isDeleted": true/false }`.

---
*Документация актуальна на январь 2026 года.*