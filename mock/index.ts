import type { MockMethod } from 'vite-plugin-mock'

import auth from './auth'
import dashboard from './dashboard'
import user from './user'
import teacher from './teacher'
import student from './student'
import researchGroup from './research-group'
import classes from './classes'
import choices from './choices'

export default [
  ...auth,
  ...dashboard,
  ...user,
  ...teacher,
  ...student,
  ...researchGroup,
  ...classes,
  ...choices,
] as MockMethod[]
