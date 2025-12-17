import {isPlainObject, isArray} from './validators'
import type {ObjectFilterOptions, TransformOptions, PlainObject} from './types'

/**
 * オブジェクトのプロパティを初期化
 */
export const obj__initializeProperty = (parent: PlainObject, key: string | number, defaultValue: unknown): void => {
  if (!isPlainObject(parent)) {
    throw new Error('親オブジェクトは有効なオブジェクトである必要があります')
  }

  if (parent[key] === undefined) {
    parent[key] = defaultValue
  }
}

/**
 * オブジェクトのプロパティをフィルタリング
 */
export const obj__filterObject = <T extends PlainObject, K extends keyof T>(object: T, keys: K[]): Pick<T, K> => {
  if (!isPlainObject(object)) {
    throw new Error('第一引数はオブジェクトである必要があります')
  }

  if (!isArray(keys)) {
    throw new Error('キーは配列である必要があります')
  }

  const filteredObject = {} as Pick<T, K>

  keys.forEach(key => {
    if (key in object) {
      filteredObject[key] = object[key]
    }
  })

  return filteredObject
}

/**
 * オブジェクトのプロパティを除外
 */
export const obj__omitObject = <T extends PlainObject, K extends keyof T>(object: T, keys: K[]): Omit<T, K> => {
  if (!isPlainObject(object)) {
    throw new Error('第一引数はオブジェクトである必要があります')
  }

  if (!isArray(keys)) {
    throw new Error('キーは配列である必要があります')
  }

  const result = {...object}
  keys.forEach(key => {
    delete result[key]
  })

  return result as Omit<T, K>
}

/**
 * オブジェクトを配列に変換
 */
export const obj__objectToArray = <T extends PlainObject>(object: T): Array<{key: string; value: T[keyof T]}> => {
  if (!isPlainObject(object)) {
    throw new Error('引数はオブジェクトである必要があります')
  }

  return Object.entries(object).map(([key, value]) => ({
    key,
    value,
  })) as Array<{key: string; value: T[keyof T]}>
}

/**
 * 配列をオブジェクトに変換
 */
export const obj__arrayToObject = <T extends PlainObject>(
  array: T[],
  keyProperty: keyof T = 'key' as keyof T
): Record<string, Omit<T, typeof keyProperty>> => {
  if (!isArray(array)) {
    throw new Error('第一引数は配列である必要があります')
  }

  const result: Record<string, any> = {}

  array.forEach(item => {
    if (!isPlainObject(item) || !(keyProperty in item)) {
      throw new Error(`配列の要素は '${String(keyProperty)}' プロパティを持つ必要があります`)
    }

    const key = String(item[keyProperty])
    const {[keyProperty]: _, ...rest} = item
    result[key] = rest
  })

  return result
}

/**
 * オブジェクトのクリーニング
 */
export const obj__cleanObject = <T extends PlainObject>(original: T, options: ObjectFilterOptions<any> = {}): Partial<T> => {
  if (!isPlainObject(original)) {
    return {} as Partial<T>
  }

  const {includeUndefined = false, includeNull = false, includeEmptyString = false, customFilter} = options

  const cleaned: Partial<T> = {}

  Object.entries(original).forEach(([key, value]) => {
    let shouldInclude = true

    // 標準的なフィルタリング
    if (value === undefined && !includeUndefined) {
      shouldInclude = false
    } else if (value === null && !includeNull) {
      shouldInclude = false
    } else if (value === '' && !includeEmptyString) {
      shouldInclude = false
    } else if (value === 'undefined' || value === 'null') {
      shouldInclude = false
    }

    // カスタムフィルタ
    if (shouldInclude && customFilter) {
      shouldInclude = customFilter(key, value)
    }

    if (shouldInclude) {
      cleaned[key as keyof T] = value as T[keyof T]
    }
  })

  return cleaned
}

/**
 * オブジェクトの変換
 */
export const obj__transformObject = <T, R>(
  object: Record<string, T>,
  options: TransformOptions<T, R> = {}
): Record<string, R> => {
  if (!isPlainObject(object)) {
    throw new Error('第一引数はオブジェクトである必要があります')
  }

  const {
    keyTransformer = (key: string) => key,
    valueTransformer = (value: T) => value as unknown as R,
    filterPredicate = () => true,
  } = options

  const result: Record<string, R> = {}

  Object.entries(object).forEach(([key, value]) => {
    if (filterPredicate(key, value)) {
      const transformedKey = keyTransformer(key)
      const transformedValue = valueTransformer(value, key)
      result[transformedKey] = transformedValue
    }
  })

  return result
}

/**
 * オブジェクトをフラット化
 */
export const obj__flattenObject = (obj: PlainObject, prefix: string = '', separator: string = '.'): PlainObject => {
  if (!isPlainObject(obj)) {
    return {}
  }

  const flattened: PlainObject = {}

  Object.keys(obj).forEach(key => {
    const newKey = prefix ? `${prefix}${separator}${key}` : key

    if (isPlainObject(obj[key]) && !isArray(obj[key])) {
      Object.assign(flattened, obj__flattenObject(obj[key] as PlainObject, newKey, separator))
    } else {
      flattened[newKey] = obj[key]
    }
  })

  return flattened
}

/**
 * フラット化されたオブジェクトを復元
 */
export const obj__unflattenObject = (obj: PlainObject, separator: string = '.'): PlainObject => {
  if (!isPlainObject(obj)) {
    return {}
  }

  const result: PlainObject = {}

  Object.keys(obj).forEach(key => {
    const keys = key.split(separator)
    let current = result

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!(k in current) || !isPlainObject(current[k])) {
        current[k] = {}
      }
      current = current[k] as PlainObject
    }

    current[keys[keys.length - 1]] = obj[key]
  })

  return result
}

/**
 * オブジェクトをソート
 */
export const obj__sortObjectByKeys = <T extends PlainObject>(obj: T, compareFn?: (a: string, b: string) => number): T => {
  if (!isPlainObject(obj)) {
    return obj
  }

  const sortedKeys = Object.keys(obj).sort(compareFn)
  const result = {} as T

  sortedKeys.forEach(key => {
    result[key as keyof T] = obj[key] as T[keyof T]
  })

  return result
}
