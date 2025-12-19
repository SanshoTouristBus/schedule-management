'use client'

import React, {useState, useEffect, useRef, useCallback} from 'react'
import {toast} from 'react-toastify'
import {PencilIcon} from 'lucide-react'

import {colType} from '@cm/types/col-types'
import {Fields} from '@cm/class/Fields/Fields'
import {UpsertMain} from '@cm/components/DataLogic/TFs/MyForm/helpers/UpsertMain'
import useBasicFormProps from '@cm/hooks/useBasicForm/useBasicFormProps'
import {CssString} from '@cm/components/styles/cssString'
import {cn} from '@cm/shadcn/lib/utils'
import {UseRecordsReturn} from '@cm/components/DataLogic/TFs/PropAdjustor/hooks/useRecords/useRecords'
import {onFormItemBlurType} from '@cm/types/types'
import {
  generalDoStandardPrisma,
} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import useLocalLoading from '@cm/hooks/globalHooks/useLocalLoading'

export type InlineEditableValueProps = {
  col: colType
  record: any
  displayValue: React.ReactNode
  dataModelName: string
  UseRecordsReturn: UseRecordsReturn
}

const InlineEditableValue = React.memo(
  ({col, record, displayValue, dataModelName, UseRecordsReturn}: InlineEditableValueProps) => {
    const {toggleLocalLoading, LocalLoader} = useLocalLoading()
    const {toggleLoad} = useGlobal()
    const [isEditMode, setIsEditMode] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // 最後に保存した値を追跡（2回目以降の更新検出用）
    const lastSavedValueRef = useRef(record[col.id])

    const {upsertController = {}} = col.td?.editable ?? {}

    // バリデーション
    const validateBeforeUpdate = useCallback(
      async ({value, formData}: {value: any; formData: any}) => {
        const validate = col?.form?.register?.validate
        if (validate) {
          const message = await validate?.(value, formData)
          return message
        }
      },
      [col]
    )

    // セレクトや日付ピッカーは自動オープン、それ以外はオートフォーカス
    const isSelectType = Boolean(col.forSelect || col.multipleSelect)
    const isDateType = ['date', 'month', 'datetime', 'year'].includes(col.type ?? '')
    const shouldAutoOpen = isSelectType || isDateType

    // フォーム用カラム設定
    const formStyle = {...(col?.td?.style ?? {}), width: '100%', maxWidth: 300, minHeight: undefined}
    const columns: colType[][] = new Fields([
      {
        ...col,
        inputProps: {
          [`data-usage`]: `editableCellInput`,
          autoOpen: shouldAutoOpen, // Select/DatePickerは自動オープン
          autoFocus: !shouldAutoOpen, // その他は自動フォーカス
          ...col.inputProps,
        },
        form: {...col.form, style: formStyle},
      },
    ]).transposeColumns()

    // データ更新処理
    const updateData = useCallback(
      async (data: any) => {
        const latestFormData = {
          ...record,
          ...data,
        }
        const oldValue = JSON.stringify(lastSavedValueRef.current ?? '')
        const newValue = JSON.stringify(data[col.id] ?? '')

        const isSame = oldValue === newValue

        if (isSame) {
          setIsEditMode(false)
          return false
        }

        const res = await toggleLocalLoading(async () => {
          const message = await validateBeforeUpdate({value: data[col.id], formData: data})
          const doUpdate = message === undefined || message === true

          if (doUpdate === false) {
            toast.error(message, {position: `top-center`})
            UseRecordsReturn.mutateRecords({record: record})
            return false
          }

          const payload = {[col.id]: data[col.id]}

          // 最後に保存した値と比較（2回目以降の更新も検出）
          await UpsertMain({
            prismaDataExtractionQuery: {},
            latestFormData: {...latestFormData, ...payload},
            upsertController: upsertController,
            extraFormState: {},
            dataModelName: dataModelName as any,
            additional: {},
            formData: record,
            columns,
          })

          const {result: latestRecord} = await generalDoStandardPrisma(dataModelName, 'findUnique', {
            where: {id: record.id},
            include: UseRecordsReturn.prismaDataExtractionQuery?.include,
          })

          // 保存成功後、最後に保存した値を更新
          lastSavedValueRef.current = payload[col.id]
          UseRecordsReturn.mutateRecords({
            record: latestRecord,
          })

          return true
        })

        return res
      },
      [record, col, dataModelName, UseRecordsReturn, validateBeforeUpdate, upsertController, columns]
    )

    // Select/DatePickerの場合は選択時に即座に保存して閉じる
    const handleFormItemBlur = useCallback(
      async (props: {newlatestFormData: any; e?: React.FocusEvent}) => {
        if (shouldAutoOpen) {
          // フォーカス移動先がモーダル内の場合は保存をスキップ
          // （検索欄クリック時などでモーダルが閉じないようにする）
          const relatedTarget = props.e?.relatedTarget as HTMLElement | null
          if (relatedTarget) {
            const isInsideModal =
              relatedTarget.closest('[role="dialog"]') ||
              relatedTarget.closest('[data-radix-popper-content-wrapper]') ||
              relatedTarget.closest('[data-vaul-drawer]') ||
              relatedTarget.closest('.ModalContent')
            if (isInsideModal) {
              return // モーダル内へのフォーカス移動は保存しない
            }
          }

          // Select/DatePickerは選択で即保存・終了
          const success = await updateData(props.newlatestFormData)
          if (success !== false) {
            setIsEditMode(false)
          }
        }
      },
      [shouldAutoOpen, updateData]
    )

    const {
      BasicForm: EditableForm,
      ReactHookForm,
      latestFormData,
    } = useBasicFormProps({
      focusOnMount: true,
      columns: columns,
      formData: record,
      values: record,
      onFormItemBlur: handleFormItemBlur as unknown as onFormItemBlurType,
    })

    // 編集モード開始
    const startEdit = useCallback(() => {
      setIsEditMode(true)
    }, [])

    // 保存して編集モード終了
    const saveAndExit = useCallback(async () => {
      const success = await updateData(ReactHookForm.getValues())
      if (success !== false) {
        setIsEditMode(false)
      }
    }, [updateData, ReactHookForm])

    // キャンセルして編集モード終了
    const cancelEdit = useCallback(() => {
      ReactHookForm.reset(record)
      setIsEditMode(false)
    }, [ReactHookForm, record])

    // boolean型の場合はクリックでトグル
    const toggleBoolean = useCallback(async () => {
      const currentValue = record[col.id]
      const newValue = !currentValue
      const success = await updateData({[col.id]: newValue})
      if (success !== false) {
        // 更新成功時は何もしない（updateData内でmutateRecordsが呼ばれる）
      }
    }, [record, col.id, updateData])

    // 外側クリックで保存して閉じる
    useEffect(() => {
      if (!isEditMode) return

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement

        // wrapperRef内のクリックは無視
        if (wrapperRef.current?.contains(target)) return

        // Radixのポップオーバー/ダイアログ/ドロワー内のクリックは無視
        // （Portal経由でbody直下にレンダリングされるため）
        if (
          target.closest('[data-radix-popper-content-wrapper]') ||
          target.closest('[role="dialog"]') ||
          target.closest('[data-vaul-drawer]') ||
          target.closest('.ModalContent')
        ) {
          return
        }

        saveAndExit()
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isEditMode, saveAndExit])

    // 表示モード
    if (!isEditMode) {
      const isBooleanType = col.type === 'boolean'
      const handleClick = isBooleanType ? toggleBoolean : startEdit

      return (
        <div
          onClick={handleClick}
          className={cn(
            'cursor-pointer rounded px-1 py-0.5 transition-colors',
            'hover:bg-blue-50    bg-yellow-50',
            'group relative',
            'flex items-center  flex-nowrap'
          )}
        >
          <span>{displayValue}</span>
          {!isBooleanType && (
            <PencilIcon
              className={cn(
                // ' right-0 top-1/2 -translate-y-1/2',
                'h-4 w-4 text-blue-400 opacity-0 transition-opacity',
                'group-hover:opacity-100'
              )}
            />
          )}
        </div>
      )
    }

    // 編集モード
    return (
      <div
        ref={wrapperRef}
        className="rounded bg-white "
        onKeyDown={async (e: React.KeyboardEvent<HTMLDivElement>) => {
          const target = e.target as HTMLElement

          // モーダル内（Portal）からのキーイベントは無視
          // 検索欄でのEnterなどがフォーム送信にならないようにする
          const isInsideModal =
            target.closest('[role="dialog"]') ||
            target.closest('[data-radix-popper-content-wrapper]') ||
            target.closest('[data-vaul-drawer]') ||
            target.closest('.ModalContent')

          if (isInsideModal) {
            return // モーダル内からのキーイベントは処理しない
          }

          if (e.key === 'Enter') {
            e.preventDefault()
            await saveAndExit()
          } else if (e.key === 'Escape') {
            e.preventDefault()
            cancelEdit()
          }
        }}
      >
        <EditableForm
          alignMode="row"
          latestFormData={latestFormData}
          ControlOptions={{
            controllClassName: CssString.table.editableCellFormControllClassName,
            showLabel: false,
            showDescription: false,
            ControlStyle: {
              ...(col.td?.editable?.style ?? {
                minWidth: `fit-content`,
                height: `fit-content`,
                margin: `auto`,
              }),
            },
          }}
        />
        <LocalLoader>データ更新中</LocalLoader>
      </div>
    )
  }
)

InlineEditableValue.displayName = 'InlineEditableValue'

export default InlineEditableValue
