'use client'

import React, { useState, useMemo } from 'react'
import { Bus, Building, UserCheck, Flag, Edit2, Trash2, Save, User, Package } from 'lucide-react'
import { StVehicle, StCustomer, StContact, StHoliday } from '@prisma/generated/prisma/client'
import useSWR from 'swr'

import useModal from '@cm/components/utils/modal/useModal'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'

import { upsertStVehicle, deleteStVehicle, getStVehicles } from '../../(server-actions)/vehicle-actions'
import { upsertStCustomer, deleteStCustomer, upsertStContact, deleteStContact, getStCustomers } from '../../(server-actions)/customer-actions'
import { upsertStHoliday, deleteStHoliday, getStHolidays } from '../../(server-actions)/holiday-actions'
import AutoGridContainer from '@cm/components/utils/AutoGridContainer'

// ========== 日付ユーティリティ ==========

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
const formatDateJst = (date: Date): string => {
  const jstDate = toJstForDisplay(date)
  const year = jstDate.getFullYear()
  const month = String(jstDate.getMonth() + 1).padStart(2, '0')
  const day = String(jstDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ========== 型定義 ==========

type CustomerWithContacts = StCustomer & { StContact: StContact[] }

type Props = {
  vehicles: StVehicle[]
  customers: CustomerWithContacts[]
  holidays: StHoliday[]
  canEdit: boolean
}

type VehicleFormData = {
  id?: number
  plateNumber: string
  type?: string | null
  seats: number
  subSeats: number
  phone?: string | null
  sortOrder?: number
}

type CustomerFormData = {
  id?: number
  name: string
  sortOrder?: number
}

type ContactFormData = {
  id?: number
  stCustomerId: number
  name: string
  phone?: string | null
  sortOrder?: number
}

type HolidayFormData = {
  id?: number
  date: string
  name: string
}

// ========== 共通コンポーネント ==========

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 text-gray-500">
    <Package className="w-12 h-12 mx-auto mb-2" />
    <p>{message}</p>
  </div>
)

const FormInput = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  placeholder = '',
}: {
  label: string
  id: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${disabled ? 'bg-gray-100' : ''}`}
    />
  </div>
)

const FormSelect = ({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string
  id: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string | number; label: string }[]
  required?: boolean
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
    >
      <option value="">--- 選択してください ---</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)

// ========== 車両マスタ ==========

const VehicleMaster = ({
  vehicles,
  onEdit,
  onDelete,
  canEdit,
}: {
  vehicles: StVehicle[]
  onEdit: (vehicle: StVehicle) => void
  onDelete: (id: number) => void
  canEdit: boolean
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">車両マスタ</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">プレートNo.</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">車種</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">座席数</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">車両携帯</th>
              {canEdit && <th className="p-3 text-center text-sm font-semibold text-gray-600">操作</th>}
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 5 : 4}>
                  <EmptyState message="車両データがありません。" />
                </td>
              </tr>
            ) : (
              vehicles.map(v => (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-800">{v.plateNumber}</td>
                  <td className="p-3 text-sm text-gray-700">{v.type || '-'}</td>
                  <td className="p-3 text-sm text-gray-700">
                    正 {v.seats} / 補 {v.subSeats}
                  </td>
                  <td className="p-3 text-sm text-gray-700">{v.phone || '-'}</td>
                  {canEdit && (
                    <td className="p-3 text-center">
                      <button onClick={() => onEdit(v)} className="p-1 text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(v.id)} className="p-1 text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const VehicleForm = ({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Partial<StVehicle> | null
  onSave: (data: VehicleFormData) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    id: initialData?.id,
    plateNumber: initialData?.plateNumber || '',
    type: initialData?.type || '大型',
    seats: initialData?.seats || 45,
    subSeats: initialData?.subSeats || 0,
    phone: initialData?.phone || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="プレートNo."
        id="plateNumber"
        value={formData.plateNumber}
        onChange={handleChange}
        required
        placeholder="例: 湘南230あ3409"
      />
      <FormSelect
        label="車種"
        id="type"
        value={formData.type || ''}
        onChange={handleChange}
        options={[
          { value: '大型', label: '大型' },
          { value: '中型', label: '中型' },
          { value: '小型', label: '小型' },
          { value: 'マイクロ', label: 'マイクロ' },
        ]}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="正席数" id="seats" type="number" value={formData.seats} onChange={handleChange} required />
        <FormInput label="補助席数" id="subSeats" type="number" value={formData.subSeats} onChange={handleChange} />
      </div>
      <FormInput label="車両携帯番号" id="phone" value={formData.phone || ''} onChange={handleChange} placeholder="例: 090-1234-5678" />
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
          キャンセル
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
          <Save className="w-4 h-4 mr-2" />
          保存
        </button>
      </div>
    </form>
  )
}

// ========== 会社・担当者マスタ ==========

const CustomerMaster = ({
  customers,
  onEditCustomer,
  onDeleteCustomer,
  onEditContact,
  onDeleteContact,
  canEdit,
}: {
  customers: CustomerWithContacts[]
  onEditCustomer: (customer: StCustomer) => void
  onDeleteCustomer: (id: number) => void
  onEditContact: (contact: StContact) => void
  onDeleteContact: (id: number) => void
  canEdit: boolean
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">会社・担当者マスタ</h3>
      <div className="grid grid-cols-2 gap-4">
        {customers.length === 0 ? (
          <EmptyState message="会社データがありません。" />
        ) : (
          customers.map(c => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-t-lg">
                <span className="font-semibold text-gray-800 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-gray-600" />
                  {c.name}
                </span>
                {canEdit && (
                  <div>
                    <button onClick={() => onEditCustomer(c)} className="p-1 text-blue-600 hover:text-blue-800">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteCustomer(c.id)} className="p-1 text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-3">
                {c.StContact.length === 0 ? (
                  <div className="text-sm text-gray-500 px-3 py-2">担当者が登録されていません。</div>
                ) : (
                  <table className="min-w-full">
                    <tbody>
                      {c.StContact.map(con => (
                        <tr key={con.id} className="border-b last:border-b-0">
                          <td className="p-2 text-sm text-gray-700 flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            {con.name}
                          </td>
                          <td className="p-2 text-sm text-gray-600">{con.phone || '-'}</td>
                          {canEdit && (
                            <td className="p-2 text-right">
                              <button onClick={() => onEditContact(con)} className="p-1 text-blue-600 hover:text-blue-800">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => onDeleteContact(con.id)} className="p-1 text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const CustomerForm = ({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Partial<StCustomer> | null
  onSave: (data: CustomerFormData) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    id: initialData?.id,
    name: initialData?.name || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="会社名"
        id="name"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="例: 株式会社A観光"
      />
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
          キャンセル
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
          <Save className="w-4 h-4 mr-2" />
          保存
        </button>
      </div>
    </form>
  )
}

const ContactForm = ({
  initialData,
  customers,
  onSave,
  onCancel,
}: {
  initialData?: Partial<StContact> | null
  customers: CustomerWithContacts[]
  onSave: (data: ContactFormData) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    id: initialData?.id,
    stCustomerId: initialData?.stCustomerId || 0,
    name: initialData?.name || '',
    phone: initialData?.phone || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'stCustomerId' ? parseInt(value) || 0 : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.stCustomerId) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormSelect
        label="会社"
        id="stCustomerId"
        value={formData.stCustomerId || ''}
        onChange={handleChange}
        options={customers.map(c => ({ value: c.id, label: c.name }))}
        required
      />
      <FormInput label="担当者名" id="name" value={formData.name} onChange={handleChange} required placeholder="例: 山田太郎" />
      <FormInput label="担当者 携帯番号" id="phone" value={formData.phone || ''} onChange={handleChange} placeholder="例: 03-1234-5678" />
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
          キャンセル
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
          <Save className="w-4 h-4 mr-2" />
          保存
        </button>
      </div>
    </form>
  )
}

// ========== 祝日マスタ ==========

const HolidayMaster = ({
  holidays,
  onEdit,
  onDelete,
  canEdit,
}: {
  holidays: StHoliday[]
  onEdit: (holiday: StHoliday) => void
  onDelete: (id: number) => void
  canEdit: boolean
}) => {
  const sortedHolidays = useMemo(() => {
    return [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [holidays])

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">祝日マスタ</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">日付 (YYYY-MM-DD)</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">祝日名</th>
              {canEdit && <th className="p-3 text-center text-sm font-semibold text-gray-600">操作</th>}
            </tr>
          </thead>
          <tbody>
            {sortedHolidays.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 3 : 2}>
                  <EmptyState message="祝日データがありません。" />
                </td>
              </tr>
            ) : (
              sortedHolidays.map(h => (
                <tr key={h.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-800">{formatDateJst(h.date)}</td>
                  <td className="p-3 text-sm text-gray-700">{h.name}</td>
                  {canEdit && (
                    <td className="p-3 text-center">
                      <button onClick={() => onEdit(h)} className="p-1 text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(h.id)} className="p-1 text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const HolidayForm = ({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Partial<StHoliday> | null
  onSave: (data: HolidayFormData) => void
  onCancel: () => void
}) => {
  // DBのUTC日付をJSTで表示
  const formatDateForInput = (date?: Date | null): string => {
    if (!date) {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    return formatDateJst(date)
  }

  const [formData, setFormData] = useState<HolidayFormData>({
    id: initialData?.id,
    date: formatDateForInput(initialData?.date),
    name: initialData?.name || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.date) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="日付"
        id="date"
        type="date"
        value={formData.date}
        onChange={e => setFormData({ ...formData, date: e.target.value })}
        disabled={!!initialData?.id}
        required
      />
      <FormInput
        label="祝日名"
        id="name"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="例: 元日"
      />
      {!!initialData?.id && <p className="text-xs text-gray-500 -mt-2 mb-4">祝日データの日付は変更できません。</p>}
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
          キャンセル
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
          <Save className="w-4 h-4 mr-2" />
          保存
        </button>
      </div>
    </form>
  )
}

// ========== メインコンポーネント ==========

export const MasterCC = ({ vehicles: initialVehicles, customers: initialCustomers, holidays: initialHolidays, canEdit }: Props) => {
  const { toggleLoad } = useGlobal()

  // データ取得 (SWR)
  const { data: vehiclesData, mutate: mutateVehicles } = useSWR('stVehicles', async () => getStVehicles(), {
    fallbackData: initialVehicles,
  })

  const { data: customersData, mutate: mutateCustomers } = useSWR('stCustomers', async () => getStCustomers({ includeContacts: true }), {
    fallbackData: initialCustomers,
  })

  const { data: holidaysData, mutate: mutateHolidays } = useSWR('stHolidays', async () => getStHolidays(), {
    fallbackData: initialHolidays,
  })

  const vehicles = vehiclesData || []
  const customers = (customersData || []) as CustomerWithContacts[]
  const holidays = holidaysData || []

  // モーダル状態管理
  const [modalContent, setModalContent] = useState<{
    title: string
    content: React.ReactNode
  } | null>(null)

  const closeModal = () => setModalContent(null)

  // モーダルを開く共通関数
  const openModal = (type: string, data?: unknown) => {
    if (type === 'vehicle') {
      setModalContent({
        title: data ? '車両の編集' : '車両の追加',
        content: (
          <VehicleForm
            initialData={data as Partial<StVehicle>}
            onSave={async item => {
              await toggleLoad(async () => {
                await upsertStVehicle(item)
                await mutateVehicles()
              })
              closeModal()
            }}
            onCancel={closeModal}
          />
        ),
      })
    } else if (type === 'customer') {
      setModalContent({
        title: data ? '会社の編集' : '会社の追加',
        content: (
          <CustomerForm
            initialData={data as Partial<StCustomer>}
            onSave={async item => {
              await toggleLoad(async () => {
                await upsertStCustomer(item)
                await mutateCustomers()
              })
              closeModal()
            }}
            onCancel={closeModal}
          />
        ),
      })
    } else if (type === 'contact') {
      setModalContent({
        title: data ? '担当者の編集' : '担当者の追加',
        content: (
          <ContactForm
            initialData={data as Partial<StContact>}
            customers={customers}
            onSave={async item => {
              await toggleLoad(async () => {
                await upsertStContact(item)
                await mutateCustomers()
              })
              closeModal()
            }}
            onCancel={closeModal}
          />
        ),
      })
    } else if (type === 'holiday') {
      setModalContent({
        title: data ? '祝日の編集' : '祝日の追加',
        content: (
          <HolidayForm
            initialData={data as Partial<StHoliday>}
            onSave={async item => {
              await toggleLoad(async () => {
                await upsertStHoliday({
                  id: item.id,
                  date: new Date(item.date),
                  name: item.name,
                })
                await mutateHolidays()
              })
              closeModal()
            }}
            onCancel={closeModal}
          />
        ),
      })
    }
  }

  // 削除ハンドラー
  const handleDeleteVehicle = async (id: number) => {
    if (!window.confirm('この車両を削除しますか？')) return
    await toggleLoad(async () => {
      await deleteStVehicle(id)
      await mutateVehicles()
    })
  }

  const handleDeleteCustomer = async (id: number) => {
    if (!window.confirm('この会社を削除しますか？関連する担当者も削除されます。')) return
    await toggleLoad(async () => {
      await deleteStCustomer(id)
      await mutateCustomers()
    })
  }

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('この担当者を削除しますか？')) return
    await toggleLoad(async () => {
      await deleteStContact(id)
      await mutateCustomers()
    })
  }

  const handleDeleteHoliday = async (id: number) => {
    if (!window.confirm('この祝日を削除しますか？')) return
    await toggleLoad(async () => {
      await deleteStHoliday(id)
      await mutateHolidays()
    })
  }

  // useModalフック
  const ModalReturn = useModal<boolean>()

  // モーダルが開かれたらuseModalも開く
  React.useEffect(() => {
    if (modalContent) {
      ModalReturn.handleOpen(true)
    }
  }, [modalContent])

  // useModalが閉じられたらmodalContentもクリア
  React.useEffect(() => {
    if (!ModalReturn.open) {
      setModalContent(null)
    }
  }, [ModalReturn.open])

  return (
    <div className="space-y-8">
      {/* 追加ボタン群（編集権限がある場合のみ表示） */}
      {canEdit ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => openModal('vehicle')}
            className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
          >
            <Bus className="w-5 h-5 mr-2 text-indigo-600" /> 車両を追加
          </button>
          <button
            onClick={() => openModal('customer')}
            className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
          >
            <Building className="w-5 h-5 mr-2 text-indigo-600" /> 会社を追加
          </button>
          <button
            onClick={() => openModal('contact')}
            className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
          >
            <UserCheck className="w-5 h-5 mr-2 text-indigo-600" /> 担当者を追加
          </button>
          <button
            onClick={() => openModal('holiday')}
            className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
          >
            <Flag className="w-5 h-5 mr-2 text-indigo-600" /> 祝日を追加
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
          閲覧モード - マスタデータの編集には編集権限が必要です
        </div>
      )}

      <AutoGridContainer className={`gap-20`}>
        {/* 車両マスタ */}
        <VehicleMaster vehicles={vehicles} onEdit={v => openModal('vehicle', v)} onDelete={handleDeleteVehicle} canEdit={canEdit} />

        {/* 会社・担当者マスタ */}
        <CustomerMaster
          customers={customers}
          onEditCustomer={c => openModal('customer', c)}
          onDeleteCustomer={handleDeleteCustomer}
          onEditContact={c => openModal('contact', c)}
          onDeleteContact={handleDeleteContact}
          canEdit={canEdit}
        />

        {/* 祝日マスタ */}
        <HolidayMaster holidays={holidays} onEdit={h => openModal('holiday', h)} onDelete={handleDeleteHoliday} canEdit={canEdit} />

        {/* モーダル */}
        <ModalReturn.Modal>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{modalContent?.title}</h2>
            {modalContent?.content}
          </div>
        </ModalReturn.Modal>
      </AutoGridContainer>
    </div>
  )
}
