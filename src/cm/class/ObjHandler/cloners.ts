import {isPlainObject, isArray, isPrimitive, isDate, isRegExp, isFunction} from './validators'
import type {DeepClone, PlainObject} from './types'

/**
 * 循環参照に対応した深いクローン
 */
export const obj__deepClone = <T>(obj: T, visited = new WeakMap()): DeepClone<T> => {
  // プリミティブ値はそのまま返す
  if (isPrimitive(obj)) {
    return obj as DeepClone<T>
  }

  // 循環参照チェック
  if (typeof obj === 'object' && obj !== null && visited.has(obj)) {
    return visited.get(obj)
  }

  // Date オブジェクト
  if (isDate(obj)) {
    return new Date(obj.getTime()) as DeepClone<T>
  }

  // RegExp オブジェクト
  if (isRegExp(obj)) {
    return new RegExp(obj.source, obj.flags) as DeepClone<T>
  }

  // 関数はそのまま返す（クローンしない）
  if (isFunction(obj)) {
    return obj as DeepClone<T>
  }

  // 配列の処理
  if (isArray(obj)) {
    const clonedArray: unknown[] = []
    visited.set(obj as object, clonedArray)

    obj.forEach((item, index) => {
      clonedArray[index] = obj__deepClone(item, visited)
    })

    return clonedArray as DeepClone<T>
  }

  // プレーンオブジェクトの処理
  if (isPlainObject(obj)) {
    const clonedObject: Record<string, unknown> = {}
    visited.set(obj, clonedObject)

    Object.keys(obj).forEach(key => {
      clonedObject[key] = obj__deepClone(obj[key], visited)
    })

    return clonedObject as DeepClone<T>
  }

  // その他のオブジェクト（Map, Set, etc.）はそのまま返す
  return obj as DeepClone<T>
}

/**
 * 浅いクローン（パフォーマンス重視）
 */
export const obj__shallowClone = <T extends PlainObject>(obj: T): T => {
  if (!isPlainObject(obj)) {
    throw new Error('引数はプレーンオブジェクトである必要があります')
  }

  return {...obj}
}

/**
 * 配列の浅いクローン
 */
export const obj__shallowCloneArray = <T>(arr: T[]): T[] => {
  if (!isArray(arr)) {
    throw new Error('引数は配列である必要があります')
  }

  return [...arr]
}
