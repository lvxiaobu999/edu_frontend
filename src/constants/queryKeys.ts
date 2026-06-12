/** 查询 key 常量，按模块分组，支持分页/筛选参数动态拼接 */

export const queryKeys = {
  students: {
    all: ['students'] as const,
    list: (params: Record<string, unknown> = {}) => ['students', params] as const,
  },
  teachers: {
    all: ['teachers'] as const,
    list: (params: Record<string, unknown> = {}) => ['teachers', params] as const,
  },
  admins: {
    all: ['admins'] as const,
    list: (params: Record<string, unknown> = {}) => ['admins', params] as const,
  },
  scores: {
    all: ['scores'] as const,
    list: (params: Record<string, unknown> = {}) => ['scores', params] as const,
  },
  exams: {
    all: ['exams'] as const,
    list: (params: Record<string, unknown> = {}) => ['exams', params] as const,
  },
  classes: {
    all: ['classes'] as const,
    list: (params: Record<string, unknown> = {}) => ['classes', params] as const,
  },
  semester: {
    all: ['semesters'] as const,
    list: (params: Record<string, unknown> = {}) => ['semesters', params] as const,
  },
  subject: {
    all: ['subjects'] as const,
    list: (params: Record<string, unknown> = {}) => ['subjects', params] as const,
  },
  researchGroup: {
    all: ['research-groups'] as const,
    list: (params: Record<string, unknown> = {}) => ['research-groups', params] as const,
  },
  gradeClasses: {
    all: ['grade-classes'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
  },
  choices: {
    all: ['choices'] as const,
  },
} as const
