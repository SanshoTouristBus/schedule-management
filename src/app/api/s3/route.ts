import {NextRequest, NextResponse} from 'next/server'
import {S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {v4 as uuidv4} from 'uuid'
import sharp from 'sharp'

// S3クライアントの設定
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// サポートされているファイル形式
const SUPPORTED_FORMATS = {
  'image/jpeg': {ext: 'jpg', maxSize: 10 * 1024 * 1024, optimize: true},
  'image/jpg': {ext: 'jpg', maxSize: 10 * 1024 * 1024, optimize: true},
  'image/png': {ext: 'png', maxSize: 10 * 1024 * 1024, optimize: true},
  'image/webp': {ext: 'webp', maxSize: 10 * 1024 * 1024, optimize: true},
  'image/gif': {ext: 'gif', maxSize: 5 * 1024 * 1024, optimize: false},
  'image/bmp': {ext: 'bmp', maxSize: 20 * 1024 * 1024, optimize: true},
  'image/tiff': {ext: 'tiff', maxSize: 50 * 1024 * 1024, optimize: true},
  'image/svg+xml': {ext: 'svg', maxSize: 1 * 1024 * 1024, optimize: false},
  'video/mp4': {ext: 'mp4', maxSize: 100 * 1024 * 1024, optimize: false},
  'video/quicktime': {ext: 'mov', maxSize: 100 * 1024 * 1024, optimize: false},
  'video/webm': {ext: 'webm', maxSize: 100 * 1024 * 1024, optimize: false},
  'audio/mpeg': {ext: 'mp3', maxSize: 20 * 1024 * 1024, optimize: false},
  'audio/ogg': {ext: 'ogg', maxSize: 20 * 1024 * 1024, optimize: false},
  'application/pdf': {ext: 'pdf', maxSize: 50 * 1024 * 1024, optimize: false},
  'text/plain': {ext: 'txt', maxSize: 1 * 1024 * 1024, optimize: false},
}

// ファイル情報の型定義
interface FileInfo {
  originalName: string
  mimeType: string
  size: number
  buffer: Buffer
}

// レスポンス型定義
interface S3Response {
  success: boolean
  message: string
  result?: {
    url: string
    key: string
    bucket: string
    fileInfo: {
      originalName: string
      mimeType: string
      size: number
      optimized?: boolean
    }
  }
  error?: string
}

// ファイルの最適化処理
async function optimizeFile(buffer: Buffer, mimeType: string): Promise<{buffer: Buffer; optimized: boolean}> {
  const formatConfig = SUPPORTED_FORMATS[mimeType as keyof typeof SUPPORTED_FORMATS]

  if (!formatConfig?.optimize) {
    return {buffer, optimized: false}
  }

  try {
    let optimizedBuffer: Buffer

    switch (mimeType) {
      case 'image/jpeg':
      case 'image/jpg':
        optimizedBuffer = await sharp(buffer)
          .jpeg({quality: 85, progressive: true})
          .resize(2048, 2048, {fit: 'inside', withoutEnlargement: true})
          .toBuffer()
        break

      case 'image/png':
        optimizedBuffer = await sharp(buffer)
          .png({compressionLevel: 8})
          .resize(2048, 2048, {fit: 'inside', withoutEnlargement: true})
          .toBuffer()
        break

      case 'image/webp':
        optimizedBuffer = await sharp(buffer)
          .webp({quality: 85})
          .resize(2048, 2048, {fit: 'inside', withoutEnlargement: true})
          .toBuffer()
        break

      case 'image/bmp':
      case 'image/tiff':
        // BMPやTIFFはJPEGに変換
        optimizedBuffer = await sharp(buffer)
          .jpeg({quality: 85, progressive: true})
          .resize(2048, 2048, {fit: 'inside', withoutEnlargement: true})
          .toBuffer()
        break

      default:
        return {buffer, optimized: false}
    }

    // 最適化後のサイズが元のサイズより小さい場合のみ使用
    if (optimizedBuffer.length < buffer.length) {
      return {buffer: optimizedBuffer, optimized: true}
    }

    return {buffer, optimized: false}
  } catch (error) {
    console.warn('ファイル最適化に失敗しました:', error)
    return {buffer, optimized: false}
  }
}

// ファイル検証
function validateFile(fileInfo: FileInfo): {isValid: boolean; error?: string} {
  const {originalName, mimeType, size} = fileInfo

  // ファイル名の検証
  if (!originalName || originalName.trim().length === 0) {
    return {isValid: false, error: 'ファイル名が無効です'}
  }

  // ファイルサイズの検証
  if (size === 0) {
    return {isValid: false, error: 'ファイルサイズが0バイトです'}
  }

  // MIMEタイプの検証
  const formatConfig = SUPPORTED_FORMATS[mimeType as keyof typeof SUPPORTED_FORMATS]
  if (!formatConfig) {
    return {isValid: false, error: `サポートされていないファイル形式です: ${mimeType}`}
  }

  // サイズ制限の検証
  if (size > formatConfig.maxSize) {
    const maxSizeMB = (formatConfig.maxSize / (1024 * 1024)).toFixed(1)
    const fileSizeMB = (size / (1024 * 1024)).toFixed(1)
    return {isValid: false, error: `ファイルサイズが制限を超えています: ${fileSizeMB}MB > ${maxSizeMB}MB`}
  }

  return {isValid: true}
}

// S3にファイルをアップロード
async function uploadToS3(
  buffer: Buffer,
  key: string,
  mimeType: string,
  originalName: string
): Promise<{url: string; key: string; bucket: string}> {
  const bucket = process.env.S3_BUCKET_NAME!

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    Metadata: {
      originalName: encodeURIComponent(originalName),
      uploadedAt: new Date().toISOString(),
    },
  })

  await s3Client.send(command)

  // CloudFrontやS3の直接URLを構築
  const url = process.env.S3_CLOUDFRONT_DOMAIN
    ? `https://${process.env.S3_CLOUDFRONT_DOMAIN}/${key}`
    : `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  return {url, key, bucket}
}

// S3からファイルを削除
async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  })

  const res = await s3Client.send(command)
}

// URLからキーを抽出
function extractKeyFromUrl(url: string): string | null {
  return url
  try {
    const urlObj = new URL(url)

    // CloudFrontの場合
    if (process.env.S3_CLOUDFRONT_DOMAIN && urlObj.hostname === process.env.S3_CLOUDFRONT_DOMAIN) {
      return urlObj.pathname.substring(1) // 先頭の'/'を削除
    }

    // S3直接URLの場合
    if (urlObj.hostname.includes('.s3.') || urlObj.hostname.includes('.s3-')) {
      return urlObj.pathname.substring(1) // 先頭の'/'を削除
    }

    return null
  } catch (error) {
    console.warn('URL解析エラー:', error)
    return null
  }
}

// POST: ファイルアップロード
export async function POST(request: NextRequest): Promise<NextResponse<S3Response>> {
  try {
    const formData = await request.formData()

    const file = formData.get('file') as File
    const bucketKey = formData.get('bucketKey') as string
    const deleteImageUrl = formData.get('deleteImageUrl') as string
    const optimize = formData.get('optimize') === 'true'

    if (!bucketKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'bucketKeyが必要です',
          error: 'bucketKey is required',
        },
        {status: 400}
      )
    }

    // 既存ファイルの削除処理
    if (deleteImageUrl) {
      try {
        const keyToDelete = extractKeyFromUrl(deleteImageUrl)
        if (keyToDelete) {
          await deleteFromS3(keyToDelete)
          console.log('既存ファイルを削除しました:', keyToDelete)
        }
      } catch (error) {
        console.warn('既存ファイルの削除に失敗しました:', error)
        // 削除失敗は警告レベルで処理を続行
      }
    }

    // ファイルが提供されていない場合（削除のみの場合）
    if (!file) {
      return NextResponse.json({
        success: true,
        message: 'ファイルが削除されました',
      })
    }

    // ファイル情報の取得
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(new Uint8Array(arrayBuffer))
    const fileInfo: FileInfo = {
      originalName: file.name,
      mimeType: file.type,
      size: buffer.length,
      buffer,
    }

    // ファイル検証
    const validation = validateFile(fileInfo)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'ファイル検証エラー',
          error: validation.error,
        },
        {status: 400}
      )
    }

    // ファイルの最適化（オプション）
    let finalBuffer: Buffer = buffer
    let optimized = false

    if (optimize) {
      const optimizeResult = await optimizeFile(buffer, file.type)
      finalBuffer = optimizeResult.buffer
      optimized = optimizeResult.optimized
    }

    // ファイルキーの生成
    const formatConfig = SUPPORTED_FORMATS[file.type as keyof typeof SUPPORTED_FORMATS]
    const extension = formatConfig?.ext || file.name.split('.').pop() || 'bin'
    const fileName = `${uuidv4()}.${extension}`
    const key = `${bucketKey}/${fileName}`

    // S3にアップロード
    const uploadResult = await uploadToS3(finalBuffer, key, file.type, file.name)

    return NextResponse.json({
      success: true,
      message: 'ファイルが正常にアップロードされました',
      result: {
        ...uploadResult,
        fileInfo: {
          originalName: file.name,
          mimeType: file.type,
          size: finalBuffer.length,
          optimized,
        },
      },
    })
  } catch (error) {
    console.error('S3アップロードエラー:', error)

    let errorMessage = 'ファイルアップロードに失敗しました'
    if (error instanceof Error) {
      if (error.message.includes('NoSuchBucket')) {
        errorMessage = 'S3バケットが見つかりません'
      } else if (error.message.includes('AccessDenied')) {
        errorMessage = 'S3へのアクセス権限がありません'
      } else if (error.message.includes('EntityTooLarge')) {
        errorMessage = 'ファイルサイズが大きすぎます'
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 500}
    )
  }
}

// DELETE: ファイル削除
export async function DELETE(request: NextRequest): Promise<NextResponse<S3Response>> {
  try {
    const {searchParams} = new URL(request.url)
    const fileUrl = searchParams.get('url')

    const key = searchParams.get('key')

    if (!fileUrl && !key) {
      return NextResponse.json(
        {
          success: false,
          message: 'URLまたはキーが必要です',
          error: 'URL or key is required',
        },
        {status: 400}
      )
    }

    let keyToDelete = key
    if (!keyToDelete && fileUrl) {
      keyToDelete = extractKeyFromUrl(fileUrl)
    }

    if (!keyToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: '無効なURLまたはキーです',
          error: 'Invalid URL or key',
        },
        {status: 400}
      )
    }

    await deleteFromS3(keyToDelete)

    return NextResponse.json({
      success: true,
      message: 'ファイルが正常に削除されました',
    })
  } catch (error) {
    console.error('S3削除エラー:', error)

    let errorMessage = 'ファイル削除に失敗しました'
    if (error instanceof Error) {
      if (error.message.includes('NoSuchKey')) {
        errorMessage = 'ファイルが見つかりません'
      } else if (error.message.includes('AccessDenied')) {
        errorMessage = 'ファイル削除の権限がありません'
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 500}
    )
  }
}

// GET: 署名付きURL生成（プライベートファイル用）
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const {searchParams} = new URL(request.url)
    const key = searchParams.get('key')
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600') // デフォルト1時間

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          message: 'キーが必要です',
          error: 'Key is required',
        },
        {status: 400}
      )
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, {expiresIn})

    return NextResponse.json({
      success: true,
      message: '署名付きURLが生成されました',
      result: {
        url: signedUrl,
        key,
        expiresIn,
      },
    })
  } catch (error) {
    console.error('署名付きURL生成エラー:', error)

    return NextResponse.json(
      {
        success: false,
        message: '署名付きURLの生成に失敗しました',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 500}
    )
  }
}
