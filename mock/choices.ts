import type { MockMethod } from 'vite-plugin-mock'
import { createResponse } from './util'

const choices = {
  roles: [
    {
      value: 'ADMIN',
      label: '管理员',
    },
    {
      value: 'TEACHER',
      label: '老师',
    },
    {
      value: 'STUDENT',
      label: '学生',
    },
  ],
  grades: [
    {
      value: 'GRADE_1',
      label: '一年级',
    },
    {
      value: 'GRADE_2',
      label: '二年级',
    },
    {
      value: 'GRADE_3',
      label: '三年级',
    },
    {
      value: 'GRADE_4',
      label: '四年级',
    },
    {
      value: 'GRADE_5',
      label: '五年级',
    },
    {
      value: 'GRADE_6',
      label: '六年级',
    },
    {
      value: 'GRADE_7',
      label: '七年级',
    },
    {
      value: 'GRADE_8',
      label: '八年级',
    },
    {
      value: 'GRADE_9',
      label: '九年级',
    },
    {
      value: 'SENIOR_1',
      label: '高一',
    },
    {
      value: 'SENIOR_2',
      label: '高二',
    },
    {
      value: 'SENIOR_3',
      label: '高三',
    },
  ],
  exam_types: [
    {
      value: 'MONTHLY',
      label: '月考',
    },
    {
      value: 'MOCK',
      label: '模拟考',
    },
    {
      value: 'MIDTERM',
      label: '期中',
    },
    {
      value: 'FINAL',
      label: '期末',
    },
  ],
  genders: [
    {
      value: 'MALE',
      label: '男',
    },
    {
      value: 'FEMALE',
      label: '女',
    },
  ],
}

export default [
  {
    url: '/api/choices',
    method: 'get',
    timeout: 200,
    response: () => createResponse(choices),
  },
] as MockMethod[]
