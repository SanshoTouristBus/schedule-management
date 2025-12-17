'use client'
const defaultSummaryInTdArgs = {
  hideUndefinedValue: false,
  labelWidthPx: 70,
  wrapperWidthPx: 160,
  showShadow: true,
}

import {colType, colTypeOptional} from '@cm/types/col-types'
import {aggregateOnSingleTd, aggregateOnSingleTdProps} from 'src/cm/class/Fields/lib/aggregateOnSingleTd'
import {addColIndexs} from 'src/cm/class/Fields/lib/addColIndex'
import {setAttribute} from 'src/cm/class/Fields/lib/setAttribute'
import {transposeColumns} from 'src/cm/class/Fields/lib/transposeColumns'

import {NestHandler} from '@cm/class/NestHandler'

import React from 'react'

import {TableInfo, TableInfoWrapper} from '@cm/class/builders/ColBuilderVariables'
import {DH__convertDataType} from '@cm/class/DataHandler/type-converter'
import {defaultFormat} from '@cm/class/Fields/lib/defaultFormat'
import {NumHandler} from '../NumHandler'
import InlineEditableValue from '@cm/components/DataLogic/TFs/MyTable/components/MainTable/TdContent/InlineEditableValue'
import {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'

export const defaultSelect = {id: true, name: true}
export const masterDataSelect = {...defaultSelect, color: true}

type freeColType = Exclude<colTypeOptional, 'id' | 'label'>
export type setterType = (props: {col: colType}) => freeColType

// 編集可能かどうかを判定するヘルパー関数
const isColEditable = (col: colType): boolean => {
  // form設定があり、disabledでなく、format（カスタム表示）がない場合は編集可能
  return Boolean(col.form) && col.form?.disabled !== true && !col.format
}

export class Fields {
  plain: colType[]
  private cache = new Map()

  constructor(array: colType[]) {
    this.plain = array
  }

  setTdMinWidth = ({minWidth, maxWidth = undefined}) => {
    return this.customAttributes(({col}) => {
      return {
        ...col,
        td: {...col?.td, style: {minWidth, maxWidth}},
      }
    })
  }

  showSummaryInTd = (
    props: {
      wrapperLabel?: any
      wrapperWidthPx?: number
      labelWidthPx?: number
      hideUndefinedValue?: boolean
      showShadow?: boolean
      convertColId?: {[key: string]: string}
      editable?: boolean // インライン編集を有効にする
    } & colTypeOptional
  ) => {
    const columns = this.plain
    const cacheKey = `summary_${columns.map(d => d.id).join('_')}_${JSON.stringify(props)}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const {hideUndefinedValue, wrapperWidthPx, labelWidthPx, showShadow, editable} = {...defaultSummaryInTdArgs, ...props}
    const id = `readOnly_${columns.map(d => d.id).join('_')}`

    // SummaryRowコンポーネント（editable対応）
    const SummaryRow = React.memo(
      ({
        value,
        row,
        dataModelName,
        UseRecordsReturn,
      }: {
        value: any
        row: any
        dataModelName?: string
        UseRecordsReturn?: UseRecordsReturn
      }) => {
        const existingValues: {label: string; value: React.ReactNode; col?: colType}[] = []
        const undefinedLabels: {label: string; value: React.ReactNode}[] = []

        columns
          .filter(col => col.td?.hidden !== true)
          .forEach(col => {
            const pseudoId = props.convertColId?.[col.id] ?? col.id
            let colValue: React.ReactNode = ''

            if (col.format) {
              colValue = col.format(value, row, col)
            } else if (col.type === 'price') {
              colValue = NumHandler.toPrice(row[col.id])
            } else if (col.type === 'password') {
              colValue = '********'
            } else if (col.forSelect) {
              const val = DH__convertDataType(NestHandler.GetNestedValue(pseudoId, row), col.type, 'client')
              colValue = defaultFormat(val, row, col) as string
            } else {
              colValue = DH__convertDataType(NestHandler.GetNestedValue(pseudoId, row), col.type, 'client')
            }

            const item = {label: col.label, value: colValue, col}

            if (hideUndefinedValue && !colValue) {
              undefinedLabels.push(item)
            } else {
              existingValues.push(item)
            }
          })

        return (
          <TableInfoWrapper {...{showShadow, label: props.wrapperLabel ?? ''}}>
            {existingValues.map((d, i) => {
              const canEdit = editable && d.col && isColEditable(d.col) && dataModelName && UseRecordsReturn

              return (
                <div key={i}>
                  <div
                    style={{
                      border: '1px dashed transparent',
                      borderBottomColor: '#e0e0e0',
                    }}
                  >
                    <TableInfo label={d.label} wrapperWidthPx={wrapperWidthPx} labelWidthPx={labelWidthPx}>
                      {canEdit ? (
                        <InlineEditableValue
                          col={{...d.col!, td: {...d.col!.td, editable: {}}}}
                          record={row}
                          displayValue={d.value}
                          dataModelName={dataModelName}
                          UseRecordsReturn={UseRecordsReturn}
                        />
                      ) : (
                        d.value
                      )}
                    </TableInfo>
                  </div>
                </div>
              )
            })}
            {hideUndefinedValue && undefinedLabels.length > 0 && (
              <div className="mt-1">
                <small>
                  <TableInfo label="データ無" wrapperWidthPx={wrapperWidthPx} labelWidthPx={labelWidthPx}>
                    <div className="text-xs opacity-50">{undefinedLabels.map(d => d.label).join(', ')}</div>
                  </TableInfo>
                </small>
              </div>
            )}
          </TableInfoWrapper>
        )
      }
    )

    const result = new Fields([
      {
        id,
        label: '',
        form: {hidden: true},
        td: {withLabel: false},
        // editable時は関数を返して実行時コンテキストを受け取る
        format: editable
          ? (value, row) => {
              return ({dataModelName, UseRecordsReturn}: {dataModelName: string; UseRecordsReturn: UseRecordsReturn}) => (
                <SummaryRow value={value} row={row} dataModelName={dataModelName} UseRecordsReturn={UseRecordsReturn} />
              )
            }
          : (value, row) => <SummaryRow value={value} row={row} />,
      },
      ...new Fields(columns).customAttributes(({col}) => ({...col, td: {hidden: true}})).plain,
    ])

    this.cache.set(cacheKey, result)
    return result
  }

  customAttributes = (
    setter: setterType,
    options?: {
      include?: string[]
      exclude?: string[]
    }
  ) => {
    const cols = this.plain
    const cacheKey = JSON.stringify({cols, options})

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const defaultInclude = (cols ?? []).map(col => col.id)
    const {include = defaultInclude, exclude} = options ?? {}

    const result = cols.map(col => {
      const isInExclude = exclude?.includes(col.id)
      const isInInclude = include?.includes(col.id)

      if (isInExclude) return col
      if (isInInclude) return {...col, ...setter({col})}
      return col
    })

    const newFields = new Fields(result)
    this.cache.set(cacheKey, newFields)
    return newFields
  }

  setNormalTd = () => {
    const result = this.customAttributes(({col}) => {
      const withLabel = !col?.td?.withLabel
      return {...col, td: {...col.td, withLabel}}
    })

    return result
  }
  aggregateOnSingleTd = (props?: aggregateOnSingleTdProps & {cols?: any}) => {
    const result = aggregateOnSingleTd({...props, cols: this.setNormalTd().plain})
    this.plain = result
    return new Fields(result)
  }

  buildFormGroup = ({groupName}) => {
    return this.customAttributes(({col}) => {
      return {...col, form: {...col.form, colIndex: groupName}}
    })
  }

  transposeColumns = () => {
    const cols = this.plain
    return transposeColumns(cols)
  }

  static transposeColumns = transposeColumns
  static mod = {aggregateOnSingleTd, addColIndexs, setAttribute}

  static doShowLabel = (col: colType) => col?.td?.withLabel === true
}
