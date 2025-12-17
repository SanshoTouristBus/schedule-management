// CSV処理の設定オプション
export interface CSVParseOptions {
  delimiter?: string
  quote?: string
  escape?: string
  skipEmptyLines?: boolean
  trimWhitespace?: boolean
  encoding?: string
  chunkSize?: number
  maxRows?: number
}

// CSV解析結果
export interface CSVParseResult {
  data: string[][]
  headers?: string[]
  rowCount: number
  errors: CSVError[]
  metadata: {
    parseTime: number
    memoryUsage?: number
    encoding: string
  }
}

// CSVエラー情報
export interface CSVError {
  row: number
  column?: number
  message: string
  type: 'parse' | 'validation' | 'encoding'
}

// ストリーミング処理用のコールバック
export interface CSVStreamCallbacks {
  onRow?: (row: string[], rowIndex: number) => void
  onProgress?: (progress: {processed: number; total?: number; percentage?: number}) => void
  onError?: (error: CSVError) => void
  onComplete?: (result: CSVParseResult) => void
}

// バッチ処理設定
export interface CSVBatchOptions {
  batchSize: number
  maxConcurrency: number
  delayBetweenBatches?: number
  onBatchComplete?: (batchIndex: number, batchData: string[][]) => void
}

// メモリ効率的な処理用の設定
export interface CSVMemoryOptions {
  useStreaming?: boolean
  maxMemoryUsage?: number // MB単位
  enableGarbageCollection?: boolean
  chunkProcessing?: boolean
}

// ファイル読み込み設定
export interface FileReadOptions extends CSVParseOptions {
  readAs?: 'readAsText' | 'readAsArrayBuffer' | 'readAsDataURL'
  charset?: string
  validateFile?: boolean
  maxFileSize?: number // バイト単位
}

// パフォーマンス統計
export interface CSVPerformanceStats {
  parseTime: number
  memoryPeak: number
  rowsPerSecond: number
  totalRows: number
  fileSize: number
}
