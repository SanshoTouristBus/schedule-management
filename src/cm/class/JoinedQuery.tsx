import {anyObject} from '@cm/types/utility-types'

// 型定義の改善
export interface ModelData {
  id?: any
  [key: string]: any
}

export interface JoinedQueryConstructorType {
  query: anyObject
  queryKey: string
  modelDataArr: ModelData[]
  uniqueKeyOnModel: string
  type: 'add' | 'switch'
}

export interface QueryArrayResult {
  all: string[]
  current: string[]
}

export interface QueryStringResult {
  all: string
  current: string
}

export interface ExtractResult {
  array: () => QueryArrayResult
  string: () => QueryStringResult
}

export interface CheckActiveParams {
  modelData: ModelData
}

export interface BuildQueryParams {
  modelData: ModelData
}

// JoinedQueryインスタンスの型を取得
export type JoinedQueryInstanceType = InstanceType<typeof JoinedQuery>

// ユーティリティ関数（メモ化対応）
const sortStringArray = (() => {
  const cache = new Map<string, string[]>()

  return (array: string[]): string[] => {
    const cacheKey = array.join('|')

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!
    }

    const sorted = [...array].sort((a, b) => a.localeCompare(b))
    cache.set(cacheKey, sorted)
    return sorted
  }
})()

const safeStringify = (value: any): string => {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
}

const parseQueryString = (queryValue: any): string[] => {
  if (!queryValue) {
    return []
  }

  const stringValue = safeStringify(queryValue)
  if (!stringValue) {
    return []
  }

  return stringValue.split(',').filter(Boolean)
}

export class JoinedQuery {
  private readonly query: anyObject
  private readonly queryKey: string
  private readonly modelDataArr: ModelData[]
  private readonly uniqueKeyOnModel: string
  private readonly type: 'add' | 'switch'

  // キャッシュ用プロパティ
  private _cachedExtract: ExtractResult | null = null

  constructor(props: JoinedQueryConstructorType) {
    const {query, queryKey, modelDataArr, uniqueKeyOnModel, type} = props

    // 入力検証
    if (!query || typeof query !== 'object') {
      throw new Error('Invalid query object')
    }

    if (!queryKey || typeof queryKey !== 'string') {
      throw new Error('Invalid queryKey')
    }

    if (!Array.isArray(modelDataArr)) {
      throw new Error('modelDataArr must be an array')
    }

    if (!uniqueKeyOnModel || typeof uniqueKeyOnModel !== 'string') {
      throw new Error('Invalid uniqueKeyOnModel')
    }

    if (type !== 'add' && type !== 'switch') {
      throw new Error('type must be "add" or "switch"')
    }

    this.query = query
    this.queryKey = queryKey
    this.modelDataArr = modelDataArr
    this.uniqueKeyOnModel = uniqueKeyOnModel
    this.type = type
  }

  /**
   * データ抽出（キャッシュ機能付き）
   */
  extract = (): ExtractResult => {
    if (this._cachedExtract) {
      return this._cachedExtract
    }

    const arrayResult = (): QueryArrayResult => {
      try {
        // 全データから一意キーを抽出
        const allValues = this.modelDataArr
          .map(data => {
            const value = data?.[this.uniqueKeyOnModel]
            return safeStringify(value)
          })
          .filter(Boolean)

        // 現在のクエリ値を解析
        const currentValues = parseQueryString(this.query[this.queryKey])

        return {
          all: sortStringArray([...new Set(allValues)]), // 重複除去
          current: sortStringArray([...new Set(currentValues)]), // 重複除去
        }
      } catch (error) {
        console.error('Error in extract.array:', error)
        return {all: [], current: []}
      }
    }

    const stringResult = (): QueryStringResult => {
      const arrays = arrayResult()
      return {
        all: arrays.all.join(','),
        current: arrays.current.join(','),
      }
    }

    this._cachedExtract = {
      array: arrayResult,
      string: stringResult,
    }

    return this._cachedExtract
  }

  /**
   * アクティブ状態チェック（最適化）
   */
  checkIsActive = ({modelData}: CheckActiveParams): boolean => {
    if (!modelData || typeof modelData !== 'object') {
      return false
    }

    try {
      const currentValues = this.extract().array().current
      const targetValue = safeStringify(modelData[this.uniqueKeyOnModel])

      if (!targetValue) {
        return false
      }

      return currentValues.includes(targetValue)
    } catch (error) {
      console.error('Error in checkIsActive:', error)
      return false
    }
  }

  /**
   * クエリ文字列構築（最適化）
   */
  buildQueryStr = ({modelData}: BuildQueryParams): string => {
    if (!modelData || typeof modelData !== 'object') {
      return ''
    }

    try {
      const targetValue = safeStringify(modelData[this.uniqueKeyOnModel])

      if (!targetValue) {
        return ''
      }

      if (this.type === 'switch') {
        return this._buildSwitchQuery(targetValue)
      } else {
        return this._buildAddQuery(targetValue)
      }
    } catch (error) {
      console.error('Error in buildQueryStr:', error)
      return ''
    }
  }

  /**
   * スイッチクエリ構築（プライベート）
   */
  private _buildSwitchQuery = (targetValue: string): string => {
    const isActive = this.checkIsActive({
      modelData: {[this.uniqueKeyOnModel]: targetValue},
    })

    return isActive ? '' : targetValue
  }

  /**
   * 追加クエリ構築（プライベート）
   */
  private _buildAddQuery = (targetValue: string): string => {
    const currentValues = this.extract().array().current
    const isActive = this.checkIsActive({
      modelData: {[this.uniqueKeyOnModel]: targetValue},
    })

    let newValues: string[]

    if (isActive) {
      // 削除
      newValues = currentValues.filter(value => value !== targetValue)
    } else {
      // 追加
      newValues = [...currentValues, targetValue]
    }

    // 重複除去とソート
    const uniqueValues = [...new Set(newValues)].filter(Boolean)
    return sortStringArray(uniqueValues).join(',')
  }

  /**
   * キャッシュクリア（パフォーマンス管理）
   */
  clearCache = (): void => {
    this._cachedExtract = null
  }

  /**
   * 現在の設定を取得（デバッグ用）
   */
  getConfig = () => {
    return {
      queryKey: this.queryKey,
      uniqueKeyOnModel: this.uniqueKeyOnModel,
      type: this.type,
      modelDataCount: this.modelDataArr.length,
    }
  }

  /**
   * 有効なモデルデータのみを取得
   */
  getValidModelData = (): ModelData[] => {
    return this.modelDataArr.filter(data => {
      return data && typeof data === 'object' && data[this.uniqueKeyOnModel] !== null && data[this.uniqueKeyOnModel] !== undefined
    })
  }

  /**
   * 統計情報を取得
   */
  getStats = () => {
    const extract = this.extract()
    const arrays = extract.array()

    return {
      totalItems: arrays.all.length,
      activeItems: arrays.current.length,
      inactiveItems: arrays.all.length - arrays.current.length,
      activePercentage: arrays.all.length > 0 ? Math.round((arrays.current.length / arrays.all.length) * 100) : 0,
    }
  }
}

// // 型エクスポート
// export type {ModelData, QueryArrayResult, QueryStringResult, ExtractResult, CheckActiveParams, BuildQueryParams}
