// データ操作関連
import {ArrayDiff, FilterSpliceResult} from './types'

/**
 * 新規、更新、削除の配列を作成（最適化版）
 */
export const arr__createUpdateDelete = (oldArr: any[] = [], latestArr: any[] = []): ArrayDiff<any> => {
  const oldMap = new Map(oldArr.map(item => [item.id, item]))
  const latestMap = new Map(latestArr.map(item => [item.id, item]))

  const createArr: any[] = []
  const updateArr: any[] = []
  const deleteArr: any[] = []

  // 新規・更新の判定
  latestArr.forEach(item => {
    if (!oldMap.has(item.id)) {
      createArr.push(item)
    } else {
      updateArr.push(item)
    }
  })

  // 削除の判定
  oldArr.forEach(item => {
    if (!latestMap.has(item.id)) {
      deleteArr.push(item)
    }
  })

  return {createArr, updateArr, deleteArr}
}

/**
 * アイテムの追加・削除を切り替え
 */
export const arr__addOrRemoveItem = <T extends {id: any}>(oldArray: T[], itemToAddOrRemove: T): T[] => {
  const array = [...oldArray]
  const index = array.findIndex(item => item.id === itemToAddOrRemove.id)

  if (index === -1) {
    array.push(itemToAddOrRemove)
  } else {
    array.splice(index, 1)
  }

  return array
}

/**
 * 2つの配列の共通値を取得（Set使用で高速化）
 */
export const arr__findCommonValues = <T>(arr1: T[], arr2: T[]): T[] | null => {
  const set1 = new Set(arr1)
  const commonValues = arr2.filter(value => set1.has(value))

  return commonValues.length > 0 ? commonValues : null
}

/**
 * フィルタリングと分割を同時実行
 */
export const arr__filterAndSplice = <T>(sourceArr: T[], filterFunc: (item: T) => boolean): FilterSpliceResult<T> => {
  const resultArr: T[] = []
  const splicedArr: T[] = []

  sourceArr.forEach(record => {
    if (filterFunc(record)) {
      resultArr.push(record)
    } else {
      splicedArr.push(record)
    }
  })

  return {splicedArr, resultArr}
}

/**
 * 指定位置にアイテムを挿入
 */
export const arr__insertItemAtIndex = <T>(arr: any[], index: number, item: T): T[] => {
  if (index < 0 || index > arr.length) {
    throw new Error('Index out of bounds')
  }

  const newArr = [...arr]
  newArr.splice(index, 0, item)
  return newArr
}

/**
 * 2次元配列を作成
 */
export const arr__getTwoDimensionalArray = <T>(sourceArr: T[], sectionCount: number): T[][] => {
  if (sectionCount <= 0) throw new Error('Section count must be positive')

  const result: T[][] = []
  for (let i = 0; i < sourceArr.length; i += sectionCount) {
    result.push(sourceArr.slice(i, i + sectionCount))
  }
  return result
}

export const arrayDataOperations = {
  arr__createUpdateDelete,
  arr__addOrRemoveItem,
  arr__findCommonValues,
  arr__filterAndSplice,
  arr__insertItemAtIndex,
  arr__getTwoDimensionalArray,
}
