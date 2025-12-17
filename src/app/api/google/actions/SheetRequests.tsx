import {Days} from '@cm/class/Days/Days'
import {formatDate} from '@cm/class/Days/date-utils/formatters'
import {sheets_v4} from 'googleapis'

// ヘルパー関数群
export const SheetRequests = {
  // セルの値を更新
  updateCell: (sheetId: number, row: number, col: number, value: any) => {
    let userEnteredValue
    if (typeof value === 'number') {
      userEnteredValue = {numberValue: value}
    } else if (Days.validate.isDate(value)) {
      userEnteredValue = {stringValue: formatDate(value, 'YYYY-MM-DD')}
    } else {
      userEnteredValue = {stringValue: String(value)}
    }

    const request: sheets_v4.Schema$Request = {
      updateCells: {
        rows: [{values: [{userEnteredValue: userEnteredValue ?? ''}]}],
        fields: 'userEnteredValue',
        start: {sheetId, rowIndex: row, columnIndex: col},
      },
    }
    return request
  },

  // 数式を設定
  setFormula: (sheetId: number, row: number, col: number, formula: string) => {
    const request: sheets_v4.Schema$Request = {
      updateCells: {
        rows: [
          {
            values: [
              {
                userEnteredValue: {formulaValue: formula},
              },
            ],
          },
        ],
        fields: 'userEnteredValue',
        start: {sheetId, rowIndex: row, columnIndex: col},
      },
    }
    return request
  },

  // セルの書式設定
  formatCell: (
    sheetId: number,
    row: number,
    col: number,
    format: {
      backgroundColor?: {red?: number; green?: number; blue?: number}
      textFormat?: {
        bold?: boolean
        italic?: boolean
        fontSize?: number
      }
      horizontalAlignment?: 'LEFT' | 'CENTER' | 'RIGHT'
    }
  ) => {
    const request: sheets_v4.Schema$Request = {
      updateCells: {
        rows: [
          {
            values: [
              {
                userEnteredFormat: format,
              },
            ],
          },
        ],
        fields: 'userEnteredFormat',
        start: {sheetId, rowIndex: row, columnIndex: col},
      },
    }

    return request
  },

  // セルの結合
  mergeCells: (sheetId: number, startRow: number, endRow: number, startCol: number, endCol: number) => {
    const request: sheets_v4.Schema$Request = {
      mergeCells: {
        range: {
          sheetId,
          startRowIndex: startRow,
          endRowIndex: endRow + 1,
          startColumnIndex: startCol,
          endColumnIndex: endCol + 1,
        },
        mergeType: 'MERGE_ALL',
      },
    }
    return request
  },
}
