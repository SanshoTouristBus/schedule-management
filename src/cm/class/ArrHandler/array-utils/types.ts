// 配列操作用の型定義
export type SortOrder = 'asc' | 'desc'

export interface SortableItem {
  [key: string]: any
}

export interface SortKey {
  key: string
  priority?: string[]
}

export interface ArrayDiff<T> {
  createArr: T[]
  updateArr: T[]
  deleteArr: T[]
}

export interface FilterSpliceResult<T> {
  splicedArr: T[]
  resultArr: T[]
}
