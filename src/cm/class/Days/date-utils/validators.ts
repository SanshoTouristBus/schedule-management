// import {DateInput} from '@cm/class/Days/date-utils/date-utils-type'

// export const isValidDate = (date: any): date is Date => {
//   return date instanceof Date && !isNaN(date.getTime())
// }

// export const isDateString = (value: string): boolean => {
//   if (!value || typeof value !== 'string') return false
//   const date = new Date(value)
//   return isValidDate(date)
// }

// export const isDateInRange = (date: DateInput, startDate: DateInput, endDate: DateInput): boolean => {
//   if (!isValidDate(date) || !isValidDate(startDate) || !isValidDate(endDate)) {
//     return false
//   }

//   const dateTime = new Date(date).getTime()
//   const startTime = new Date(startDate).getTime()
//   const endTime = new Date(endDate).getTime()

//   return dateTime >= startTime && dateTime <= endTime
// }

// export const isSameDay = (date1: DateInput, date2: DateInput): boolean => {
//   if (!isValidDate(date1) || !isValidDate(date2)) return false

//   const d1 = new Date(date1)
//   const d2 = new Date(date2)

//   return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
// }

// export const isWeekend = (date: DateInput): boolean => {
//   if (!isValidDate(date)) return false

//   const day = new Date(date).getDay()
//   return day === 0 || day === 6 // 日曜日(0) または 土曜日(6)
// }

// export const isBusinessDay = (date: DateInput): boolean => {
//   return !isWeekend(date)
// }
