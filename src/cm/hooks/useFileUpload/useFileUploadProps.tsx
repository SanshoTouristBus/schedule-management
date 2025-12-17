'use client'

import React, {useCallback, useMemo, useState} from 'react'
import {toast} from 'react-toastify'
import {anyObject} from '@cm/types/utility-types'

import {FileRejection} from 'react-dropzone'
import FileUploader from 'src/cm/hooks/useFileUpload/FileUploader'

import {acceptType, FileData} from '@cm/types/file-types'

type FileUploadFormProps = {
  charset?: string
  maxFiles?: number
  readAs: 'readAsText' | 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsBinaryString' | undefined
  accept: acceptType
} & anyObject

const useFileUploadProps = (props: FileUploadFormProps) => {
  const {charset = 'UTF-8', maxFiles = 1, readAs = 'readAsDataURL', accept} = props

  const [fileArrState, setfileArrState] = useState<FileData[]>([])
  const [fileErrorState, setfileErrorState] = useState<FileRejection[]>([])

  const parseCSVLine = useCallback((line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // エスケープされたダブルクォート（""）
          current += '"'
          i += 2
        } else {
          // クォートの開始または終了
          inQuotes = !inQuotes
          i++
        }
      } else if (char === ',' && !inQuotes) {
        // クォート外のカンマ（区切り文字）
        result.push(current)
        current = ''
        i++
      } else {
        current += char
        i++
      }
    }

    result.push(current)
    return result
  }, [])

  const handleFileChange: (files: File[]) => void = useCallback(
    async (files: File[]) => {
      const inputFiles = await Promise.all(
        Array.from(files).map(async (file: File, i) => {
          const result = new Promise<FileData>((resolve, reject) => {
            const reader = new FileReader()
            readAs ? reader[readAs](file, charset) : '' //読み取り方の指定
            reader.onload = () => {
              const fileReadResult = reader.result

              if (fileReadResult) {
                const table: any[] = []
                const content = fileReadResult as string

                // 改行文字の統一（CRLF、CR → LF）
                const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

                normalizedContent.split('\n').forEach(str => {
                  // 空行をスキップ
                  if (str.trim()) {
                    const row = parseCSVLine(str)
                    table.push(row)
                  }
                })

                const fileStateForSingleItem: FileData = {
                  file,
                  fileName: file.name,
                  fileSize: file.size,
                  fileContent: table,
                }

                resolve(fileStateForSingleItem)
              }
            }

            reader.onerror = () => {
              toast.error('読み込みに失敗しました')
              reject()
            }
          })

          return result
        })
      )

      setfileArrState(prev => {
        const latestFiles = [...prev, ...inputFiles]

        if (latestFiles.length > maxFiles) {
          alert(`ファイルは最大${maxFiles}個までです`)
          return prev
        } else {
          return latestFiles
        }
      })
    },
    [parseCSVLine, readAs, charset, maxFiles]
  )

  const FileUploaderMemo = useMemo(() => {
    return (
      <FileUploader
        {...{
          accept,
          fileArrState,
          setfileArrState,

          fileErrorState,
          setfileErrorState,
          handleFileChange,
          maxFiles,
        }}
      />
    )
  }, [fileArrState, fileErrorState])

  const fileUploadIsReady = fileArrState.length > 0 && fileErrorState.length === 0

  return {
    ...props,
    fileArrState,
    fileErrorState,
    fileUploadIsReady,

    component: {
      FileUploaderMemo,
      // SubmitBtn,
    },
  }
}

export default useFileUploadProps
