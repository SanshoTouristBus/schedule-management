import {FileRejection} from 'react-dropzone'
import {acceptType, FileData} from '@cm/types/file-types'
import {CSVParseOptions} from './csv-utils/types'

// ファイルアップロードフォームのプロパティ
export interface FileUploadFormProps {
  charset?: string
  maxFiles?: number
  readAs?: 'readAsText' | 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsBinaryString'
  accept: acceptType
  enableOptimizedCSV?: boolean
  csvOptions?: Partial<CSVParseOptions>
}

// ファイルアップロードの状態
export interface FileUploadState {
  fileArrState: FileData[]
  fileErrorState: FileRejection[]
  isProcessing?: boolean
  fileUploadIsReady?: boolean
}

// ファイルアップロードのアクション
export interface FileUploadActions {
  handleFileChange: (files: File[]) => void | Promise<void>
  removeFile?: (index: number) => void
  clearFiles?: () => void
}

// ファイルアップロードフックの戻り値
export interface UseFileUploadReturn extends FileUploadState, FileUploadActions {
  component: {
    FileUploaderMemo: React.ReactElement
  }
}

// ファイルアップロードコンポーネントのプロパティ
export interface FileUploadComponentProps extends FileUploadFormProps, FileUploadState, FileUploadActions {
  onFileChange?: (files: File[]) => void
  onRemoveFile?: (index: number) => void
  onClearFiles?: () => void
}

// 再エクスポート
export type {FileData, acceptType} from '@cm/types/file-types'
