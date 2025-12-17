export const arr__arrToCsv = (arr: string[][]): string => {
  return arr.map(row => row.join(',')).join('\n')
}

/**
 * 指定されたキーでオブジェクトを作成
 */
export const arr__createObjByKey = <T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T> => {
  return arr.reduce(
    (acc, item) => {
      acc[item[key]] = item
      return acc
    },
    {} as Record<string, T>
  )
}

/**
 * 配列をN個のグループに分割
 */
export const arr__splitIntoGroups = <T>(arr: T[], groupSize: number): T[][] => {
  if (groupSize <= 0) throw new Error('Group size must be positive')

  const result: T[][] = []
  for (let i = 0; i < arr.length; i += groupSize) {
    result.push(arr.slice(i, i + groupSize))
  }
  return result
}

/**
 * 配列から重複を除去（Set使用で高速化）
 */
export const arr__uniqArray = <T>(array: T[]): T[] => {
  return Array.from(new Set(array))
}

/**
 * 配列をランダムにシャッフル（Fisher-Yates法）
 */
export const arr__randomSort = <T>(array: T[]): T[] => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 配列を転置
 */
export const arr__transpose = <T>(array: T[][]): T[][] => {
  if (array.length === 0) return []
  return array[0].map((_, colIndex) => array.map(row => row[colIndex]))
}

export const arrayBasicOperations = {
  arr__arrToCsv,
  arr__createObjByKey,
  arr__splitIntoGroups,
  arr__uniqArray,
  arr__randomSort,
  arr__transpose,
}
