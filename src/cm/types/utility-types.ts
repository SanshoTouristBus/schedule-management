export type nextPageProps = {
  params: {
    id: string
  }
  searchParams: {[key: string]: string | string[] | undefined}
}

// --- 汎用・ユーティリティ型 ---
import type {CSSProperties, ReactNode, Ref, MouseEventHandler, KeyboardEventHandler, FocusEventHandler} from 'react'
import {twMerge} from 'tailwind-merge'
import type {
  UseFormReturn,
  Message,
  ValidationRule,
  FieldPathValue,
  FieldValues,
  InternalFieldName,
  ValidateResult,
} from 'react-hook-form'
import type {fileInfo} from '@cm/types/file-types'

export type anyObject = {
  [key: string | number]: any
}

export type JSXReturnFunc = (props: any) => React.ReactNode

export type dataFormatterType = (value: any, row: anyObject, col: any) => any

export type requestResultType = {
  success: boolean
  message: string
  error?: any
  result?: any | ({fileInfo?: fileInfo; url?: string} & anyObject)
}

export type onFormItemBlurType = (props: {
  e: React.BaseSyntheticEvent
  id: string
  value: any
  name: string
  newlatestFormData: anyObject
  ReactHookForm: UseFormReturn
}) => any

export type registerType = {
  required?: Message | ValidationRule<boolean>
  min?: ValidationRule<number | string>
  max?: ValidationRule<number | string>
  maxLength?: ValidationRule<number>
  minLength?: ValidationRule<number>
  validate?: (value?: string, formValues?: any) => ValidateResult | Promise<ValidateResult>
  value?: FieldPathValue<FieldValues, string>
  setValueAs?: (value?: any) => any
  shouldUnregister?: boolean
  onChange?: (event?: any) => void
  onBlur?: (event?: any) => void
  disabled?: boolean
  deps?: InternalFieldName | InternalFieldName[]
}

export type htmlProps = {
  id?: string
  className?: string
  ref?: Ref<any>
  style?: CSSProperties
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler
  onKeyDown?: KeyboardEventHandler
  onBlur?: FocusEventHandler
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onMouseDown?: MouseEventHandler
  children?: ReactNode
}

/**
 * htmlPropsをマージするユーティリティ関数
 */
export const mergeHtmlProps = (htmlProps: htmlProps, uniqueProps?: Partial<htmlProps>) => {
  const newObject = {...htmlProps}
  // styleだけobjectマージ
  if (uniqueProps?.style) {
    newObject.style = {...uniqueProps.style, ...newObject.style}
  }
  // classNameはtwMerge
  if (uniqueProps?.className) {
    newObject.className = newObject.className ? twMerge(uniqueProps.className, newObject.className) : uniqueProps.className
  }
  // その他は上書き
  if (uniqueProps) {
    Object.keys(uniqueProps).forEach(key => {
      if (key !== 'style' && key !== 'className') {
        newObject[key] = uniqueProps[key]
      }
    })
  }
  return newObject
}
