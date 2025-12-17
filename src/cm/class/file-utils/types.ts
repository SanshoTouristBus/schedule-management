import {extType, MediaType} from '@cm/types/file-types'
import {requestResultType} from '@cm/types/types'

// ファイル設定の型定義
export interface FileTypeConfig {
  mediaType: MediaType
  ext: extType
  maxSize?: number // バイト単位
  description?: string
}

// ファイル検証結果の型定義
export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

// ファイル情報の型定義
export interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
  extension: string
  mediaType: MediaType | null
}

// アップロード進捗の型定義
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// アップロード結果の型定義
export interface UploadResult extends requestResultType {
  fileInfo?: FileInfo
  uploadTime?: number
}

// S3アップロード用のフォームデータ型
export interface S3FormData {
  bucketKey: string
  deleteImageUrl?: string
  optimize?: boolean
}

// S3アップロード用のプロパティ
export interface SendFileToS3Props {
  file: File | null
  formDataObj: S3FormData
  onProgress?: (progress: UploadProgress) => void
  validateFile?: boolean
}

// ファイル統計情報
export interface FileTypeStats {
  [key: string]: {
    count: number
    totalSize: number
  }
}

// ファイル処理オプション
export interface FileProcessingOptions {
  maxConcurrentUploads?: number
  chunkSize?: number
  retryAttempts?: number
  timeout?: number
}

// バッチ処理結果
export interface BatchProcessingResult {
  successful: FileInfo[]
  failed: Array<{file: File; error: string}>
  totalProcessed: number
  totalTime: number
}
