// ソート関連の操作
import {SortOrder, SortableItem} from './types'

/**
 * オブジェクト配列のソート（最適化版）
 */
export const arr__sortByKey = (array: any[], key: string, order: SortOrder = 'asc'): any[] => {
  return [...array].sort((x, y) => {
    const xValue = x?.[key] ?? x
    const yValue = y?.[key] ?? y

    // 数値比較
    const xNum = Number(xValue)
    const yNum = Number(yValue)

    if (!isNaN(xNum) && !isNaN(yNum)) {
      return order === 'asc' ? xNum - yNum : yNum - xNum
    }

    // 文字列比較
    const xStr = String(xValue)
    const yStr = String(yValue)
    const compareResult = xStr.localeCompare(yStr)

    return order === 'asc' ? compareResult : -compareResult
  })
}

/**
 * 複数キーによるカスタムソート（メモ化で最適化）
 */
export const arr__customSort = <T extends SortableItem>(
  array: T[],
  keys: (string | {key: string; priority?: string[]})[]
): T[] => {
  const memoizedGrouping = new Map()

  const sortByKey = ({array, item}: {array: T[]; item: string | {key: string}}) => {
    const key = typeof item === 'object' ? item.key : item
    const cacheKey = `${key}_${array.length}`

    if (memoizedGrouping.has(cacheKey)) {
      return memoizedGrouping.get(cacheKey)
    }

    const grouped: Record<string, T[]> = {}
    const nullGrouped: Record<string, T[]> = {}

    array.forEach(data => {
      const groupKey = data[key]
      const targetGroup = groupKey ? grouped : nullGrouped

      if (!targetGroup[groupKey]) {
        targetGroup[groupKey] = []
      }
      targetGroup[groupKey].push(data)
    })

    const result = {...grouped, ...nullGrouped}
    memoizedGrouping.set(cacheKey, result)
    return result
  }

  // 再帰的ソート処理
  const recursiveSortByKey = (currentArray: T[], currentKeys: typeof keys, index = 0): any => {
    if (index >= currentKeys.length) return currentArray

    const result = sortByKey({array: currentArray, item: currentKeys[index]})
    Object.keys(result).forEach(key => {
      result[key] = recursiveSortByKey(result[key], currentKeys, index + 1)
    })
    return result
  }

  const nestedGroupObject = recursiveSortByKey(array, keys)

  // フラット化
  const data: T[] = []
  const recursiveFlatten = (groupedObject: any, currentKeys: typeof keys, index = 0) => {
    if (index >= currentKeys.length) {
      data.push(...groupedObject)
      return
    }

    Object.keys(groupedObject).forEach(key => {
      recursiveFlatten(groupedObject[key], currentKeys, index + 1)
    })
  }

  recursiveFlatten(nestedGroupObject, keys)
  return data
}

export const arraySorting = {
  arr__sortByKey,
  arr__customSort,
}
