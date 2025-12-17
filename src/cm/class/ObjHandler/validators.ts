import type {PlainObject} from './types'

/**
 * 値がプレーンオブジェクトかどうかをチェック
 */
export const isPlainObject = (value: unknown): value is PlainObject => {
  if (value === null || typeof value !== 'object') {
    return false
  }

  // プロトタイプチェーンをチェック
  const proto = Object.getPrototypeOf(value)
  return proto === null || proto === Object.prototype
}

/**
 * 値が配列かどうかをチェック
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value)
}

/**
 * 値がプリミティブかどうかをチェック
 */
export const isPrimitive = (value: unknown): boolean => {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  )
}

/**
 * 値が関数かどうかをチェック
 */
export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function'
}

/**
 * 値がDateオブジェクトかどうかをチェック
 */
export const isDate = (value: unknown): value is Date => {
  return value instanceof Date
}

/**
 * 値がRegExpオブジェクトかどうかをチェック
 */
export const isRegExp = (value: unknown): value is RegExp => {
  return value instanceof RegExp
}

/**
 * オブジェクトが空かどうかをチェック
 */
export const isEmpty = (object: unknown): boolean => {
  if (!isPlainObject(object)) {
    return true
  }
  return Object.keys(object).length === 0
}

/**
 * オブジェクトに指定されたキーが存在するかチェック
 */
export const hasKey = <T extends PlainObject>(object: T, key: string | number | symbol): key is keyof T => {
  return isPlainObject(object) && key in object
}

/**
 * オブジェクトに指定された値が存在するかチェック
 */
export const hasValue = <T extends PlainObject>(object: T, value: unknown): boolean => {
  if (!isPlainObject(object)) {
    return false
  }
  return Object.values(object).includes(value)
}
