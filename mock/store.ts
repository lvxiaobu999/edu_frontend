import Mock from 'mockjs'
import type {
  UserDto,
  LoginResponse,
  TeacherDto,
  StudentDto,
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

export const getClasses = (query?: { grade?: string; name?: string; headmaster?: string }) =>
  classesStore.filter(c => {
    if (query?.grade && c.grade !== query.grade) return false
    if (query?.name && !c.name.includes(query.name)) return false
    if (query?.headmaster && !c.headmaster_name.includes(query.headmaster)) return false
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

type TeacherRecord = TeacherDto

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
export const getTeacherById = (id: string) => teacherStore.find(t => t.id === id) ?? null

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

export const createTeacher = (payload: Partial<TeacherRecord>) => {
  const t: TeacherRecord = {
    id: payload.id || createId('tp'),
    user: payload.user || '',
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

export const updateTeacher = (id: string, payload: Partial<TeacherRecord>) => {
  const index = teacherStore.findIndex(t => t.id === id)
  if (index === -1) return null
  teacherStore[index] = { ...teacherStore[index], ...payload, id }
  return teacherStore[index]
}

export const deleteTeacher = (id: string) => {
  teacherStore = teacherStore.filter(t => t.id !== id)
}

// ============ 学生简介存储 ============

type StudentRecord = StudentDto

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

export const getStudentById = (id: string) => studentStore.find(s => s.id === id) ?? null

export const createStudent = (payload: Partial<StudentRecord>) => {
  const cls = payload.class_id ? classesStore.find(c => c.id === payload.class_id) : null
  const s: StudentRecord = {
    id: payload.id || createId('sp'),
    user: payload.user || '',
    user_name: payload.user_name || '',
    stu_no: payload.stu_no || '',
    realname: payload.realname || '',
    phone: payload.phone || '',
    email: payload.email || '',
    address: payload.address || '',
    age: payload.age ?? null,
    gender: payload.gender || '',
    class_id: payload.class_id || null,
    class_name: cls ? `${cls.grade_display}${cls.name}` : payload.class_name || '',
  }
  studentStore = [s, ...studentStore]
  return s
}

export const updateStudent = (id: string, payload: Partial<StudentRecord>) => {
  const index = studentStore.findIndex(s => s.id === id)
  if (index === -1) return null
  const merged = { ...studentStore[index], ...payload }
  if (payload.class_id) {
    const cls = classesStore.find(c => c.id === payload.class_id)
    if (cls) merged.class_name = `${cls.grade_display}${cls.name}`
  }
  studentStore[index] = { ...merged, id }
  return studentStore[index]
}

export const deleteStudent = (id: string) => {
  studentStore = studentStore.filter(s => s.id !== id)
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
  const s: SemesterRecord = {
    id: createId('sem'),
    name: payload.name,
    display_name: payload.display_name,
  }
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

// ============ 考试存储 ============

type ExamRecord = {
  id: string
  name: string
  exam_type: string
  exam_type_display: string
  exam_date: string
  grade: string
  grade_display: string
  semester: string
  semester_display: string
}

const examTypeDisplay: Record<string, string> = {
  MONTHLY: '月考',
  MOCK: '模拟考',
  MIDTERM: '期中',
  FINAL: '期末',
}

let examStore: ExamRecord[] = [
  {
    id: 'e1',
    name: '2025-2026学年第二学期高一月考',
    exam_type: 'MONTHLY',
    exam_type_display: '月考',
    exam_date: '2026-03-15',
    grade: 'SENIOR_1',
    grade_display: '高一',
    semester: 's5',
    semester_display: '2025-2026学年第二学期',
  },
  {
    id: 'e2',
    name: '2025-2026学年第二学期高一期中考试',
    exam_type: 'MIDTERM',
    exam_type_display: '期中',
    exam_date: '2026-04-20',
    grade: 'SENIOR_1',
    grade_display: '高一',
    semester: 's5',
    semester_display: '2025-2026学年第二学期',
  },
  {
    id: 'e3',
    name: '2025-2026学年第二学期高二期中考试',
    exam_type: 'MIDTERM',
    exam_type_display: '期中',
    exam_date: '2026-04-21',
    grade: 'SENIOR_2',
    grade_display: '高二',
    semester: 's5',
    semester_display: '2025-2026学年第二学期',
  },
  {
    id: 'e4',
    name: '2025-2026学年第二学期高一期末考试',
    exam_type: 'FINAL',
    exam_type_display: '期末',
    exam_date: '2026-06-25',
    grade: 'SENIOR_1',
    grade_display: '高一',
    semester: 's5',
    semester_display: '2025-2026学年第二学期',
  },
  {
    id: 'e5',
    name: '2025-2026学年第二学期高三模拟考',
    exam_type: 'MOCK',
    exam_type_display: '模拟考',
    exam_date: '2026-05-10',
    grade: 'SENIOR_3',
    grade_display: '高三',
    semester: 's5',
    semester_display: '2025-2026学年第二学期',
  },
]

export const getExams = (query?: { exam_type?: string; grade?: string; semester?: string }) =>
  examStore.filter(e => {
    if (query?.exam_type && e.exam_type !== query.exam_type) return false
    if (query?.grade && e.grade !== query.grade) return false
    if (query?.semester && e.semester !== query.semester) return false
    return true
  })

export const getExamById = (id: string) => examStore.find(e => e.id === id) ?? null

export const createExam = (payload: {
  exam_type: string
  exam_date: string
  grade: string
  semester: string
}) => {
  const sem = semesterStore.find(s => s.id === payload.semester)
  const gradeLabel = gradeDisplayMap[payload.grade] || payload.grade
  const typeLabel = examTypeDisplay[payload.exam_type] || payload.exam_type
  const semesterLabel = sem?.display_name || ''
  const name = `${semesterLabel}${gradeLabel}${typeLabel}`
  const s: ExamRecord = {
    id: createId('exam'),
    name,
    exam_type: payload.exam_type,
    exam_type_display: typeLabel,
    exam_date: payload.exam_date,
    grade: payload.grade,
    grade_display: gradeLabel,
    semester: payload.semester,
    semester_display: semesterLabel,
  }
  examStore = [s, ...examStore]
  return s
}

export const updateExam = (
  id: string,
  payload: {
    exam_type?: string
    exam_date?: string
    grade?: string
    semester?: string
  },
) => {
  const index = examStore.findIndex(e => e.id === id)
  if (index === -1) return null
  const current = examStore[index]
  const merged = { ...current, ...payload }
  if (payload.exam_type)
    merged.exam_type_display = examTypeDisplay[payload.exam_type] || payload.exam_type
  if (payload.grade) merged.grade_display = gradeDisplayMap[payload.grade] || payload.grade
  if (payload.semester) {
    const sem = semesterStore.find(s => s.id === payload.semester)
    merged.semester_display = sem?.display_name || ''
  }
  const sem = semesterStore.find(s => s.id === merged.semester)
  merged.name = `${sem?.display_name || ''}${merged.grade_display}${merged.exam_type_display}`
  examStore[index] = { ...merged, id }
  return examStore[index]
}

export const deleteExam = (id: string) => {
  examStore = examStore.filter(e => e.id !== id)
}

// ============ 成绩存储 ============

type ScoreRecord = {
  id: string
  student: string
  student_name: string
  student_no: string
  exam: string
  exam_name: string
  subject: string
  subject_name: string
  score: number
}

let scoreStore: ScoreRecord[] = [
  {
    id: 'sc1',
    student: 'sp1',
    student_name: '李同学',
    student_no: 'S20240001',
    exam: 'e1',
    exam_name: '2025-2026学年第二学期高一月考',
    subject: 'sub2',
    subject_name: '数学',
    score: 98.5,
  },
  {
    id: 'sc2',
    student: 'sp1',
    student_name: '李同学',
    student_no: 'S20240001',
    exam: 'e1',
    exam_name: '2025-2026学年第二学期高一月考',
    subject: 'sub1',
    subject_name: '语文',
    score: 92,
  },
  {
    id: 'sc3',
    student: 'sp2',
    student_name: '王同学',
    student_no: 'S20240002',
    exam: 'e1',
    exam_name: '2025-2026学年第二学期高一月考',
    subject: 'sub2',
    subject_name: '数学',
    score: 87,
  },
  {
    id: 'sc4',
    student: 'sp1',
    student_name: '李同学',
    student_no: 'S20240001',
    exam: 'e2',
    exam_name: '2025-2026学年第二学期高一期中考试',
    subject: 'sub2',
    subject_name: '数学',
    score: 95,
  },
  {
    id: 'sc5',
    student: 'sp2',
    student_name: '王同学',
    student_no: 'S20240002',
    exam: 'e3',
    exam_name: '2025-2026学年第二学期高二期中考试',
    subject: 'sub3',
    subject_name: '英语',
    score: 88.5,
  },
]

export const getScores = (query?: { exam?: string; subject?: string; student?: string }) =>
  scoreStore.filter(s => {
    if (query?.exam && s.exam !== query.exam) return false
    if (query?.subject && s.subject !== query.subject) return false
    if (query?.student && !s.student_name.includes(query.student)) return false
    return true
  })

export const getScoreById = (id: string) => scoreStore.find(s => s.id === id) ?? null

export const createScore = (payload: {
  student: string
  exam: string
  subject: string
  score: number
}) => {
  const stu = studentStore.find(s => s.id === payload.student)
  const ex = examStore.find(e => e.id === payload.exam)
  const sub = subjectStore.find(s => s.id === payload.subject)
  const r: ScoreRecord = {
    id: createId('sc'),
    student: payload.student,
    student_name: stu?.realname || '',
    student_no: stu?.stu_no || '',
    exam: payload.exam,
    exam_name: ex?.name || '',
    subject: payload.subject,
    subject_name: sub?.name || '',
    score: payload.score,
  }
  scoreStore = [r, ...scoreStore]
  return r
}

export const updateScore = (
  id: string,
  payload: { student?: string; exam?: string; subject?: string; score?: number },
) => {
  const index = scoreStore.findIndex(s => s.id === id)
  if (index === -1) return null
  const merged = { ...scoreStore[index], ...payload }
  if (payload.student) {
    const stu = studentStore.find(s => s.id === payload.student)
    if (stu) {
      merged.student_name = stu.realname
      merged.student_no = stu.stu_no
    }
  }
  if (payload.exam) {
    const ex = examStore.find(e => e.id === payload.exam)
    if (ex) merged.exam_name = ex.name
  }
  if (payload.subject) {
    const sub = subjectStore.find(s => s.id === payload.subject)
    if (sub) merged.subject_name = sub.name
  }
  scoreStore[index] = { ...merged, id }
  return scoreStore[index]
}

export const deleteScore = (id: string) => {
  scoreStore = scoreStore.filter(s => s.id !== id)
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
