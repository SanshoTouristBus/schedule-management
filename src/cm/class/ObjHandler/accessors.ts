import {isPlainObject} from './validators'
import type {PlainObject} from './types'

/**
 * オブジェクトのキーを取得（型安全）
 */
export const obj__getObjectKeys = <T extends PlainObject>(object: T): Array<keyof T> => {
  if (!isPlainObject(object)) {
    return []
  }
  return Object.keys(object) as Array<keyof T>
}

/**
 * オブジェクトの値を取得（型安全）
 */
export const obj__getObjectValues = <T extends PlainObject>(object: T): Array<T[keyof T]> => {
  if (!isPlainObject(object)) {
    return []
  }
  return Object.values(object) as Array<T[keyof T]>
}

/**
 * オブジェクトのエントリを取得（型安全）
 */
export const obj__getObjectEntries = <T extends PlainObject>(object: T): Array<[keyof T, T[keyof T]]> => {
  if (!isPlainObject(object)) {
    return []
  }
  return Object.entries(object) as Array<[keyof T, T[keyof T]]>
}

/**
 * オブジェクトのサイズを取得
 */
export const obj__getObjectSize = (object: unknown): number => {
  if (!isPlainObject(object)) {
    return 0
  }
  return Object.keys(object).length
}
