export type MediaType =
  // Image types
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'image/gif'
  | 'image/heic'
  | 'image/webp'
  // Video types
  | 'video/quicktime'
  | 'video/mp4'
  | 'video/webm'
  // Audio types
  | 'audio/mpeg'
  | 'audio/ogg'
  // Text types
  | 'text/plain'
  | 'text/html'
  | 'text/css'
  | 'text/csv'
  // Application types
  | 'application/pdf'
  | 'application/json'
  | 'application/xml'

export type extType =
  // Image extensions
  | '.jpg'
  | '.jpeg'
  | '.png'
  | '.gif'
  | '.heic'
  | '.webp'
  // Video extensions
  | '.mov'
  | '.mp4'
  | '.webm'
  // Audio extensions
  | '.mp3'
  | '.ogg'
  // Text extensions
  | '.txt'
  | '.html'
  | '.css'
  | '.csv'
  // Application extensions
  | '.pdf'
  | '.json'
  | '.xml'

export type acceptType = {
  [key in MediaType]?: extType[]
}

/**fileStateArrの元となるデータ */
export type FileData = {
  file: File //通常のFileオブジェクト
  fileName: string
  fileSize: number
  fileContent: any | null
}

export type fileInfo = {
  ext: string
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

// 型定義の改善
export interface FileTypeConfig {
  type: 'image' | 'video' | 'audio' | 'text' | 'application'
  mediaType: MediaType
  ext: extType
  maxSizeMB?: number // バイト単位
  description?: string
}

export const Megabyte = 1024 * 1024
// 定数定義（メモ化対応）

export const FILE_TYPE_CONFIGS: readonly FileTypeConfig[] = Object.freeze([
  // 画像ファイル（2MBに制限）
  {type: 'image', mediaType: 'image/jpg', ext: '.jpg', maxSizeMB: 4 * Megabyte, description: 'JPEG画像'},
  {type: 'image', mediaType: 'image/jpeg', ext: '.jpeg', maxSizeMB: 4 * Megabyte, description: 'JPEG画像'},
  {type: 'image', mediaType: 'image/png', ext: '.png', maxSizeMB: 4 * Megabyte, description: 'PNG画像'},
  {type: 'image', mediaType: 'image/gif', ext: '.gif', maxSizeMB: 4 * Megabyte, description: 'GIF画像'},
  {type: 'image', mediaType: 'image/heic', ext: '.heic', maxSizeMB: 4 * Megabyte, description: 'HEIC画像'},
  {type: 'image', mediaType: 'image/webp', ext: '.webp', maxSizeMB: 4 * Megabyte, description: 'WebP画像'},

  // 動画ファイル
  {type: 'video', mediaType: 'video/quicktime', ext: '.mov', maxSizeMB: 100 * Megabyte, description: 'QuickTime動画'},
  {type: 'video', mediaType: 'video/mp4', ext: '.mp4', maxSizeMB: 100 * Megabyte, description: 'MP4動画'},
  {type: 'video', mediaType: 'video/webm', ext: '.webm', maxSizeMB: 100 * Megabyte, description: 'WebM動画'},

  // 音声ファイル
  {type: 'audio', mediaType: 'audio/mpeg', ext: '.mp3', maxSizeMB: 20 * Megabyte, description: 'MP3音声'},
  {type: 'audio', mediaType: 'audio/ogg', ext: '.ogg', maxSizeMB: 20 * Megabyte, description: 'OGG音声'},

  // ドキュメント
  {type: 'text', mediaType: 'text/plain', ext: '.txt', maxSizeMB: 1 * Megabyte, description: 'テキストファイル'},
  {type: 'text', mediaType: 'text/csv', ext: '.csv', maxSizeMB: 1 * Megabyte, description: 'CSVファイル'},
  {type: 'text', mediaType: 'text/html', ext: '.html', maxSizeMB: 1 * Megabyte, description: 'HTMLファイル'},
  {type: 'text', mediaType: 'text/css', ext: '.css', maxSizeMB: 1 * Megabyte, description: 'CSSファイル'},

  {type: 'application', mediaType: 'application/pdf', ext: '.pdf', maxSizeMB: 50 * Megabyte, description: 'PDFドキュメント'},
  {type: 'application', mediaType: 'application/json', ext: '.json', maxSizeMB: 1 * Megabyte, description: 'JSONファイル'},
  {type: 'application', mediaType: 'application/xml', ext: '.xml', maxSizeMB: 1 * Megabyte, description: 'XMLファイル'},
] as const)
