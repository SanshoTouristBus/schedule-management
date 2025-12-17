import {DateInput} from '@cm/class/Days/date-utils/date-utils-type'
import {formatDate} from '@cm/class/Days/date-utils/formatters'
import {isServer} from '@cm/lib/methods/common'

export const getMidnight = (date = new Date()) => {
  const dt = new Date(date)

  const year = Number(formatDate(dt, 'YYYY'))
  const month = Number(formatDate(dt, 'MM'))
  const day = Number(formatDate(dt, 'DD'))

  let midnightDate = new Date(year, month - 1, day, 0, 0, 0)
  if (isServer) {
    midnightDate = toUtc(midnightDate)
  }

  if (midnightDate?.toISOString().includes(`15:00`) === false) {
    console.error(`getMidnightError`, date, new Date(year, month - 1, day, 0, 0, 0), midnightDate.toISOString())
  }

  return midnightDate
}

export const toUtc = (date: DateInput): Date => {
  const dt = new Date(date)

  const isDate = isValidDate(dt)
  if (!isDate) {
    // throw new Error(`toUtc: ${dt} is not a date object`)
  }

  const result = addHours(dt, -9)

  return result
}

export const toJst = (date: DateInput): Date => {
  const dt = new Date(date)

  const isDate = isValidDate(dt)
  if (!isDate) {
    throw new Error(`toJst: ${dt} is not a date object`)
  }
  return addHours(dt, 9)
}

export const getMaxDate = (dates: Date[]): Date | null => {
  if (dates.length === 0) return null
  return new Date(Math.max(...dates.map(date => date.getTime())))
}

export const getMinimumDate = (dates: Date[]): Date | null => {
  if (dates.length === 0) return null
  return new Date(Math.min(...dates.map(date => date.getTime())))
}

export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

export const calcAge = (birthday: DateInput): number => {
  const today = new Date()
  const birthDate = new Date(birthday)

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

// バリデーション関数
const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime())
}
