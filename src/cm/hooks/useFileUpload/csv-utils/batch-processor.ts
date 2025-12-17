import type {CSVBatchOptions, CSVMemoryOptions} from './types'

// バッチ処理の結果
export interface BatchProcessResult<T> {
  successful: T[]
  failed: Array<{index: number; data: any; error: string}>
  totalProcessed: number
  processingTime: number
  memoryUsage?: number
}

// バッチ処理設定のデフォルト値
const DEFAULT_BATCH_OPTIONS: Required<CSVBatchOptions> = {
  batchSize: 1000,
  maxConcurrency: 3,
  delayBetweenBatches: 100,
  onBatchComplete: () => {},
}

const DEFAULT_MEMORY_OPTIONS: Required<CSVMemoryOptions> = {
  useStreaming: true,
  maxMemoryUsage: 100, // 100MB
  enableGarbageCollection: true,
  chunkProcessing: true,
}

/**
 * 高性能バッチ処理クラス
 */
export class CSVBatchProcessor<T> {
  private batchOptions: Required<CSVBatchOptions>
  private memoryOptions: Required<CSVMemoryOptions>

  constructor(batchOptions: Partial<CSVBatchOptions> = {}, memoryOptions: Partial<CSVMemoryOptions> = {}) {
    this.batchOptions = {...DEFAULT_BATCH_OPTIONS, ...batchOptions}
    this.memoryOptions = {...DEFAULT_MEMORY_OPTIONS, ...memoryOptions}
  }

  /**
   * データを並列バッチ処理
   */
  async processBatches<R>(
    data: T[],
    processor: (batch: T[], batchIndex: number) => Promise<R[]>
  ): Promise<BatchProcessResult<R>> {
    const startTime = performance.now()
    const startMemory = this.getMemoryUsage()

    const successful: R[] = []
    const failed: Array<{index: number; data: any; error: string}> = []

    try {
      // データをバッチに分割
      const batches = this.chunkArray(data, this.batchOptions.batchSize)

      // 並列処理の制御
      const semaphore = new Semaphore(this.batchOptions.maxConcurrency)

      const batchPromises = batches.map(async (batch, batchIndex) => {
        await semaphore.acquire()

        try {
          // メモリ使用量チェック
          if (this.memoryOptions.maxMemoryUsage > 0) {
            const currentMemory = this.getMemoryUsage()
            if (currentMemory > this.memoryOptions.maxMemoryUsage * 1024 * 1024) {
              console.warn(`Memory usage exceeded: ${currentMemory / 1024 / 1024}MB`)

              if (this.memoryOptions.enableGarbageCollection && global.gc) {
                global.gc()
              }
            }
          }

          const results = await processor(batch, batchIndex)
          successful.push(...results)

          // バッチ完了コールバック
          if (this.batchOptions.onBatchComplete) {
            this.batchOptions.onBatchComplete(batchIndex, batch as any)
          }

          // バッチ間の遅延
          if (this.batchOptions.delayBetweenBatches > 0) {
            await this.delay(this.batchOptions.delayBetweenBatches)
          }
        } catch (error) {
          batch.forEach((item, itemIndex) => {
            failed.push({
              index: batchIndex * this.batchOptions.batchSize + itemIndex,
              data: item,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          })
        } finally {
          semaphore.release()
        }
      })

      await Promise.all(batchPromises)

      const endTime = performance.now()
      const endMemory = this.getMemoryUsage()

      return {
        successful,
        failed,
        totalProcessed: data.length,
        processingTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
      }
    } catch (error) {
      throw new Error(`Batch processing failed: ${error.message}`)
    }
  }

  /**
   * ストリーミングバッチ処理（メモリ効率重視）
   */
  async processStream<R>(
    data: T[],
    processor: (item: T, index: number) => Promise<R>,
    onProgress?: (progress: {processed: number; total: number; percentage: number}) => void
  ): Promise<BatchProcessResult<R>> {
    const startTime = performance.now()
    const successful: R[] = []
    const failed: Array<{index: number; data: any; error: string}> = []

    for (let i = 0; i < data.length; i++) {
      try {
        const result = await processor(data[i], i)
        successful.push(result)

        // 進捗報告
        if (onProgress && i % 100 === 0) {
          onProgress({
            processed: i + 1,
            total: data.length,
            percentage: Math.round(((i + 1) / data.length) * 100),
          })
        }

        // メモリ管理
        if (this.memoryOptions.enableGarbageCollection && i % 1000 === 0) {
          if (global.gc) {
            global.gc()
          }
          // 非同期処理のためのyield
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      } catch (error) {
        failed.push({
          index: i,
          data: data[i],
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return {
      successful,
      failed,
      totalProcessed: data.length,
      processingTime: performance.now() - startTime,
    }
  }

  /**
   * 配列をチャンクに分割
   */
  private chunkArray<U>(array: U[], chunkSize: number): U[][] {
    const chunks: U[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  /**
   * 遅延処理
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * メモリ使用量を取得
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      return memory?.usedJSHeapSize || 0
    }
    return 0
  }
}

/**
 * セマフォクラス（並列処理制御）
 */
class Semaphore {
  private permits: number
  private waitQueue: Array<() => void> = []

  constructor(permits: number) {
    this.permits = permits
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      this.waitQueue.push(resolve)
    })
  }

  release(): void {
    this.permits++

    if (this.waitQueue.length > 0) {
      const resolve = this.waitQueue.shift()
      if (resolve) {
        this.permits--
        resolve()
      }
    }
  }
}

/**
 * ファクトリー関数
 */
export const createBatchProcessor = <T>(
  batchOptions?: Partial<CSVBatchOptions>,
  memoryOptions?: Partial<CSVMemoryOptions>
): CSVBatchProcessor<T> => {
  return new CSVBatchProcessor<T>(batchOptions, memoryOptions)
}

/**
 * 簡易バッチ処理関数
 */
export const processBatchSimple = async <T, R>(
  data: T[],
  processor: (batch: T[]) => Promise<R[]>,
  batchSize = 1000
): Promise<R[]> => {
  const results: R[] = []

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const batchResults = await processor(batch)
    results.push(...batchResults)

    // 短い遅延でUIをブロックしない
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  return results
}
