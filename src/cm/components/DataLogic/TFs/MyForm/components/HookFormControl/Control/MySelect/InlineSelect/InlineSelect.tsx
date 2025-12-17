'use client'

import React, {useState, useEffect, useRef, useCallback} from 'react'
import {optionType} from 'src/cm/class/Fields/col-operator-types'
import {contextsType} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/my-select-types'
import {useInlineSearch} from './useInlineSearch'
import {InlineDropdown} from './InlineDropdown'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {IconBtnForSelect} from '@cm/components/styles/common-components/IconBtn'
import {twMerge} from 'tailwind-merge'
import {CssString} from 'src/cm/components/styles/cssString'
import {cn} from '@cm/shadcn/lib/utils'
import PlaceHolder from 'src/cm/components/utils/loader/PlaceHolder'

const InlineSelect = React.memo((props: {contexts: contextsType}) => {
  const {contexts} = props
  const {MySelectContextValue, controlContextValue} = contexts
  const {currentValueToReadableStr, filteredOptions, handleOptionClick, COLOR, options} = MySelectContextValue
  const {col, formProps, ControlStyle, field} = controlContextValue
  const displayExtractKeys = col?.forSelect?.config?.displayExtractKeys ?? [`name`]

  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useInlineSearch(contexts, inputValue)

  // 初期値の設定
  useEffect(() => {
    if (!isFocused && currentValueToReadableStr) {
      setInputValue(String(currentValueToReadableStr))
    }
  }, [currentValueToReadableStr, isFocused])

  // 入力値の変更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
  }

  // オプションから表示文字列を取得
  const getOptionDisplayString = useCallback(
    (option: optionType): string => {
      if (option.label) {
        return String(option.label)
      }
      const displayParts = displayExtractKeys.map(key => option[key]).filter(Boolean)
      return displayParts.join(' ') || String(option.id || '')
    },
    [displayExtractKeys]
  )

  // オプション選択（クリックのみで確定）
  const handleSelectOption = useCallback(
    async (option: optionType) => {
      // 選択解除の場合は空文字を表示
      const isNullOption = option.id === null || option.id === undefined
      const displayStr = isNullOption ? '' : getOptionDisplayString(option)
      setInputValue(displayStr)
      setIsFocused(false)
      await handleOptionClick(option, filteredOptions)
      field.onBlur()
    },
    [getOptionDisplayString, handleOptionClick, filteredOptions, field]
  )

  // キー操作処理（Escapeでキャンセル）
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setIsFocused(false)
        setInputValue(String(currentValueToReadableStr || ''))
        field.onBlur()
      }
    },
    [currentValueToReadableStr, field]
  )

  // フォーカスアウト処理
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      // クリックイベントがドロップダウン内で発生した場合は処理しない
      if (containerRef.current?.contains(e.relatedTarget as Node)) {
        return
      }

      // 元の値に戻す（自動選択はしない）
      setInputValue(String(currentValueToReadableStr || ''))
      setIsFocused(false)
      field.onBlur()
    },
    [currentValueToReadableStr, field]
  )

  // フォーカスイン処理
  const handleFocus = () => {
    setIsFocused(true)
  }

  // クリックアウトサイド処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // 元の値に戻す（自動選択はしない）
        setInputValue(String(currentValueToReadableStr || ''))
        setIsFocused(false)
      }
    }

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFocused, currentValueToReadableStr])

  if (currentValueToReadableStr === undefined) {
    return <PlaceHolder />
  }

  const textAlignMent = COLOR ? `text-center` : `text-start`
  const optionWidth = (col?.forSelect?.option?.style.width ?? 220) as number
  const optionStyle = col?.forSelect?.option?.style ?? {width: optionWidth}
  const disabled = !!col?.form?.disabled

  return (
    <div ref={containerRef} className="relative w-full">
      <R_Stack style={{...ControlStyle}} className={cn(formProps.className, 'py-0')}>
        <IconBtnForSelect color={COLOR} className={twMerge(`w-full truncate flex justify-start`, textAlignMent)}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={twMerge(
              `w-full bg-transparent outline-none border-none`,
              CssString.fontSize.cell,
              disabled && `cursor-not-allowed opacity-50`
            )}
            placeholder={col.form?.placerHolder ?? '入力して検索'}
          />
        </IconBtnForSelect>
      </R_Stack>
      {isFocused && (
        <InlineDropdown
          contexts={contexts}
          filteredOptions={filteredOptions}
          isVisible={isFocused}
          onSelect={handleSelectOption}
          optionStyle={optionStyle}
        />
      )}
    </div>
  )
})

InlineSelect.displayName = 'InlineSelect'

export default InlineSelect
