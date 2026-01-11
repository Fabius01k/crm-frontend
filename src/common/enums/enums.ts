// Используем объекты с as const вместо enum для совместимости с erasableSyntaxOnly

// WorkScheduleCode из документации
export const WorkScheduleEnum = {
  DEFAULT: 'default',
  SHIFT_SCHEDULE: 'shift_schedule',
} as const;

export type WorkSchedule = (typeof WorkScheduleEnum)[keyof typeof WorkScheduleEnum];

// ShiftPreferenceCode из документации
export const ShiftPreferenceEnum = {
  MORNING: 'morning',
  DAY: 'day',
  NIGHT: 'night',
  MIXED: 'mixed',
} as const;

export type ShiftPreference = (typeof ShiftPreferenceEnum)[keyof typeof ShiftPreferenceEnum];

// UserRole из документации (верхний регистр)
export const UserRoleEnum = {
  EMPLOYEE: 'EMPLOYEE',
  TEAMLEAD: 'TEAMLEAD',
  INTERN: 'INTERN',
} as const;

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

// Русскоязычные названия-расшифровки
export const WorkScheduleLabels: Record<WorkSchedule, string> = {
  [WorkScheduleEnum.DEFAULT]: 'Стандартный',
  [WorkScheduleEnum.SHIFT_SCHEDULE]: 'Сменный',
} as const;

export const ShiftPreferenceLabels: Record<ShiftPreference, string> = {
  [ShiftPreferenceEnum.MORNING]: 'Утренняя',
  [ShiftPreferenceEnum.DAY]: 'Дневная',
  [ShiftPreferenceEnum.NIGHT]: 'Ночная',
  [ShiftPreferenceEnum.MIXED]: 'Любая',
} as const;

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRoleEnum.EMPLOYEE]: 'Сотрудник',
  [UserRoleEnum.TEAMLEAD]: 'Тимлид',
  [UserRoleEnum.INTERN]: 'Стажёр',
} as const;

// Вспомогательная функция для получения русскоязычного названия
export function getLabel(value: string, labels: Record<string, string>): string {
  return labels[value] || value;
}