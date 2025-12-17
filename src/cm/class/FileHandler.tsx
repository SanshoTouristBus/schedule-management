import Axios from 'src/cm/lib/axios'
import {FILE_TYPE_CONFIGS, FileTypeConfig} from '@cm/types/file-types'
import {requestResultType} from '@cm/types/types'

// プログレス情報の型
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// アップロード結果の型
export interface UploadResult extends requestResultType {
  fileInfo?: {
    name: string
    size: number
    type: string
    lastModified: number
  }
  uploadTime?: number
}

// S3アップロード用のフォームデータ型（新しいAPI用）
export interface S3FormData {
  bucketKey: string
  deleteImageUrl?: string
  optimize?: boolean
}

export interface SendFileToS3Props {
  file: File | null
  formDataObj: S3FormData
  onProgress?: (progress: UploadProgress) => void
  validateFile?: boolean
}

// ファイル検証結果の型
export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

// ファイルリスト検証結果の型
export interface FileListValidationResult {
  isValid: boolean
  validFiles: File[]
  invalidFiles: {file: File; errors: string[]}[]
  totalSize: number
  totalSizeFormatted: string
  errorMessages: string[]
  summary: {
    totalFiles: number
    validFiles: number
    invalidFiles: number
    oversizedFiles: number
    unsupportedFiles: number
  }
}

// リサイズオプションの型
export interface ResizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0-1の範囲
  format?: 'jpeg' | 'png' | 'webp'
  maintainAspectRatio?: boolean
}

// リサイズ結果の型
export interface ResizeResult {
  success: boolean
  originalFile: File
  resizedFile?: File
  originalSize: number
  resizedSize: number
  compressionRatio?: number
  error?: string
}

// ヘルパー関数
const isValidFile = (file: File | null): file is File => {
  return file !== null && file instanceof File && file.size > 0
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 画像リサイズ用のヘルパー関数
const createCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const calculateResizeDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean = true
): {width: number; height: number} => {
  if (!maintainAspectRatio) {
    return {width: maxWidth, height: maxHeight}
  }

  const aspectRatio = originalWidth / originalHeight

  let newWidth = maxWidth
  let newHeight = maxHeight

  if (originalWidth > originalHeight) {
    newHeight = newWidth / aspectRatio
    if (newHeight > maxHeight) {
      newHeight = maxHeight
      newWidth = newHeight * aspectRatio
    }
  } else {
    newWidth = newHeight * aspectRatio
    if (newWidth > maxWidth) {
      newWidth = maxWidth
      newHeight = newWidth / aspectRatio
    }
  }

  return {width: Math.round(newWidth), height: Math.round(newHeight)}
}

export class FileHandler {
  /**
   * ファイルタイプ設定を取得
   */
  static getFileTypeConfigs(): readonly FileTypeConfig[] {
    return FILE_TYPE_CONFIGS
  }

  /**
   * ファイル情報を取得
   */
  static getFileInfo(file: File): {
    name: string
    size: number
    type: string
    lastModified: number
    sizeFormatted: string
    extension: string
  } {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      sizeFormatted: formatFileSize(file.size),
      extension: file.name.split('.').pop()?.toLowerCase() || '',
    }
  }

  /**
   * ファイル検証（強化版）
   */
  static validateFile(file: File): FileValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!isValidFile(file)) {
      errors.push('無効なファイルです')
      return {isValid: false, errors, warnings}
    }

    // ファイル名の検証
    if (!file.name || file.name.trim().length === 0) {
      errors.push('ファイル名が無効です')
    }

    // ファイルサイズの検証
    if (file.size === 0) {
      errors.push('ファイルサイズが0バイトです')
    }

    const fileSize = file.size
    // MIMEタイプの検証
    const config = FILE_TYPE_CONFIGS.find(config => config.mediaType === file.type)
    if (config === undefined) {
      errors.push(`サポートされていないファイル形式です: ${file.type}`)
    } else if (config.maxSizeMB && fileSize > config.maxSizeMB) {
      errors.push(`ファイルサイズが制限を超えています: ${formatFileSize(fileSize)} > ${formatFileSize(config.maxSizeMB)}`)
    }

    // ファイル名の文字数制限
    if (file.name.length > 255) {
      errors.push('ファイル名が長すぎます（255文字以内）')
    }

    // 危険な拡張子のチェック
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.jar']
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension && dangerousExtensions.includes(`.${extension}`)) {
      errors.push('危険なファイル形式です')
    }

    return {isValid: errors.length === 0, errors, warnings}
  }

  /**
   * ファイルリスト全体の検証（新機能）
   */
  static validateFileList(files: File[]): FileListValidationResult {
    const validFiles: File[] = []
    const invalidFiles: {file: File; errors: string[]}[] = []
    let totalSize = 0
    let oversizedFiles = 0
    let unsupportedFiles = 0

    // 各ファイルの検証
    files.forEach(file => {
      const validation = FileHandler.validateFile(file)
      totalSize += file.size

      if (validation.isValid) {
        validFiles.push(file)
      } else {
        invalidFiles.push({file, errors: validation.errors})

        // エラーの分類
        if (validation.errors.some(error => error.includes('ファイルサイズが制限を超えています'))) {
          oversizedFiles++
        }
        if (validation.errors.some(error => error.includes('サポートされていないファイル形式'))) {
          unsupportedFiles++
        }
      }
    })

    const errorMessages = invalidFiles.map((invalid, index) => `ファイル${index + 1} (${invalid.file.name}): ${invalid.errors}`)

    return {
      isValid: invalidFiles.length === 0,
      validFiles,
      invalidFiles,
      errorMessages,
      totalSize,
      totalSizeFormatted: formatFileSize(totalSize),
      summary: {
        totalFiles: files.length,
        validFiles: validFiles.length,
        invalidFiles: invalidFiles.length,
        oversizedFiles,
        unsupportedFiles,
      },
    }
  }

  /**
   * 画像ファイルのクライアントサイドリサイズ（新機能）
   */
  static async resizeImage(file: File, options: ResizeOptions = {}): Promise<ResizeResult> {
    const {maxWidth = 800, maxHeight = 600, quality = 0.8, format = 'jpeg', maintainAspectRatio = true} = options

    return new Promise(resolve => {
      // 画像ファイルでない場合はエラー
      if (!file.type.startsWith('image/')) {
        resolve({
          success: false,
          originalFile: file,
          originalSize: file.size,
          resizedSize: 0,
          error: '画像ファイルではありません',
        })
        return
      }

      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        resolve({
          success: false,
          originalFile: file,
          originalSize: file.size,
          resizedSize: 0,
          error: 'Canvas context を取得できませんでした',
        })
        return
      }

      img.onload = () => {
        try {
          // リサイズ後の寸法を計算
          const {width, height} = calculateResizeDimensions(img.width, img.height, maxWidth, maxHeight, maintainAspectRatio)

          // Canvasのサイズを設定
          canvas.width = width
          canvas.height = height

          // 画像を描画
          ctx.drawImage(img, 0, 0, width, height)

          // Blobに変換
          canvas.toBlob(
            blob => {
              if (!blob) {
                resolve({
                  success: false,
                  originalFile: file,
                  originalSize: file.size,
                  resizedSize: 0,
                  error: 'Blob変換に失敗しました',
                })
                return
              }

              // 新しいファイル名を生成
              const originalName = file.name
              const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'))
              const newFileName = `${nameWithoutExt}_resized.${format}`

              // 新しいFileオブジェクトを作成
              const resizedFile = new File([blob], newFileName, {
                type: `image/${format}`,
                lastModified: Date.now(),
              })

              const compressionRatio = ((file.size - resizedFile.size) / file.size) * 100

              resolve({
                success: true,
                originalFile: file,
                resizedFile,
                originalSize: file.size,
                resizedSize: resizedFile.size,
                compressionRatio,
              })
            },
            `image/${format}`,
            quality
          )
        } catch (error) {
          resolve({
            success: false,
            originalFile: file,
            originalSize: file.size,
            resizedSize: 0,
            error: `リサイズ処理中にエラーが発生しました: ${error}`,
          })
        }
      }

      img.onerror = () => {
        resolve({
          success: false,
          originalFile: file,
          originalSize: file.size,
          resizedSize: 0,
          error: '画像の読み込みに失敗しました',
        })
      }

      // 画像を読み込み
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * 複数の画像ファイルを一括リサイズ（新機能）
   */
  static async resizeMultipleImages(
    files: File[],
    options: ResizeOptions = {},
    onProgress?: (index: number, result: ResizeResult) => void
  ): Promise<ResizeResult[]> {
    const results: ResizeResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const result = await FileHandler.resizeImage(file, options)
      results.push(result)

      if (onProgress) {
        onProgress(i, result)
      }
    }

    return results
  }

  /**
   * ファイルリストの自動最適化（検証 + リサイズ）（新機能）
   */
  static async optimizeFileList(
    files: File[],
    resizeOptions: ResizeOptions = {},
    onProgress?: (step: string, progress: number) => void
  ): Promise<{
    validFiles: File[]
    invalidFiles: {file: File; errors: string[]}[]
    resizedFiles: File[]
    summary: {
      totalFiles: number
      validFiles: number
      invalidFiles: number
      resizedFiles: number
      totalSizeReduction: number
    }
  }> {
    // Step 1: ファイル検証
    if (onProgress) onProgress('ファイル検証中...', 0)
    const validation = FileHandler.validateFileList(files)

    // Step 2: 画像ファイルのリサイズ
    if (onProgress) onProgress('画像リサイズ中...', 30)
    const imageFiles = validation.validFiles.filter(file => file.type.startsWith('image/'))
    const nonImageFiles = validation.validFiles.filter(file => !file.type.startsWith('image/'))

    const resizeResults = await FileHandler.resizeMultipleImages(imageFiles, resizeOptions, (index, result) => {
      if (onProgress) {
        const progress = 30 + (index / imageFiles.length) * 60
        onProgress(`画像リサイズ中... (${index + 1}/${imageFiles.length})`, progress)
      }
    })

    // Step 3: 結果の集計
    if (onProgress) onProgress('結果集計中...', 90)
    const resizedFiles: File[] = []
    let totalSizeReduction = 0

    resizeResults.forEach(result => {
      if (result.success && result.resizedFile) {
        resizedFiles.push(result.resizedFile)
        totalSizeReduction += result.originalSize - result.resizedSize
      } else {
        // リサイズに失敗した場合は元のファイルを使用
        resizedFiles.push(result.originalFile)
      }
    })

    // 非画像ファイルも追加
    resizedFiles.push(...nonImageFiles)

    if (onProgress) onProgress('完了', 100)

    return {
      validFiles: validation.validFiles,
      invalidFiles: validation.invalidFiles,
      resizedFiles,
      summary: {
        totalFiles: files.length,
        validFiles: validation.validFiles.length,
        invalidFiles: validation.invalidFiles.length,
        resizedFiles: resizeResults.filter(r => r.success).length,
        totalSizeReduction,
      },
    }
  }

  /**
   * S3へのファイル送信（新しいAPI対応版）
   */
  static sendFileToS3 = async (props: SendFileToS3Props): Promise<UploadResult> => {
    const {file, formDataObj, onProgress, validateFile = true} = props

    // 入力検証
    if (!isValidFile(file)) {
      return {
        success: false,
        message: '無効なファイルです',
        error: 'Invalid file object',
      }
    }

    if (!formDataObj || typeof formDataObj !== 'object') {
      return {
        success: false,
        message: '無効なフォームデータです',
        error: 'Invalid form data object',
      }
    }

    // bucketKeyの必須チェック
    if (!formDataObj.bucketKey || formDataObj.bucketKey.trim().length === 0) {
      return {
        success: false,
        message: 'bucketKeyが必要です',
        error: 'bucketKey is required',
      }
    }

    // ファイル検証（オプション）
    if (validateFile) {
      const validation = FileHandler.validateFile(file)
      if (!validation.isValid) {
        return {
          success: false,
          message: 'ファイル検証に失敗しました',
          error: validation.errors.join(', '),
        }
      }
    }

    const startTime = Date.now()

    try {
      // FormDataの構築
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucketKey', formDataObj.bucketKey)

      if (formDataObj.deleteImageUrl) {
        formData.append('deleteImageUrl', formDataObj.deleteImageUrl)
      }

      if (formDataObj.optimize !== undefined) {
        formData.append('optimize', formDataObj.optimize.toString())
      }

      // アップロード設定
      const config: any = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5分タイムアウト
      }

      // プログレス監視
      if (onProgress) {
        config.onUploadProgress = (progressEvent: any) => {
          const {loaded, total} = progressEvent
          if (total > 0) {
            const percentage = Math.round((loaded * 100) / total)
            onProgress({loaded, total, percentage})
          }
        }
      }

      // アップロード実行（新しいエンドポイント）
      const response = await Axios.post('/api/s3', formData, config)
      const result: requestResultType = response.data

      const uploadTime = Date.now() - startTime
      const fileInfo = FileHandler.getFileInfo(file)

      return {
        ...result,
        fileInfo,
        uploadTime,
      }
    } catch (error) {
      console.error('Error uploading file to S3:', error)

      let errorMessage = 'ファイルアップロードに失敗しました'

      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'アップロードがタイムアウトしました'
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'ネットワークエラーが発生しました'
        } else if (error.message.includes('413')) {
          errorMessage = 'ファイルサイズが大きすぎます'
        } else if (error.message.includes('400')) {
          errorMessage = 'ファイル形式またはリクエストが無効です'
        } else if (error.message.includes('403')) {
          errorMessage = 'アクセス権限がありません'
        } else if (error.message.includes('500')) {
          errorMessage = 'サーバーエラーが発生しました'
        }
      }

      return {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
        uploadTime: Date.now() - startTime,
      }
    }
  }

  /**
   * S3からファイルを削除
   */
  static deleteFileFromS3 = async (fileUrl: string): Promise<requestResultType> => {
    try {
      const response = await Axios.delete(`/api/s3?url=${encodeURIComponent(fileUrl)}`)
      return response.data
    } catch (error) {
      console.error('Error deleting file from S3:', error)
      return {
        success: false,
        message: 'ファイル削除に失敗しました',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * 署名付きURL生成
   */
  static generateSignedUrl = async (key: string, expiresIn: number = 3600): Promise<requestResultType> => {
    try {
      const response = await Axios.get(`/api/s3?key=${encodeURIComponent(key)}&expiresIn=${expiresIn}`)
      return response.data
    } catch (error) {
      console.error('Error generating signed URL:', error)
      return {
        success: false,
        message: '署名付きURLの生成に失敗しました',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * 複数ファイルの一括アップロード
   */
  static uploadMultipleFiles = async (
    files: File[],
    bucketKey: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const result = await FileHandler.sendFileToS3({
        file,
        formDataObj: {bucketKey},
        onProgress: onProgress ? progress => onProgress(i, progress) : undefined,
      })
      results.push(result)
    }

    return results
  }
}
