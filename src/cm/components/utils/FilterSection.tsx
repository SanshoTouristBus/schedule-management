'use client'

import React, {useState} from 'react'
import {Search, Filter, X} from 'lucide-react'
import {Button} from '@cm/shadcn/ui/button'
import {Card} from '@cm/shadcn/ui/card'

type FilterSectionProps = {
  children: React.ReactNode
  onApply: () => void
  onClear: () => void
  title?: string
  showAdvancedToggle?: boolean
  advancedFiltersOpen?: boolean
  onAdvancedToggle?: () => void
  advancedFilters?: React.ReactNode
}

/**
 * 検索・フィルター用の共通コンポーネント
 * 確定ボタンを押したときにのみフィルターが適用されます
 */
export const FilterSection: React.FC<FilterSectionProps> = ({
  children,
  onApply,
  onClear,
  title = 'フィルター',
  showAdvancedToggle = false,
  advancedFiltersOpen = false,
  onAdvancedToggle,
  advancedFilters,
}) => {
  return (
    <Card className={`relative`}>
      <div className="flex items-center justify-between ">
        {showAdvancedToggle && onAdvancedToggle && (
          <button onClick={onAdvancedToggle} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
            <Filter size={16} className="mr-1" />
            {advancedFiltersOpen ? '詳細フィルターを閉じる' : '詳細フィルター'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* 基本フィルター */}
        <div>{children}</div>

        {/* 詳細フィルター */}
        {showAdvancedToggle && advancedFiltersOpen && <div className="pt-4 border-t border-gray-200">{advancedFilters}</div>}

        {/* ボタン */}
        <div className={`flex justify-end `}>
          <div className=" space-x-3 ">
            <Button
              variant="outline"
              onClick={onClear}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              <X size={16} className="mr-2" />
              クリア
            </Button>
            <Button onClick={onApply} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
              <Search size={16} className="mr-2" />
              検索
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * フィルターフォームの状態を管理するためのフック
 */
export function useFilterForm<T extends Record<string, any>>(initialValues: T) {
  // フォームの現在の値
  const [formValues, setFormValues] = useState<T>(initialValues)

  // フォームの値をリセット
  const resetForm = () => {
    setFormValues(initialValues)
  }

  // フォームの値を更新
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value, type} = e.target

    // チェックボックスの場合はチェック状態を、それ以外は値を設定
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value === '' ? undefined : value

    setFormValues(prev => ({
      ...prev,
      [name]: newValue,
    }))
  }

  return {
    formValues,
    setFormValues,
    resetForm,
    handleInputChange,
  }
}
