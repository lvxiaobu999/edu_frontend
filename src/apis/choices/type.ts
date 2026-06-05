export type ChoicesDto = Record<
  'roles' | 'grades' | 'exam_types' | 'genders',
  Array<{ value: string; label: string }>
>
