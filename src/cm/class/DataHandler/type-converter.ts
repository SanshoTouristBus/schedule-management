// 型変換専用モジュール
import {BaseColTypes, DataTypeMapping} from './types'
import {colTypeStr} from '@cm/types/types'
import {formatDate, formatDateTimeOrDate} from '@cm/class/Days/date-utils/formatters'

/**
 * カラム型の判定（メモ化で最適化）
 */
export const DH__switchColType = (() => {
  const cache = new Map<string, BaseColTypes>()

  const dataTypeMaster: DataTypeMapping = {
    password: ['password'],
    json: ['json'],
    text: ['text', 'textarea', 'email', 'password', 'string'],
    number: ['float', 'number', 'price', 'selectId', 'int', 'ratio'],
    date: ['date', 'month', 'year', 'datetime-local'],
    datetime: ['datetime'],
    boolean: ['boolean', 'confirm'],
    rating: ['rating', 'rate'],
    time: ['time'],
    color: ['color'],
    array: ['array'],
  }

  return (props: {type: string | undefined}): BaseColTypes => {
    const type = props.type
    if (!type) return 'text'

    if (cache.has(type)) {
      return cache.get(type)!
    }

    const result = (Object.keys(dataTypeMaster).find(key => dataTypeMaster[key].includes(type as colTypeStr)) ??
      'text') as BaseColTypes

    cache.set(type, result)
    return result
  }
})()

/**
 * 数値変換
 */
export const DH__convertToNumber = (value: unknown): number | null | undefined => {
  if (value === null) return undefined
  if (value === undefined) return undefined
  if (value === '') return undefined

  if (value !== undefined && !isNaN(Number(value))) {
    return Number(value)
  }
  return undefined
}

/**
 * レーティング変換
 */
export const DH__convertToRating = (value: unknown): number | undefined => {
  const numValue = Number(value)
  return !isNaN(numValue) ? numValue : undefined
}

/**
 * 日付変換
 */
export const DH__convertToDate = (value: unknown, convertFor: string = 'server'): string | null => {
  if (!value) return null

  try {
    return convertFor === 'client' ? formatDate(value as Date) : formatDate(value as Date, 'iso')
  } catch (error) {
    console.warn('Date conversion failed:', error)
    return null
  }
}

/**
 * 日時変換
 */
export const DH__convertToDateTime = (value: unknown, convertFor: string = 'server'): string | Date | null => {
  if (!value) return null

  try {
    if (convertFor === 'client') {
      return formatDateTimeOrDate(value as Date)
    } else {
      return new Date(formatDateTimeOrDate(value as Date) as string)
    }
  } catch (error) {
    console.warn('DateTime conversion failed:', error)
    return null
  }
}

/**
 * テキスト変換
 */
export const DH__convertToText = (value: unknown): string | null => {
  return value ? String(value) : null
}

/**
 * 配列変換
 */
export const DH__convertToArray = (value: unknown): string[] => {
  return value ? String(value).split(' / ') : ['']
}

/**
 * ブール値変換
 */
export const DH__convertToBoolean = (value: unknown): boolean => {
  const falsyValues = ['', 0, '0', undefined, null, false, 'false']
  return !falsyValues.includes(value as any)
}

/**
 * JSON文字列変換
 */
export const DH__convertToJsonString = (value: unknown): string => {
  try {
    return value ? JSON.stringify(value) : ''
  } catch (error) {
    console.warn('JSON stringify failed:', error)
    return String(value)
  }
}

/**
 * 暗黙的型変換
 */
export const DH__convertImplicitly = (value: unknown): any => {
  if (value === '' || value === null || value === undefined) {
    return value
  }

  const numValue = Number(value)
  return !isNaN(numValue) ? numValue : value
}

/**
 * 軽量な基本変換（JSONコンポーネント以外）
 */
export const DH__convertDataType = (value: unknown, type?: string, convertFor: string = 'server'): any => {
  if (!type) {
    return DH__convertImplicitly(value)
  }

  if (value === undefined || value === null) {
    return value
  }

  const convertedType = DH__switchColType({type})

  switch (convertedType) {
    case 'number':
      return DH__convertToNumber(value)
    case 'rating':
      return DH__convertToRating(value)
    case 'date':
      return DH__convertToDate(value, convertFor)
    case 'datetime':
      return DH__convertToDateTime(value, convertFor)
    case 'text':
      return DH__convertToText(value)
    case 'array':
      return DH__convertToArray(value)
    case 'boolean':
      return DH__convertToBoolean(value)
    case 'time':
      return value
    case 'json':
      return DH__convertToJsonString(value)
    default:
      return value?.toString() ?? null
  }
}
