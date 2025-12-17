// データハンドラー用の型定義
import {colTypeStr} from '@cm/types/types'

export type BaseColTypes =
  | 'password'
  | 'json'
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'rating'
  | 'time'
  | 'color'
  | 'array'

export interface DataTypeMapping {
  [key: string]: colTypeStr[]
}

export interface ConvertDataOptions {
  convertFor?: 'server' | 'client'
}

export interface SeparatedFormData {
  id: any
  modelBasicData: Record<string, any>
  relationIds: Record<string, any>
}

export interface FormDataSeparationInput {
  latestFormData: Record<string, any>
  additionalPayload?: Record<string, any>
}
