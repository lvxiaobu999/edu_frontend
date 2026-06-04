// ============ 角色 ============

export const Role = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const RoleLabel: Record<Role, string> = {
  [Role.ADMIN]: '管理员',
  [Role.TEACHER]: '老师',
  [Role.STUDENT]: '学生',
}

export const RoleOptions = Object.entries(RoleLabel).map(([value, label]) => ({ value, label }))

// ============ 性别 ============

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const

export type Gender = (typeof Gender)[keyof typeof Gender]

export const GenderLabel: Record<Gender, string> = {
  [Gender.MALE]: '男',
  [Gender.FEMALE]: '女',
}

export const GenderOptions = Object.entries(GenderLabel).map(([value, label]) => ({ value, label }))

// ============ 年级 ============

export const Grade = {
  GRADE_1: 'GRADE_1',
  GRADE_2: 'GRADE_2',
  GRADE_3: 'GRADE_3',
  GRADE_4: 'GRADE_4',
  GRADE_5: 'GRADE_5',
  GRADE_6: 'GRADE_6',
  GRADE_7: 'GRADE_7',
  GRADE_8: 'GRADE_8',
  GRADE_9: 'GRADE_9',
  SENIOR_1: 'SENIOR_1',
  SENIOR_2: 'SENIOR_2',
  SENIOR_3: 'SENIOR_3',
} as const

export type Grade = (typeof Grade)[keyof typeof Grade]

export const GradeLabel: Record<Grade, string> = {
  [Grade.GRADE_1]: '一年级',
  [Grade.GRADE_2]: '二年级',
  [Grade.GRADE_3]: '三年级',
  [Grade.GRADE_4]: '四年级',
  [Grade.GRADE_5]: '五年级',
  [Grade.GRADE_6]: '六年级',
  [Grade.GRADE_7]: '七年级',
  [Grade.GRADE_8]: '八年级',
  [Grade.GRADE_9]: '九年级',
  [Grade.SENIOR_1]: '高一',
  [Grade.SENIOR_2]: '高二',
  [Grade.SENIOR_3]: '高三',
}

export const GradeOptions = Object.entries(GradeLabel).map(([value, label]) => ({ value, label }))

// ============ 用户（匹配后端 User model） ============

export interface UserDto {
  id: string
  username: string
  email: string
  phone: string
  role: Role
  role_display: string
  real_name: string
  is_approved: boolean
  is_active: boolean
  date_joined: string
}

export interface LoginResponse {
  user: UserDto
  access: string
  refresh: string
}

// ============ 班级（匹配后端 Classes model） ============

export interface ClassesDto {
  id: string
  grade: Grade
  grade_display: string
  name: string
  headmaster: string | null
  headmaster_name: string
}

// ============ 教师简介（匹配后端 TeacherProfile model） ============

export interface TeacherProfileDto {
  id: string
  user: string
  user_name: string
  emp_no: string
  realname: string
  phone: string
  email: string
  address: string
  age: number | null
  gender: Gender | ''
  research_groups: string[]
  research_group_names: string[]
  class_ids: string[]
}

// ============ 学生简介（匹配后端 StudentProfile model） ============

export interface StudentProfileDto {
  id: string
  user: string
  user_name: string
  stu_no: string
  realname: string
  phone: string
  email: string
  address: string
  age: number | null
  gender: Gender | ''
  class_id: string | null
  class_name: string
}

// ============ 教研组（匹配后端 ResearchGroup model） ============

export interface ResearchGroupDto {
  id: string
  name: string
}

// ============ 仪表盘统计 ============

export interface DashboardStats {
  totals: {
    teachers: number
    students: number
    classes: number
    research_groups: number
  }
  distribution: {
    label: string
    count: number
  }[]
  description: string
}
