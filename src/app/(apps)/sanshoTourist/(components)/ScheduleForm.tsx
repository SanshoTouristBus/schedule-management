'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Calendar, Bus, Building, User, Clock, MapPin, Info, Users, Save } from 'lucide-react'
import { StVehicle, StCustomer, StContact } from '@prisma/generated/prisma/client'
import { StScheduleWithRelations } from '../(server-actions)/schedule-actions'
import { getMidnight } from '@cm/class/Days/date-utils/calculations'

// 日付ユーティリティ
// DBからのUTC日付をJST表示用に変換
const toJstForDisplay = (date: Date): Date => {
  const dt = new Date(date)
  dt.setHours(dt.getHours() + 9)
  return dt
}

// フォーム入力(YYYY-MM-DD)からDateオブジェクトを作成（日付のみ、時刻は00:00:00）
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0)
}

// DateをYYYY-MM-DD形式の文字列に変換（JST表示用）
const formatDateForInput = (date: Date): string => {
  const jstDate = toJstForDisplay(date)
  const year = jstDate.getFullYear()
  const month = String(jstDate.getMonth() + 1).padStart(2, '0')
  const day = String(jstDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

type Props = {
  initialData?: Partial<StScheduleWithRelations> | null
  vehicles: StVehicle[]
  customers: (StCustomer & { StContact: StContact[] })[]
  drivers: { id: number; name: string }[]
  onSave: (data: ScheduleFormData) => Promise<void>
  onClose: () => void
  isSystemAdmin: boolean
  isEditor: boolean
  isViewer: boolean
}

export type ScheduleFormData = {
  id?: number
  date: Date
  stVehicleId?: number | null
  stCustomerId?: number | null
  stContactId?: number | null
  organizationName?: string | null
  organizationContact?: string | null
  destination?: string | null
  hasGuide: boolean
  departureTime?: string | null
  returnTime?: string | null
  remarks?: string | null
  driverIds: number[]
}

// フォーム入力コンポーネント
const FormInput = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  required = false,
  icon,
  disabled = false,
}: {
  label: string
  id: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  icon?: React.ReactNode
  disabled?: boolean
}) => (
  <div className="mb-4">
    <label htmlFor={id} className={`block text-sm font-medium mb-1 ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
      {label} {required && <span className="text-red-500">*</span>}
      {disabled && <span className="ml-2 text-xs text-gray-400 font-normal">(閲覧のみ)</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm ${icon ? 'pl-10' : ''} focus:outline-none ${
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
      />
    </div>
  </div>
)

// フォーム選択コンポーネント
const FormSelect = ({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  icon,
  disabled = false,
}: {
  label: string
  id: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string | number; label: string }[]
  required?: boolean
  icon?: React.ReactNode
  disabled?: boolean
}) => (
  <div className="mb-4">
    <label htmlFor={id} className={`block text-sm font-medium mb-1 ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
      {label} {required && <span className="text-red-500">*</span>}
      {disabled && <span className="ml-2 text-xs text-gray-400 font-normal">(閲覧のみ)</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>}
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm ${icon ? 'pl-10' : ''} focus:outline-none appearance-none ${
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
      >
        <option value="">--- 選択してください ---</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
)

// フォームカードコンポーネント
const FormCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm mb-6">
    <div className="flex items-center p-3 border-b border-gray-200 bg-white rounded-t-lg">
      <div className="w-5 h-5 mr-2 text-indigo-600">{icon}</div>
      <h4 className="text-md font-semibold text-gray-800">{title}</h4>
    </div>
    <div className="p-4">{children}</div>
  </div>
)

export const ScheduleForm = ({ initialData, vehicles, customers, drivers, onSave, onClose, isSystemAdmin, isEditor, isViewer }: Props) => {
  // 権限に応じた編集可能フィールドの判定
  // 管理者: 全て編集可能
  // 編集者: 顧客選択、団体名、担当者、行き先、ガイドの有無、備考のみ編集可能
  // 閲覧者: 全て閲覧のみ
  const canEditAll = isSystemAdmin
  const canEditLimited = isEditor && !isSystemAdmin
  const isReadOnly = isViewer && !isSystemAdmin && !isEditor
  const [formData, setFormData] = useState<ScheduleFormData>({
    id: initialData?.id,
    date: initialData?.date ? new Date(initialData.date) : getMidnight(),
    stVehicleId: initialData?.stVehicleId,
    stCustomerId: initialData?.stCustomerId,
    stContactId: initialData?.stContactId,
    organizationName: initialData?.organizationName || '',
    organizationContact: initialData?.organizationContact || '',
    destination: initialData?.destination || '',
    hasGuide: initialData?.hasGuide || false,
    departureTime: initialData?.departureTime || '08:00',
    returnTime: initialData?.returnTime || '17:00',
    remarks: initialData?.remarks || '',
    driverIds: initialData?.StScheduleDriver?.map(sd => sd.userId) || [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 選択した会社の担当者リスト
  const availableContacts = useMemo(() => {
    if (!formData.stCustomerId) return []
    const customer = customers.find(c => c.id === formData.stCustomerId)
    return customer?.StContact || []
  }, [formData.stCustomerId, customers])

  // 会社変更時に担当者をリセット
  useEffect(() => {
    if (formData.stContactId && !availableContacts.find(c => c.id === formData.stContactId)) {
      setFormData(prev => ({ ...prev, stContactId: undefined }))
    }
  }, [formData.stContactId, availableContacts])

  // 会社選択時に団体名を自動入力
  useEffect(() => {
    if (formData.stCustomerId) {
      const customer = customers.find(c => c.id === formData.stCustomerId)
      if (customer && !formData.organizationName) {
        setFormData(prev => ({ ...prev, organizationName: customer.name }))
      }
    }
  }, [formData.stCustomerId, customers])

  // 担当者選択時に担当者名を自動入力
  useEffect(() => {
    if (formData.stContactId) {
      const contact = availableContacts.find(c => c.id === formData.stContactId)
      if (contact && !formData.organizationContact) {
        setFormData(prev => ({ ...prev, organizationContact: contact.name }))
      }
    }
  }, [formData.stContactId, availableContacts])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // フォーム入力からローカル日付を作成（Server Actions側でUTCに変換される）
    setFormData(prev => ({ ...prev, date: parseLocalDate(e.target.value) }))
  }

  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = e.target
    const selectedDriverIds: number[] = []
    for (const option of options) {
      if (option.selected) {
        selectedDriverIds.push(parseInt(option.value))
      }
    }
    setFormData(prev => ({ ...prev, driverIds: selectedDriverIds }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormCard title="基本情報" icon={<Calendar className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormInput
            label="運行日"
            id="date"
            type="date"
            value={formatDateForInput(formData.date)}
            onChange={handleDateChange}
            required
            icon={<Calendar className="w-4 h-4" />}
            disabled={!canEditAll}
          />
          <FormSelect
            label="車両"
            id="stVehicleId"
            value={formData.stVehicleId || ''}
            onChange={e => setFormData(prev => ({ ...prev, stVehicleId: parseInt(e.target.value) || undefined }))}
            options={vehicles.map(v => ({ value: v.id, label: `${v.plateNumber} (${v.type})` }))}
            required
            icon={<Bus className="w-4 h-4" />}
            disabled={!canEditAll}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormInput
            label="出庫時間"
            id="departureTime"
            type="time"
            value={formData.departureTime || ''}
            onChange={handleChange}
            required
            icon={<Clock className="w-4 h-4" />}
            disabled={!canEditAll}
          />
          <FormInput
            label="帰庫時間"
            id="returnTime"
            type="time"
            value={formData.returnTime || ''}
            onChange={handleChange}
            required
            icon={<Clock className="w-4 h-4" />}
            disabled={!canEditAll}
          />
        </div>
      </FormCard>

      <FormCard title="顧客・担当者情報" icon={<Building className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormSelect
            label="顧客 (会社)"
            id="stCustomerId"
            value={formData.stCustomerId || ''}
            onChange={e => setFormData(prev => ({ ...prev, stCustomerId: parseInt(e.target.value) || undefined }))}
            options={customers.map(c => ({ value: c.id, label: c.name }))}
            icon={<Building className="w-4 h-4" />}
            disabled={!canEditAll && !canEditLimited}
          />
          <FormSelect
            label="顧客 (担当者)"
            id="stContactId"
            value={formData.stContactId || ''}
            onChange={e => setFormData(prev => ({ ...prev, stContactId: parseInt(e.target.value) || undefined }))}
            options={availableContacts.map(c => ({ value: c.id, label: c.name }))}
            disabled={!formData.stCustomerId || (!canEditAll && !canEditLimited)}
            icon={<User className="w-4 h-4" />}
          />
        </div>
        <p className="text-xs text-gray-500 mb-4 -mt-2">(顧客マスタから選ぶと、団体名・担当者名が自動入力されます)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormInput
            label="団体名 (手入力)"
            id="organizationName"
            value={formData.organizationName || ''}
            onChange={handleChange}
            required
            icon={<Users className="w-4 h-4" />}
            disabled={!canEditAll && !canEditLimited}
          />
          <FormInput
            label="担当者名 (手入力)"
            id="organizationContact"
            value={formData.organizationContact || ''}
            onChange={handleChange}
            icon={<User className="w-4 h-4" />}
            disabled={!canEditAll && !canEditLimited}
          />
        </div>
      </FormCard>

      <FormCard title="運行詳細" icon={<Info className="w-5 h-5" />}>
        <FormInput
          label="行き先 (手入力)"
          id="destination"
          value={formData.destination || ''}
          onChange={handleChange}
          required
          icon={<MapPin className="w-4 h-4" />}
          disabled={!canEditAll && !canEditLimited}
        />

        <div className="mb-4">
          <label htmlFor="driverIds" className={`block text-sm font-medium mb-1 ${!canEditAll ? 'text-gray-500' : 'text-gray-700'}`}>
            乗務員 <span className="text-red-500">*</span>
            {!canEditAll && <span className="ml-2 text-xs text-gray-400 font-normal">(閲覧のみ)</span>}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Users className="w-4 h-4" />
            </div>
            <select
              id="driverIds"
              name="driverIds"
              multiple
              value={formData.driverIds.map(String)}
              onChange={handleDriverChange}
              required
              disabled={!canEditAll}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm pl-10 focus:outline-none h-24 ${
                !canEditAll
                  ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                  : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            >
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">(複数選択可: Ctrl/Cmdキーを押しながらクリック)</p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <input
            id="hasGuide"
            name="hasGuide"
            type="checkbox"
            checked={formData.hasGuide}
            onChange={handleChange}
            disabled={!canEditAll && !canEditLimited}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label htmlFor="hasGuide" className={`ml-2 block text-sm ${!canEditAll && !canEditLimited ? 'text-gray-500' : 'text-gray-700'}`}>
            ガイドの有無
            {!canEditAll && !canEditLimited && <span className="ml-2 text-xs text-gray-400 font-normal">(閲覧のみ)</span>}
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="remarks" className={`block text-sm font-medium mb-1 ${!canEditAll && !canEditLimited ? 'text-gray-500' : 'text-gray-700'}`}>
            備考
            {!canEditAll && !canEditLimited && <span className="ml-2 text-xs text-gray-400 font-normal">(閲覧のみ)</span>}
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks || ''}
            onChange={handleChange}
            rows={3}
            disabled={!canEditAll && !canEditLimited}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
              !canEditAll && !canEditLimited
                ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
        </div>
      </FormCard>

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
          キャンセル
        </button>
        {!isReadOnly && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        )}
      </div>
    </form>
  )
}
