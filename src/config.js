export const ROOT = 'http://localhost:3000'
export const MINIMAL_MS_LEN = 10
export const grantOptions = {
  short: 'Short Term',
  ruTeam: 'RU Team',
  ruTrans: 'RU Trans',
  bridging: 'Bridging (Incentive)',
  prg: 'Publication Research Grants',
}

export const userStatuses = [
  { label: 'Regular', value: 'regular' },
  { label: 'Dean', value: 'dean' },
  { label: 'Deputy Dean', value: 'depDean' },
]

export const schoolsNames = {
  cs: 'Computer Sciences',
  math: 'Mathematics',
  biology: 'Biology',
  chemistry: 'Chemistry',
  management: 'Management',
  arts: 'Arts',
}

export const schoolsList = [
  { label: 'Computer Sciences', value: 'cs' },
  { label: 'Mathematics', value: 'math' },
  { label: 'Biology', value: 'biology' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Management', value: 'management' },
  { label: 'Arts', value: 'arts' },
]

export const defaultHomePages = {
  regular: '/grants/all',
  dean: '/dean/dashboard',
  depDean: '/dean/dashboard',
}
