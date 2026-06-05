import Mock from 'mockjs'
import type {
  UserDto,
  LoginResponse,
  TeacherProfileDto,
  StudentProfileDto,
  ResearchGroupDto,
  ClassesDto,
} from '../src/apis/types'

// ============ 工具 ============

const now = () => Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")') as string
const createId = (prefix: string) => `${prefix}_${Mock.mock('@guid')}`

// ============ 用户存储 ============

type UserRecord = {
  id: string
  username: string
  password: string
  email: string
  phone: string
  role: string
  real_name: string
  is_approved: boolean
  is_active: boolean
  date_joined: string
  is_superuser: boolean
}

let userStore: UserRecord[] = [
  {
    id: '1',
    username: 'admin',
    password: '123456',
    email: 'admin@edu.cn',
    phone: '13800000001',
    role: 'ADMIN',
    real_name: '系统管理员',
    is_approved: true,
    is_active: true,
    date_joined: now(),
    is_superuser: true,
  },
  {
    id: '2',
    username: 'teacher1',
    password: '123456',
    email: 'zhang@edu.cn',
    phone: '13800001001',
    role: 'TEACHER',
    real_name: '张老师',
    is_approved: true,
    is_active: true,
    date_joined: now(),
    is_superuser: false,
  },
  {
    id: '3',
    username: 'teacher2',
    password: '123456',
    email: 'li@edu.cn',
    phone: '13800001002',
    role: 'TEACHER',
    real_name: '李老师',
    is_approved: true,
    is_active: true,
    date_joined: now(),
    is_superuser: false,
  },
  {
    id: '4',
    username: 'student1',
    password: '123456',
    email: 'listudent@edu.cn',
    phone: '13900002001',
    role: 'STUDENT',
    real_name: '李同学',
    is_approved: true,
    is_active: true,
    date_joined: now(),
    is_superuser: false,
  },
  {
    id: '5',
    username: 'student2',
    password: '123456',
    email: 'wangstudent@edu.cn',
    phone: '13900002002',
    role: 'STUDENT',
    real_name: '王同学',
    is_approved: true,
    is_active: true,
    date_joined: now(),
    is_superuser: false,
  },
]

const toUserDto = (u: UserRecord): UserDto => ({
  id: u.id,
  username: u.username,
  email: u.email,
  phone: u.phone,
  role: u.role as UserDto['role'],
  role_display: { ADMIN: '管理员', TEACHER: '老师', STUDENT: '学生' }[u.role] || u.role,
  real_name: u.real_name,
  is_approved: u.is_approved,
  is_active: u.is_active,
  date_joined: u.date_joined,
})

export const getUsers = (query?: { username?: string; role?: string; is_approved?: string }) =>
  userStore
    .filter(u => {
      if (query?.username && !u.username.includes(query.username)) return false
      if (query?.role && u.role !== query.role) return false
      if (query?.is_approved !== undefined && query?.is_approved !== '')
        if (u.is_approved !== (query.is_approved === 'true')) return false
      return true
    })
    .map(toUserDto)

export const getUserByUsername = (username: string) => userStore.find(u => u.username === username)

export const getUserById = (id: string) => {
  const u = userStore.find(item => item.id === id)
  return u ? toUserDto(u) : null
}

export const getPendingUsers = () => userStore.filter(u => !u.is_approved).map(toUserDto)

export const createLoginResponse = (username: string): LoginResponse | null => {
  const u = getUserByUsername(username)
  if (!u || !u.is_active) return null
  return {
    user: toUserDto(u),
    access: `${u.username}-mock-access-token`,
    refresh: `${u.username}-mock-refresh-token`,
  }
}

export const createUser = (payload: Record<string, unknown>) => {
  const u: UserRecord = {
    id: (payload.id as string) || createId('user'),
    username: (payload.username as string) || '',
    password: (payload.password as string) || '123456',
    email: (payload.email as string) || '',
    phone: (payload.phone as string) || '',
    role: (payload.role as string) || 'STUDENT',
    real_name: (payload.real_name as string) || '',
    is_approved: (payload.is_approved as boolean) ?? false,
    is_active: (payload.is_active as boolean) ?? true,
    date_joined: now(),
    is_superuser: false,
  }
  userStore = [u, ...userStore]
  return toUserDto(u)
}

export const updateUser = (id: string, payload: Record<string, unknown>) => {
  const index = userStore.findIndex(u => u.id === id)
  if (index === -1) return null
  userStore[index] = { ...userStore[index], ...(payload as Partial<UserRecord>), id }
  return toUserDto(userStore[index])
}

export const deleteUser = (id: string) => {
  userStore = userStore.filter(u => u.id !== id)
}

export const approveUser = (id: string) => {
  const u = userStore.find(item => item.id === id)
  if (!u) return null
  u.is_approved = true
  u.is_active = true
  return toUserDto(u)
}

// ============ 班级存储 ============

type ClassesRecord = ClassesDto

let classesStore: ClassesRecord[] = [
  {
    id: 'c1',
    grade: 'SENIOR_1',
    grade_display: '高一',
    name: '1班',
    headmaster: 'tp1',
    headmaster_name: '张老师',
  },
  {
    id: 'c2',
    grade: 'SENIOR_1',
    grade_display: '高一',
    name: '2班',
    headmaster: 'tp2',
    headmaster_name: '李老师',
  },
  {
    id: 'c3',
    grade: 'SENIOR_2',
    grade_display: '高二',
    name: '1班',
    headmaster: null,
    headmaster_name: '',
  },
  {
    id: 'c4',
    grade: 'GRADE_9',
    grade_display: '九年级',
    name: '1班',
    headmaster: null,
    headmaster_name: '',
  },
]

export const getClasses = (query?: { grade?: string; name?: string }) =>
  classesStore.filter(c => {
    if (query?.grade && c.grade !== query.grade) return false
    if (query?.name && !c.name.includes(query.name)) return false
    return true
  })

export const getClassById = (id: string) => classesStore.find(c => c.id === id) ?? null

export const createClass = (payload: Partial<ClassesRecord>) => {
  const c: ClassesRecord = {
    id: payload.id || createId('class'),
    grade: payload.grade || 'GRADE_7',
    grade_display: ({ GRADE_7: '七年级' } as Record<string, string>)[payload.grade || ''] || '',
    name: payload.name || '',
    headmaster: payload.headmaster || null,
    headmaster_name: payload.headmaster_name || '',
  }
  classesStore = [c, ...classesStore]
  return c
}

export const updateClass = (id: string, payload: Partial<ClassesRecord>) => {
  const index = classesStore.findIndex(c => c.id === id)
  if (index === -1) return null
  classesStore[index] = { ...classesStore[index], ...payload, id }
  return classesStore[index]
}

export const deleteClass = (id: string) => {
  classesStore = classesStore.filter(c => c.id !== id)
}

// ============ 教师简介存储 ============

type TeacherRecord = TeacherProfileDto

let teacherStore: TeacherRecord[] = [
  {
    id: 'tp1',
    user: '2',
    user_name: 'teacher1',
    emp_no: 'T2024001',
    realname: '张老师',
    phone: '13800001001',
    email: 'zhang@edu.cn',
    address: '北京市海淀区',
    age: 35,
    gender: 'MALE',
    research_groups: ['rg1'],
    research_group_names: ['数学教研组'],
    class_ids: ['c1'],
  },
  {
    id: 'tp2',
    user: '3',
    user_name: 'teacher2',
    emp_no: 'T2024002',
    realname: '李老师',
    phone: '13800001002',
    email: 'li@edu.cn',
    address: '北京市朝阳区',
    age: 42,
    gender: 'FEMALE',
    research_groups: ['rg2', 'rg3'],
    research_group_names: ['语文教研组', '英语教研组'],
    class_ids: ['c2'],
  },
]

export const getTeacherByUser = (userId: string) =>
  teacherStore.find(t => t.user === userId) ?? null
export const getAllTeachers = () => teacherStore

export const createOrUpdateTeacher = (payload: Partial<TeacherRecord>, userId: string) => {
  const existing = teacherStore.findIndex(t => t.user === userId)
  if (existing >= 0) {
    teacherStore[existing] = { ...teacherStore[existing], ...payload, user: userId }
    return teacherStore[existing]
  }
  const t: TeacherRecord = {
    id: payload.id || createId('tp'),
    user: userId,
    user_name: payload.user_name || '',
    emp_no: payload.emp_no || '',
    realname: payload.realname || '',
    phone: payload.phone || '',
    email: payload.email || '',
    address: payload.address || '',
    age: payload.age ?? null,
    gender: payload.gender || '',
    research_groups: payload.research_groups || [],
    research_group_names: payload.research_group_names || [],
    class_ids: payload.class_ids || [],
  }
  teacherStore = [t, ...teacherStore]
  return t
}

// ============ 学生简介存储 ============

type StudentRecord = StudentProfileDto

let studentStore: StudentRecord[] = [
  {
    id: 'sp1',
    user: '4',
    user_name: 'student1',
    stu_no: 'S20240001',
    realname: '李同学',
    phone: '13900002001',
    email: 'listudent@edu.cn',
    address: '北京市东城区',
    age: 16,
    gender: 'MALE',
    class_id: 'c1',
    class_name: '高一1班',
  },
  {
    id: 'sp2',
    user: '5',
    user_name: 'student2',
    stu_no: 'S20240002',
    realname: '王同学',
    phone: '13900002002',
    email: 'wangstudent@edu.cn',
    address: '北京市西城区',
    age: 15,
    gender: 'FEMALE',
    class_id: 'c2',
    class_name: '高一2班',
  },
]

export const getStudentByUser = (userId: string) =>
  studentStore.find(s => s.user === userId) ?? null
export const getAllStudents = () => studentStore

export const createOrUpdateStudent = (payload: Partial<StudentRecord>, userId: string) => {
  const existing = studentStore.findIndex(s => s.user === userId)
  if (existing >= 0) {
    studentStore[existing] = { ...studentStore[existing], ...payload, user: userId }
    return studentStore[existing]
  }
  const s: StudentRecord = {
    id: payload.id || createId('sp'),
    user: userId,
    user_name: payload.user_name || '',
    stu_no: payload.stu_no || '',
    realname: payload.realname || '',
    phone: payload.phone || '',
    email: payload.email || '',
    address: payload.address || '',
    age: payload.age ?? null,
    gender: payload.gender || '',
    class_id: payload.class_id || null,
    class_name: payload.class_name || '',
  }
  studentStore = [s, ...studentStore]
  return s
}

// ============ 教研组存储 ============

type ResearchGroupRecord = ResearchGroupDto

let researchGroupStore: ResearchGroupRecord[] = [
  { id: 'rg1', name: '数学教研组' },
  { id: 'rg2', name: '语文教研组' },
  { id: 'rg3', name: '英语教研组' },
  { id: 'rg4', name: '物理教研组' },
]

export const getResearchGroups = () => researchGroupStore
export const getResearchGroupById = (id: string) =>
  researchGroupStore.find(g => g.id === id) ?? null

export const createResearchGroup = (payload: { name: string }) => {
  const g: ResearchGroupRecord = { id: createId('rg'), name: payload.name }
  researchGroupStore = [g, ...researchGroupStore]
  return g
}

export const updateResearchGroup = (id: string, payload: { name: string }) => {
  const index = researchGroupStore.findIndex(g => g.id === id)
  if (index === -1) return null
  researchGroupStore[index] = { id, name: payload.name }
  return researchGroupStore[index]
}

export const deleteResearchGroup = (id: string) => {
  researchGroupStore = researchGroupStore.filter(g => g.id !== id)
}

// ============ 科目存储 ============

type SubjectRecord = { id: string; name: string }

let subjectStore: SubjectRecord[] = [
  { id: 'sub1', name: '语文' },
  { id: 'sub2', name: '数学' },
  { id: 'sub3', name: '英语' },
  { id: 'sub4', name: '物理' },
  { id: 'sub5', name: '化学' },
  { id: 'sub6', name: '生物' },
  { id: 'sub7', name: '地理' },
  { id: 'sub8', name: '历史' },
  { id: 'sub9', name: '政治' },
  { id: 'sub10', name: '科学' },
  { id: 'sub11', name: '体育' },
  { id: 'sub12', name: '音乐' },
  { id: 'sub13', name: '美术' },
  { id: 'sub14', name: '信息技术' },
  { id: 'sub15', name: '通用技术' },
  { id: 'sub16', name: '劳动' },
  { id: 'sub17', name: '综合实践' },
  { id: 'sub18', name: '书法' },
  { id: 'sub19', name: '心理健康' },
]

export const getSubjects = () => subjectStore
export const getSubjectById = (id: string) => subjectStore.find(s => s.id === id) ?? null

export const createSubject = (payload: { name: string }) => {
  const s: SubjectRecord = { id: createId('sub'), name: payload.name }
  subjectStore = [s, ...subjectStore]
  return s
}

export const updateSubject = (id: string, payload: { name: string }) => {
  const index = subjectStore.findIndex(s => s.id === id)
  if (index === -1) return null
  subjectStore[index] = { id, name: payload.name }
  return subjectStore[index]
}

export const deleteSubject = (id: string) => {
  subjectStore = subjectStore.filter(s => s.id !== id)
}

// ============ 学期存储 ============

type SemesterRecord = { id: string; name: string; display_name: string }

let semesterStore: SemesterRecord[] = [
  { id: 's1', name: '2023-2024-1', display_name: '2023-2024学年第一学期' },
  { id: 's2', name: '2023-2024-2', display_name: '2023-2024学年第二学期' },
  { id: 's3', name: '2024-2025-1', display_name: '2024-2025学年第一学期' },
  { id: 's4', name: '2024-2025-2', display_name: '2024-2025学年第二学期' },
  { id: 's5', name: '2025-2026-1', display_name: '2025-2026学年第一学期' },
  { id: 's6', name: '2025-2026-2', display_name: '2025-2026学年第二学期' },
  { id: 's7', name: '2026-2027-1', display_name: '2026-2027学年第一学期' },
  { id: 's8', name: '2026-2027-2', display_name: '2026-2027学年第二学期' },
]

export const getSemesters = () => semesterStore
export const getSemesterById = (id: string) => semesterStore.find(s => s.id === id) ?? null

export const createSemester = (payload: { name: string; display_name: string }) => {
  const s: SemesterRecord = { id: createId('sem'), name: payload.name, display_name: payload.display_name }
  semesterStore = [s, ...semesterStore]
  return s
}

export const updateSemester = (id: string, payload: { name?: string; display_name?: string }) => {
  const index = semesterStore.findIndex(s => s.id === id)
  if (index === -1) return null
  semesterStore[index] = { ...semesterStore[index], ...payload, id }
  return semesterStore[index]
}

export const deleteSemester = (id: string) => {
  semesterStore = semesterStore.filter(s => s.id !== id)
}

// ============ 仪表盘统计 ============

const gradeOrder = [
  'GRADE_1',
  'GRADE_2',
  'GRADE_3',
  'GRADE_4',
  'GRADE_5',
  'GRADE_6',
  'GRADE_7',
  'GRADE_8',
  'GRADE_9',
  'SENIOR_1',
  'SENIOR_2',
  'SENIOR_3',
] as const

const gradeDisplayMap: Record<string, string> = {
  GRADE_1: '一年级',
  GRADE_2: '二年级',
  GRADE_3: '三年级',
  GRADE_4: '四年级',
  GRADE_5: '五年级',
  GRADE_6: '六年级',
  GRADE_7: '七年级',
  GRADE_8: '八年级',
  GRADE_9: '九年级',
  SENIOR_1: '高一',
  SENIOR_2: '高二',
  SENIOR_3: '高三',
}

export const getDashboardStats = (grade?: string) => {
  const totals = {
    teachers: teacherStore.length,
    students: studentStore.length,
    classes: classesStore.length,
    research_groups: researchGroupStore.length,
  }

  let distribution: { label: string; count: number }[]

  if (grade) {
    // 选中具体年级 → 返回该年级下各班人数
    const classesInGrade = classesStore.filter(c => c.grade === grade)
    distribution = classesInGrade.map(c => ({
      label: c.name,
      count: studentStore.filter(s => s.class_id === c.id).length,
    }))
  } else {
    // 全校 → 返回各年级人数
    distribution = gradeOrder.map(g => ({
      label: gradeDisplayMap[g] || g,
      count: studentStore.filter(s => {
        const cls = classesStore.find(c => c.id === s.class_id)
        return cls?.grade === g
      }).length,
    }))
  }

  const description = grade ? `${gradeDisplayMap[grade] || grade}各班人数` : '各年级人数'

  return { totals, distribution, description }
}
