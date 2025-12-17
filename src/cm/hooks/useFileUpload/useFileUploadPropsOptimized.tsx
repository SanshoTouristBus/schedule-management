import {useState, useCallback, useMemo} from 'react'
import {FileRejection} from 'react-dropzone'
import {toast} from 'react-toastify'
import {FileUploadFormProps, FileData} from './types'
import {createCSVParser, parseCSVSimple, type CSVParseOptions} from './csv-utils'

import FileUploader from '@cm/hooks/useFileUpload/FileUploader'

/**
 * 最適化されたファイルアップロードフック
 */
const useFileUploadPropsOptimized = (props: FileUploadFormProps) => {
  const {charset = 'UTF-8', maxFiles = 1, readAs = 'readAsDataURL', accept, enableOptimizedCSV = true, csvOptions = {}} = props

  const [fileArrState, setFileArrState] = useState<FileData[]>([])
  const [fileErrorState, setFileErrorState] = useState<FileRejection[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // CSV パーサーをメモ化
  const csvParser = useMemo(() => {
    if (!enableOptimizedCSV) return null

    const options: CSVParseOptions = {
      delimiter: ',',
      skipEmptyLines: true,
      trimWhitespace: true,
      encoding: charset,
      maxRows: 50000, // 大量データ対応
      ...csvOptions,
    }

    return createCSVParser(options)
  }, [enableOptimizedCSV, charset, csvOptions])

  // 最適化されたCSV解析関数
  const parseCSVOptimized = useCallback(
    async (content: string, fileName: string): Promise<any[]> => {
      if (!csvParser) {
        // フォールバック: 簡易パーサー
        return parseCSVSimple(content)
      }

      try {
        // ファイルサイズチェック
        const fileSizeKB = new Blob([content]).size / 1024

        if (fileSizeKB > 1024) {
          // 1MB以上
          console.log(`Large CSV file detected: ${fileSizeKB.toFixed(2)}KB, using streaming parser`)

          // 大きなファイルはストリーミング処理
          const result = await csvParser.parseStream(content, {
            onProgress: progress => {
              console.log(`CSV parsing progress: ${progress.percentage}%`)
            },
            onError: error => {
              console.warn(`CSV parsing error at row ${error.row}:`, error.message)
            },
          })

          if (result.errors.length > 0) {
            console.warn(`CSV parsing completed with ${result.errors.length} errors`)
          }

          return result.data
        } else {
          // 小さなファイルは同期処理
          const result = csvParser.parseString(content)

          if (result.errors.length > 0) {
            console.warn(`CSV parsing completed with ${result.errors.length} errors`)
          }

          return result.data
        }
      } catch (error) {
        console.error('CSV parsing failed, falling back to simple parser:', error)
        return parseCSVSimple(content)
      }
    },
    [csvParser]
  )

  // ファイル処理の最適化
  const processFile = useCallback(
    async (file: File): Promise<FileData> => {
      return new Promise<FileData>((resolve, reject) => {
        const reader = new FileReader()

        // 読み取り方法の指定
        if (readAs) {
          reader[readAs](file, charset)
        }

        reader.onload = async () => {
          try {
            const fileReadResult = reader.result

            if (!fileReadResult) {
              reject(new Error('ファイルの読み取りに失敗しました'))
              return
            }

            let fileContent: any = fileReadResult

            // CSV処理の最適化
            if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
              const content = fileReadResult as string

              // 改行文字の統一（CRLF、CR → LF）
              const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

              // 最適化されたCSV解析
              fileContent = await parseCSVOptimized(normalizedContent, file.name)
            }

            const fileStateForSingleItem: FileData = {
              file,
              fileName: file.name,
              fileSize: file.size,
              fileContent,
            }

            resolve(fileStateForSingleItem)
          } catch (error) {
            console.error('File processing error:', error)
            reject(error)
          }
        }

        reader.onerror = () => {
          const error = new Error('ファイルの読み込みに失敗しました')
          console.error('FileReader error:', error)
          reject(error)
        }
      })
    },
    [readAs, charset, parseCSVOptimized]
  )

  // バッチファイル処理（並列処理対応）
  const handleFileChange = useCallback(
    async (files: File[]) => {
      if (isProcessing) {
        console.warn('File processing already in progress')
        return
      }

      setIsProcessing(true)

      try {
        // 並列処理でファイルを処理（最大3ファイル同時）
        const maxConcurrency = Math.min(3, files.length)
        const filePromises: Promise<FileData>[] = []

        for (let i = 0; i < files.length; i++) {
          const filePromise = processFile(files[i])
          filePromises.push(filePromise)

          // 並列処理の制限
          if (filePromises.length >= maxConcurrency || i === files.length - 1) {
            const results = await Promise.allSettled(filePromises)

            const successfulFiles: FileData[] = []

            results.forEach((result, index) => {
              if (result.status === 'fulfilled') {
                successfulFiles.push(result.value)
              } else {
                console.error(`File processing failed for ${files[i - filePromises.length + index + 1].name}:`, result.reason)
                toast.error(`${files[i - filePromises.length + index + 1].name} の処理に失敗しました`)
              }
            })

            // 状態更新
            setFileArrState(prev => {
              const latestFiles = [...prev, ...successfulFiles]

              if (latestFiles.length > maxFiles) {
                toast.warning(`ファイルは最大${maxFiles}個までです`)
                return prev
              }

              return latestFiles
            })

            // 次のバッチのためにリセット
            filePromises.length = 0
          }
        }
      } catch (error) {
        console.error('Batch file processing error:', error)
        toast.error('ファイル処理中にエラーが発生しました')
      } finally {
        setIsProcessing(false)
      }
    },
    [processFile, maxFiles, isProcessing]
  )

  // ファイル削除
  const removeFile = useCallback((index: number) => {
    setFileArrState(prev => prev.filter((_, i) => i !== index))
  }, [])

  // ファイルクリア
  const clearFiles = useCallback(() => {
    setFileArrState([])
    setFileErrorState([])
  }, [])

  // メモ化されたコンポーネント
  const FileUploaderMemo = useMemo(() => {
    return (
      <FileUploader
        accept={accept}
        fileArrState={fileArrState}
        setfileArrState={setFileArrState}
        fileErrorState={fileErrorState}
        setfileErrorState={setFileErrorState}
        handleFileChange={handleFileChange}
        maxFiles={maxFiles}
      />
    )
  }, [props, fileArrState, fileErrorState, isProcessing, handleFileChange, removeFile, clearFiles])

  const fileUploadIsReady = fileArrState.length > 0 && fileErrorState.length === 0
  return {
    fileArrState,
    fileErrorState,
    isProcessing,
    fileUploadIsReady,
    handleFileChange,
    removeFile,
    clearFiles,
    component: {
      FileUploaderMemo,
    },
  }
}

export default useFileUploadPropsOptimized
