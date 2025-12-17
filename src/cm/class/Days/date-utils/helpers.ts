import dayjs from 'dayjs'
import {formatDate} from './formatters'
import {toUtc, toJst, addDays} from './calculations'

import {isServer} from 'src/cm/lib/methods/common'
import {getColorStyles} from '@cm/lib/methods/colors'
import {Calendar} from '@prisma/generated/prisma/client'
import {colTypeStr} from '@cm/types/types'
import {DateInput} from '@cm/class/Days/date-utils/date-utils-type'

// Week関連のヘルパー
export const weekHelpers = {
  add: (date: Date, amount: number): Date => {
    return dayjs(date).add(amount, 'week').toDate()
  },
  subtract: (date: Date, amount: number): Date => {
    return dayjs(date).subtract(amount, 'week').toDate()
  },
  difference: (futureDate: Date, pastDate: Date): number => {
    return dayjs(futureDate).diff(dayjs(pastDate), 'week')
  },
}

// Month関連のヘルパー
export const monthHelpers = {
  add: (date: Date, amount: number): Date => {
    return dayjs(date).add(amount, 'month').toDate()
  },
  subtract: (date: Date, amount: number): Date => {
    return dayjs(date).subtract(amount, 'month').toDate()
  },
  difference: (futureDate: Date, pastDate: Date): number => {
    return dayjs(futureDate).diff(dayjs(pastDate), 'month')
  },
  isLastDay: (date: Date): boolean => {
    return dayjs(date).endOf('month').isSame(dayjs(date), 'day')
  },
  getEndOfMonth: (date: Date): Date => {
    return toUtc(dayjs(date).endOf('month').toDate())
  },
  getNextMonthLastDate: (date: Date, add: number): Date => {
    const newDate = monthHelpers.add(date, add ?? 1)
    if (monthHelpers.isLastDay(newDate) === false) {
      newDate.setMonth(newDate.getMonth() + 1)
      newDate.setDate(0)
    }
    return newDate
  },

  getMonthDatum: (
    monthDt: Date,
    options?: {
      getFrom: (monthDt: Date) => Date
      getTo: (monthDt: Date) => Date
    }
  ) => {
    const dateConverter = isServer ? toUtc : val => val
    const year = toJst(monthDt).getFullYear()
    const month = toJst(monthDt).getMonth() //月よりも-1
    const date = 1

    const getFromTo = () => {
      if (options) {
        return {
          firstDayOfMonth: options.getFrom(monthDt),
          lastDayOfMonth: options.getTo(monthDt),
        }
      } else {
        return {
          firstDayOfMonth: dateConverter(new Date(year, month, 1)),
          lastDayOfMonth: dateConverter(new Date(year, month + 1, 0)),
        }
      }
    }

    const {firstDayOfMonth, lastDayOfMonth} = getFromTo()

    const days = dayHelpers.getDaysBetweenDates(firstDayOfMonth, lastDayOfMonth)

    const getWeeks = (
      startDateString: '月' | '火' | '水' | '木' | '金' | '土' | '日',
      options?: {
        showPrevAndNextMonth?: boolean
      }
    ) => {
      const weekDayStart = startDateString
      const weekdayMaster = [`日`, '月', '火', '水', '木', '金', '土']
      const weekdays = weekdayMaster
        .slice(weekdayMaster.indexOf(weekDayStart), 7)
        .concat(weekdayMaster.slice(0, weekdayMaster.indexOf(weekDayStart)))

      let weeks: Date[][] = [[]]

      const firstWeekOffset = getDayIndexOfWeek(firstDayOfMonth, weekdays)
      const prevMonthDays = new Array(firstWeekOffset)
        .fill(0)
        .map((_, i) => dayHelpers.subtract(firstDayOfMonth, firstWeekOffset - i))

      const lastWeekOffset = 6 - getDayIndexOfWeek(lastDayOfMonth, weekdays)
      const nextMonthDays = new Array(lastWeekOffset).fill(0).map((_, i) => dayHelpers.add(lastDayOfMonth, i + 1))

      const daysShownOnCalendar = [...prevMonthDays, ...days, ...nextMonthDays]

      for (let i = 0; i < daysShownOnCalendar.length; i += 7) {
        weeks.push(daysShownOnCalendar.slice(i, i + 7))
      }
      const remainingDayCount = 7 - weeks[weeks.length - 1].length

      for (let i = 0; i < remainingDayCount; i++) {
        weeks[weeks.length - 1].push(nextMonthDays[i])
      }

      weeks = weeks.filter(week => week.length === 7)

      return weeks
    }

    // 曜日のインデックスを取得するヘルパー関数 (0: 日, 1: 月, ..., 6: 土)
    function getDayIndexOfWeek(date: Date, weekdays): number {
      const currentWeekdayIndex = weekdays.indexOf(date.toLocaleDateString('ja', {weekday: 'short'}).slice(0, 1))

      // offsetを常に正の値にする
      return currentWeekdayIndex
    }
    const BASICS = {
      year,
      month: month + 1,
      date,
      firstDayOfMonth,
      lastDayOfMonth,
    }

    return {
      ...BASICS,
      getWeeks,
      days,
    }
  },
}

// Year関連のヘルパー
export const yearHelpers = {
  add: (date: Date, amount: number): Date => {
    return dayjs(date).add(amount, 'year').toDate()
  },
  subtract: (date: Date, amount: number): Date => {
    return dayjs(date).subtract(amount, 'year').toDate()
  },
  difference: (futureDate: Date, pastDate: Date): number => {
    return dayjs(futureDate).diff(dayjs(pastDate), 'year')
  },
  getYearDatum: (year: number) => {
    const firstDateOfYear = new Date(year, 0, 1)
    const lastDateOfYear = new Date(year, 11, 31)

    const getSpecifiedMonthOnThisYear = (month: number) => {
      return {
        first: toUtc(new Date(year, month - 1, 1)),
        last: addDays(toUtc(new Date(year, month, 1)), -1),
      }
    }

    const getAllMonthsInYear = () => {
      const months: Date[] = []
      for (let month = 0; month < 12; month++) {
        months.push(new Date(year, month, 1))
      }
      return months
    }

    return {firstDateOfYear, lastDateOfYear, getSpecifiedMonthOnThisYear, getAllMonthsInYear}
  },
}

// Hour関連のヘルパー
export const hourHelpers = {
  add: (date: Date, amount: number): Date => {
    return dayjs(date).add(amount, 'hour').toDate()
  },
  subtract: (date: Date, amount: number): Date => {
    return dayjs(date).subtract(amount, 'hour').toDate()
  },
  difference: (futureDate: Date, pastDate: Date): number => {
    return dayjs(futureDate).diff(dayjs(pastDate), 'hour')
  },
}

// Minute関連のヘルパー
export const minuteHelpers = {
  add: (date: Date, amount: number): Date => {
    return dayjs(date).add(amount, 'minute').toDate()
  },
  subtract: (date: Date, amount: number): Date => {
    return dayjs(date).subtract(amount, 'minute').toDate()
  },
  difference: (futureDate: Date, pastDate: Date): number => {
    return dayjs(futureDate).diff(dayjs(pastDate), 'minute')
  },
}

// Day関連のヘルパー（複雑な機能）
export const dayHelpers = {
  add: (date: Date, amount: number): Date => {
    return dayjs(date).add(amount, 'day').toDate()
  },
  subtract: (date: Date, amount: number): Date => {
    return dayjs(date).subtract(amount, 'day').toDate()
  },
  difference: (futureDate: Date, pastDate: Date): number => {
    return dayjs(futureDate).diff(dayjs(pastDate), 'day')
  },

  addBusinessDays: (startDate: Date, n: number, nonWorkingDays: Date[] = []): Date => {
    const currentDate = new Date(startDate)
    const nonWorkingDaysSet = new Set(nonWorkingDays.map(day => formatDate(new Date(day))))
    let roopCount = 0
    const step = n >= 0 ? 1 : -1

    while (n !== 0) {
      currentDate.setDate(currentDate.getDate() + step)
      const dateString = formatDate(currentDate)

      if (!nonWorkingDaysSet.has(dateString)) {
        n -= step
      }
      roopCount++
    }

    return currentDate
  },

  isHoliday: (date: Date, holidays?: Calendar[]) => {
    const isShukujitsu = holidays?.some(h => isSameDate(h.date, date))

    if (isShukujitsu) {
      return {style: {...getColorStyles('#fbeb8e')}}
    } else if (formatDate(date, 'ddd') === '土') {
      return {style: {...getColorStyles('#ffd7d7')}}
    } else if (formatDate(date, 'ddd') === '日') {
      return {style: {...getColorStyles('#c6eeff')}}
    }
  },

  generate30MinuteIntervals: (): string[] => {
    const intervals: string[] = []
    const intervalInMinutes = 30
    const minutesInADay = 24 * 60

    for (let i = 0; i < minutesInADay; i += intervalInMinutes) {
      const hours = Math.floor(i / 60)
      const minutes = i % 60

      const hoursString = hours.toString().padStart(2, '0')
      const minutesString = minutes.toString().padStart(2, '0')

      intervals.push(`${hoursString}:${minutesString}`)
    }

    return intervals
  },

  getDaysBetweenDates: (startDate: Date, endDate: Date): Date[] => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    const days: Date[] = []
    let convertToUtc = false

    while (start <= end) {
      let nextDate = new Date(start.getTime())
      if (nextDate.toISOString().includes('15:00:00') === false) {
        convertToUtc = true
        nextDate = hourHelpers.add(nextDate, 15)
      }

      days.push(nextDate)
      start.setDate(start.getDate() + 1)
    }

    if (days.some(d => !d.toISOString().includes('15:00:00'))) {
      throw new Error(`getDaysBetweenDates: UTC ではありません。`)
    }
    if (convertToUtc) {
      console.warn(`getDaysBetweenDates: convert to UTC`)
    }

    return days
  },
}

// Time関連のヘルパー
export const timeHelpers = {
  getTimeFormat: (type: colTypeStr): {timeFormatForDaysJs: string; timeFormatForDateFns: string} => {
    let timeFormat = ''

    switch (type) {
      case 'date':
      case 'datetime':
        timeFormat = `yyyy-MM-dd`
        break
      case 'month':
        timeFormat = 'yyyy-MM'
        break
      case 'year':
        timeFormat = `yyyy`
      // case 'datetime':
      //   timeFormat = 'yyyy-MM-dd HH:mm'
      //   break
    }

    const timeFormatForDaysJs = timeFormat.replace(/yyyy/g, 'YYYY').replace(/dd/g, 'DD')
    const timeFormatForDateFns = timeFormat.replace(/yyyy/g, 'yyyy').replace(/dd/g, 'dd')

    return {timeFormatForDaysJs, timeFormatForDateFns}
  },
  getCurrentTime: (): string => {
    return new Date().toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  },

  getTimeFromDate: (date: Date): string => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  parseTimeString: (timeString: string): {hours: number; minutes: number} | null => {
    const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
    if (match) {
      return {
        hours: parseInt(match[1]),
        minutes: parseInt(match[2]),
      }
    }
    return null
  },
}

// ヘルパー関数
const isSameDate = (date1: DateInput, date2: DateInput): boolean => {
  const isValidDate = (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime())
  }

  if (!isValidDate(date1) || !isValidDate(date2)) return false

  const d1 = new Date(date1)
  const d2 = new Date(date2)

  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}
