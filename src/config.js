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
const ruVots = [
  11000, 14000, 21000, 22000, 23000, 24000, 26000, 27000, 28000, 29000, 35000,
  52000,
]

export const VOTS = {
  ruTeam: ruVots,
  ruTrans: ruVots,
  prg: [11000, 21000, 27000, 29000],
  bridging: [11000, 27000, 29000],
  short: ruVots,
}

export const votDescriptions = {
  11000: 'Wages/Salaries & GRA allowance.',
  14000: 'Ovetime Allowance',
  21000: 'Travel & Transportation',
  22000: 'Freight',
  23000: 'Communication and utilities',
  24000: 'Rental',
  26000: 'Supply for Materials Maintenance and Repairs',
  27000: 'Supplies & Raw Materials',
  28000: 'Maintenance and Modification',
  29000:
    'printing, honorarium, consultancy, service expertise, language editing, database service',
  35000: 'Equipment and Accessory',
  52000: 'Fees and other, such as license renewal',
}

export const COLORS = [
  '#58A4B0',
  '#373F51',
  '#A9BCD0',
  '#3066BE',
  '#119DA4',
  '#EE4266',
  '#2F4858',
  '#33658A',
  '#F6AE2D',
  '#F26419',
  '#558564',
  '#FAF2A1',
]


export const WEEKLY_EXPENSE_WEEKS = 10