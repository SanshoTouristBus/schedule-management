'use client'

import {R_Stack} from '@cm/components/styles/common-components/common-components'
import {bodyRecordsType, CsvTableProps} from '@cm/components/styles/common-components/CsvTable/CsvTable'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {CSVLink} from 'react-csv'

const defaultDataArranger = (records: bodyRecordsType) => {
  if (!records || records.length === 0) return []

  // 最初の行からヘッダーを取得
  const header = records[0].csvTableRow.map(d => d.label || d.cellValue)

  // 全行をCSVデータに変換
  const csvDataArray: any[] = records.map((row, rowIdx) => {
    const colObj: any = Object.fromEntries(
      row.csvTableRow.map((d, colIdx) => {
        const key = header[colIdx]
        return [key, d.cellValueRaw ?? d.cellValue]
      })
    )
    return colObj
  })

  return csvDataArray
}

export type CsvDownloaderProps = {
  records: bodyRecordsType
  csvOutput?: CsvTableProps['csvOutput']
}

export const Downloader = (props: CsvDownloaderProps) => {
  const linkRef = useRef<any>(null)
  const {records, csvOutput} = props
  const [csvDataArr, setcsvDataArr] = useState<any[]>([])

  const initalData = async () => {
    const dataArrangeFunc = csvOutput?.dataArranger ?? defaultDataArranger
    const csvDataArr = await dataArrangeFunc(records)
    setcsvDataArr(csvDataArr)
  }

  const linkId = useMemo(() => `csv-link-${Date.now()}`, [])

  const outputCsv = useCallback(() => {
    if (csvDataArr.length > 0 && linkRef.current) {
      const link = document.getElementById(linkId)
      if (link) {
        link.click()
        alert('CSVファイルをダウンロードしました')
      }
    }
  }, [csvDataArr, linkId])

  useEffect(() => {
    if (csvDataArr.length > 0) {
      outputCsv()
    }
  }, [csvDataArr])

  if (!records || records.length === 0) return null

  if (csvOutput) {
    return (
      <R_Stack>
        <button onClick={initalData} className={`t-link`} type="button">
          CSV
        </button>
        <CSVLink id={linkId} ref={linkRef} data={csvDataArr} filename={`${csvOutput?.fileTitle}.csv`} />
      </R_Stack>
    )
  } else {
    return null
  }
}
