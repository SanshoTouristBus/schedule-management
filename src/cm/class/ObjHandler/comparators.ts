import {isPlainObject, isArray, isPrimitive} from './validators'

import type {ObjectComparisonResult, DeepMergeOptions, PlainObject} from './types'
import {obj__deepClone} from '@cm/class/ObjHandler/cloners'

/**
 * オブジェクトの深い比較
 */
export const deepCompare = (obj1: unknown, obj2: unknown, path: string = ''): ObjectComparisonResult => {
  const differences: ObjectComparisonResult['differences'] = []

  const compare = (a: unknown, b: unknown, currentPath: string) => {
    // 型が異なる場合
    if (typeof a !== typeof b) {
      differences.push({
        path: currentPath,
        type: 'changed',
        oldValue: a,
        newValue: b,
      })
      return
    }

    // プリミティブ値の比較
    if (isPrimitive(a)) {
      if (a !== b) {
        differences.push({
          path: currentPath,
          type: 'changed',
          oldValue: a,
          newValue: b,
        })
      }
      return
    }

    // 配列の比較
    if (isArray(a) && isArray(b)) {
      const maxLength = Math.max(a.length, b.length)
      for (let i = 0; i < maxLength; i++) {
        const itemPath = `${currentPath}[${i}]`
        if (i >= a.length) {
          differences.push({
            path: itemPath,
            type: 'added',
            newValue: b[i],
          })
        } else if (i >= b.length) {
          differences.push({
            path: itemPath,
            type: 'removed',
            oldValue: a[i],
          })
        } else {
          compare(a[i], b[i], itemPath)
        }
      }
      return
    }

    // オブジェクトの比較
    if (isPlainObject(a) && isPlainObject(b)) {
      const allKeys = new Set([...Object.keys(a), ...Object.keys(b)])

      allKeys.forEach(key => {
        const keyPath = currentPath ? `${currentPath}.${key}` : key

        if (!(key in a)) {
          differences.push({
            path: keyPath,
            type: 'added',
            newValue: b[key],
          })
        } else if (!(key in b)) {
          differences.push({
            path: keyPath,
            type: 'removed',
            oldValue: a[key],
          })
        } else {
          compare(a[key], b[key], keyPath)
        }
      })
    }
  }

  compare(obj1, obj2, path)

  return {
    isEqual: differences.length === 0,
    differences,
  }
}

/**
 * 深いマージ
 */
export const deepMerge = <T extends PlainObject>(target: T, source: Partial<T>, options: DeepMergeOptions = {}): T => {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    throw new Error('両方の引数はオブジェクトである必要があります')
  }

  const {arrayMergeStrategy = 'replace', customMerger} = options
  const result: PlainObject = obj__deepClone(target)

  Object.keys(source).forEach(key => {
    const targetValue = result[key]
    const sourceValue = source[key]

    // カスタムマージャーがある場合
    if (customMerger) {
      const customResult = customMerger(key, targetValue, sourceValue)
      if (customResult !== undefined) {
        result[key] = customResult
        return
      }
    }

    // 配列の処理
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (arrayMergeStrategy) {
        case 'concat':
          result[key] = [...targetValue, ...sourceValue]
          break
        case 'merge':
          result[key] = sourceValue.map((item, index) => {
            if (isPlainObject(item) && isPlainObject(targetValue[index])) {
              return deepMerge(targetValue[index] as PlainObject, item as PlainObject, options)
            }
            return item
          })
          break
        default: // 'replace'
          result[key] = sourceValue
      }
    }
    // オブジェクトの処理
    else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(targetValue as PlainObject, sourceValue as PlainObject, options)
    }
    // プリミティブ値の処理
    else {
      result[key] = sourceValue
    }
  })

  return result as T
}

/**
 * 浅い比較（パフォーマンス重視）
 */
export const shallowEqual = (obj1: unknown, obj2: unknown): boolean => {
  if (obj1 === obj2) {
    return true
  }

  if (!isPlainObject(obj1) || !isPlainObject(obj2)) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}
