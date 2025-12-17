import type {CSVParseOptions, CSVParseResult, CSVError, CSVStreamCallbacks, CSVPerformanceStats} from './types'

// デフォルト設定
const DEFAULT_OPTIONS: Required<CSVParseOptions> = {
  delimiter: ',',
  quote: '"',
  escape: '"',
  skipEmptyLines: true,
  trimWhitespace: true,
  encoding: 'UTF-8',
  chunkSize: 1024 * 64, // 64KB
  maxRows: 100000,
}

/**
 * 高性能CSVパーサー（メモリ効率重視）
 */
export class CSVParser {
  private options: Required<CSVParseOptions>
  private errors: CSVError[] = []
  private stats: Partial<CSVPerformanceStats> = {}

  constructor(options: Partial<CSVParseOptions> = {}) {
    this.options = {...DEFAULT_OPTIONS, ...options}
  }

  /**
   * 文字列からCSVを解析（同期処理）
   */
  parseString(csvString: string): CSVParseResult {
    const startTime = performance.now()
    const startMemory = this.getMemoryUsage()

    this.errors = []
    const data: string[][] = []

    try {
      const lines = this.splitLines(csvString)

      for (let i = 0; i < lines.length && i < this.options.maxRows; i++) {
        const line = lines[i]

        if (this.options.skipEmptyLines && !line.trim()) {
          continue
        }

        try {
          const row = this.parseLine(line, i + 1)
          if (row.length > 0 || !this.options.skipEmptyLines) {
            data.push(row)
          }
        } catch (error) {
          this.addError(i + 1, 0, error.message, 'parse')
        }
      }

      const endTime = performance.now()
      const endMemory = this.getMemoryUsage()

      return {
        data,
        rowCount: data.length,
        errors: this.errors,
        metadata: {
          parseTime: endTime - startTime,
          memoryUsage: endMemory - startMemory,
          encoding: this.options.encoding,
        },
      }
    } catch (error) {
      this.addError(0, 0, error.message, 'parse')

      return {
        data: [],
        rowCount: 0,
        errors: this.errors,
        metadata: {
          parseTime: performance.now() - startTime,
          encoding: this.options.encoding,
        },
      }
    }
  }

  /**
   * ストリーミング解析（大きなファイル用）
   */
  async parseStream(csvString: string, callbacks: CSVStreamCallbacks): Promise<CSVParseResult> {
    const startTime = performance.now()
    this.errors = []

    const lines = this.splitLines(csvString)
    const totalLines = lines.length
    let processedRows = 0

    const data: string[][] = []

    try {
      for (let i = 0; i < lines.length && i < this.options.maxRows; i++) {
        const line = lines[i]

        if (this.options.skipEmptyLines && !line.trim()) {
          continue
        }

        try {
          const row = this.parseLine(line, i + 1)

          if (row.length > 0 || !this.options.skipEmptyLines) {
            data.push(row)

            // コールバック実行
            if (callbacks.onRow) {
              callbacks.onRow(row, processedRows)
            }

            processedRows++

            // 進捗報告
            if (callbacks.onProgress && processedRows % 100 === 0) {
              callbacks.onProgress({
                processed: processedRows,
                total: totalLines,
                percentage: Math.round((processedRows / totalLines) * 100),
              })
            }
          }
        } catch (error) {
          const csvError: CSVError = {
            row: i + 1,
            message: error.message,
            type: 'parse',
          }

          this.errors.push(csvError)

          if (callbacks.onError) {
            callbacks.onError(csvError)
          }
        }

        // 非同期処理のためのyield
        if (i % 1000 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      }

      const result: CSVParseResult = {
        data,
        rowCount: data.length,
        errors: this.errors,
        metadata: {
          parseTime: performance.now() - startTime,
          encoding: this.options.encoding,
        },
      }

      if (callbacks.onComplete) {
        callbacks.onComplete(result)
      }

      return result
    } catch (error) {
      const csvError: CSVError = {
        row: 0,
        message: error.message,
        type: 'parse',
      }

      this.errors.push(csvError)

      if (callbacks.onError) {
        callbacks.onError(csvError)
      }

      throw error
    }
  }

  /**
   * 1行を解析（クォート対応）
   */
  private parseLine(line: string, rowNumber: number): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    let i = 0

    const {delimiter, quote, escape} = this.options

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === quote) {
        if (inQuotes && nextChar === quote) {
          // エスケープされたクォート
          current += quote
          i += 2
        } else {
          // クォートの開始または終了
          inQuotes = !inQuotes
          i++
        }
      } else if (char === delimiter && !inQuotes) {
        // 区切り文字
        result.push(this.processField(current))
        current = ''
        i++
      } else {
        current += char
        i++
      }
    }

    // 最後のフィールドを追加
    result.push(this.processField(current))

    return result
  }

  /**
   * フィールドの後処理
   */
  private processField(field: string): string {
    if (this.options.trimWhitespace) {
      field = field.trim()
    }
    return field
  }

  /**
   * 行分割（改行文字の正規化）
   */
  private splitLines(csvString: string): string[] {
    // 改行文字を統一（CRLF、CR → LF）
    const normalized = csvString.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    return normalized.split('\n')
  }

  /**
   * エラーを追加
   */
  private addError(row: number, column: number, message: string, type: CSVError['type']): void {
    this.errors.push({row, column, message, type})
  }

  /**
   * メモリ使用量を取得（概算）
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      return memory?.usedJSHeapSize || 0
    }
    return 0
  }

  /**
   * 統計情報を取得
   */
  getStats(): Partial<CSVPerformanceStats> {
    return this.stats
  }
}

/**
 * 簡易パーサー（軽量版）
 */
export const parseCSVSimple = (csvString: string, delimiter = ','): string[][] => {
  if (!csvString || typeof csvString !== 'string') {
    return []
  }

  const lines = csvString.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const result: string[][] = []

  for (const line of lines) {
    if (line.trim()) {
      result.push(line.split(delimiter).map(field => field.trim()))
    }
  }

  return result
}

/**
 * ファクトリー関数
 */
export const createCSVParser = (options?: Partial<CSVParseOptions>): CSVParser => {
  return new CSVParser(options)
}
