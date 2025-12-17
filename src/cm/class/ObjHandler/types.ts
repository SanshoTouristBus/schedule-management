export interface ObjectFilterOptions<T> {
  includeUndefined?: boolean
  includeNull?: boolean
  includeEmptyString?: boolean
  customFilter?: (key: string, value: any) => boolean
}

export interface DeepMergeOptions {
  arrayMergeStrategy?: 'replace' | 'concat' | 'merge'
  customMerger?: (key: string, target: any, source: any) => any
}

export interface ObjectComparisonResult {
  isEqual: boolean
  differences: Array<{
    path: string
    type: 'added' | 'removed' | 'changed'
    oldValue?: any
    newValue?: any
  }>
}

export interface TransformOptions<T, R> {
  keyTransformer?: (key: string) => string
  valueTransformer?: (value: T, key: string) => R
  filterPredicate?: (key: string, value: T) => boolean
}

// 型ガード用の型定義
export type PlainObject = Record<string, unknown>

// 深いクローン用の型定義
export type DeepClone<T> = T extends object
  ? T extends Array<infer U>
    ? Array<DeepClone<U>>
    : T extends Function
      ? T
      : {[K in keyof T]: DeepClone<T[K]>}
  : T
