# План обновления структуры компании

## Цель
Адаптировать фронтенд к новому формату ответа API `getCompanyStructure`, который теперь включает:
- `data` - массив отделов с вложенными позициями и грейдами
- `positions` - плоский список всех позиций
- `grades` - плоский список всех грейдов

## Изменения

### 1. Обновление типов TypeScript (`src/store/features/user-slice/user-types.ts`)

#### Удалить импорт enum из `@/common/enums/enums`:
```diff
- import type {
-   UserGrade,
-   WorkSchedule,
-   ShiftPreference,
-   UserRole,
-   DepartmentCode,
-   PositionCode,
- } from '@/common/enums/enums';
```

#### Добавить новые типы (или заменить существующие):
```typescript
// Заменить типы, основанные на enum, на строки
export type DepartmentCode = string;
export type PositionCode = string;
export type UserGrade = string;
export type WorkSchedule = string;
export type ShiftPreference = string;
export type UserRole = string;
```

#### Обновить интерфейсы, чтобы использовать строки вместо enum:
- `User`, `UserProfileType`, `CreateUserDto`, `UpdateUserWorkInfoDto`, `FindUsersDto`, `FilterState`

#### Обновить `CompanyStructureResponse`:
```typescript
export interface CompanyStructureResponse {
  data: CompanyStructureDepartment[];
  positions: Array<{ code: string; name: string }>;
  grades: Array<{ code: string; name: string }>;
}
```

#### Обновить `CompanyStructureDepartment`:
Добавить поле `grades` (массив грейдов, относящихся к отделу). Структура грейда может быть `{ code: string; name: string }` или `GradeItem`.

#### Удалить устаревшие типы:
- `CompanyStructureItem`
- `Position` (старый)

#### Обновить `UserSliceType`:
Заменить `companyStructure: CompanyStructureDepartment[] | null` на `companyStructure: CompanyStructureResponse | null` (или разделить на три поля).

### 2. Обновление слайса (`src/store/features/user-slice/user-slice.ts`)

В экшене `fetchCompanyStructure.fulfilled` сохранять весь ответ:
```typescript
state.companyStructure = action.payload; // вместо action.payload.data
```

Соответственно обновить тип `companyStructure` в `UserSliceType` на `CompanyStructureResponse | null`.

### 3. Обновление логики фильтрации (`src/pages/users/users-page.tsx`)

#### Получение данных:
- Доступ к отделам: `companyStructure?.data`
- Доступ к позициям: `companyStructure?.positions`
- Доступ к грейдам: `companyStructure?.grades`

#### Динамическая фильтрация:
- При выборе отдела фильтровать позиции и грейды на основе вложенных данных отдела (из `data`).
- При выборе позиции фильтровать отделы и грейды на основе связи (нужно определить связь через данные отдела).
- При выборе грейда фильтровать отделы и позиции.

#### Функция `availableFilterOptions`:
Переписать логику, чтобы использовать новые данные.

#### Отображение названий:
Использовать `name` из `positions` и `grades` верхнего уровня для маппинга кодов в названия.

### 4. Обновление компонента фильтров (`src/pages/users/users-filter-form.tsx`)

#### Пропсы:
Заменить `companyStructure?: CompanyStructureItem[]` на `companyStructure?: CompanyStructureResponse` (или передавать отдельно `departments`, `positions`, `grades`).

#### Логика `computedPositions`:
Использовать `companyStructure.data` и `companyStructure.positions`.

#### Добавить вычисление грейдов на основе выбранного отдела/позиции.

### 5. Обновление модального окна создания пользователя (`src/components/create-user-modal/CreateUserModal.tsx`)

#### Удалить импорт `UserGradeEnum`, `WorkScheduleEnum`, `ShiftPreferenceEnum`, `UserRoleEnum` из `enums.ts`.

#### Использовать динамические данные:
- Отделы: `companyStructure?.data`
- Позиции: фильтровать на основе выбранного отдела из `companyStructure.data`
- Грейды: использовать `companyStructure?.grades` и фильтровать на основе выбранного отдела/позиции.

#### Опции для селектов:
Создавать на основе данных из `companyStructure`.

### 6. Обновление компонента просмотра профиля (`src/components/profile-view/profile-view.tsx`)

#### Удалить зависимость от `CompanyStructureItem`.
Использовать `companyStructure` нового типа для маппинга кодов в названия.

### 7. Удаление зависимостей от `enums.ts`

#### Удалить или закомментировать:
- `DepartmentCodeEnum`
- `PositionCodeEnum`
- `UserGradeEnum`
- `DepartmentCodeLabels`
- `PositionCodeLabels`
- `UserGradeLabels`

#### Обновить импорты во всех файлах:
Заменить импорты из `@/common/enums/enums` на импорты из `user-types` для типов `DepartmentCode`, `PositionCode`, `UserGrade`.

#### Функция `getLabel`:
Оставить, но использовать динамические данные из `companyStructure` вместо `*Labels`.

### 8. Тестирование

#### Проверки:
1. Загрузка структуры компании (убедиться, что данные сохраняются корректно).
2. Фильтрация пользователей по отделу, позиции, грейду.
3. Создание пользователя с выбором отдела, позиции, грейда.
4. Отображение названий вместо кодов в таблице пользователей и профиле.

## Последовательность выполнения

1. Обновить `user-types.ts`
2. Обновить `user-slice.ts`
3. Обновить `users-page.tsx`
4. Обновить `users-filter-form.tsx`
5. Обновить `CreateUserModal.tsx`
6. Обновить `profile-view.tsx`
7. Удалить зависимости от `enums.ts`
8. Протестировать

## Риски
- Возможна потеря типобезопасности при замене enum на string.
- Необходимо аккуратно обновить все импорты.
- Динамическая фильтрация может быть сложной в реализации.

## Альтернативы
- Сохранить enum как fallback, но это усложнит код.
- Использовать генерацию типов на основе ответа API (например, через кодогенерацию).