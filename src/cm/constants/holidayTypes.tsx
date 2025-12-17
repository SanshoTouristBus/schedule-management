export type HolidayType = {
  value: string
  color: string
}

export const HOLIDAY_TYPE_LIST: HolidayType[] = [
  {value: '出勤', color: 'green'},
  {value: '休日', color: 'red'},
  {value: '祝日', color: 'blue'},
]
