// 'use client'

// import React, {useState, useMemo, useEffect, useCallback, createContext, useContext} from 'react'
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Trash2,
//   Users,
//   Bus,
//   User,
//   Building,
//   Briefcase,
//   Flag,
//   FileText,
//   Loader2,
//   AlertTriangle,
//   Search,
//   Settings,
//   Menu,
//   X,
//   Printer,
//   Edit2,
//   Save,
//   Check,
//   Package,
//   Clock,
//   MapPin,
//   Info,
//   Paperclip,
//   Upload,
//   UserCheck,
//   CalendarDays,
//   List,
//   Copy,
//   Users2,
//   Archive,
//   AlertCircle,
//   XCircle,
// } from 'lucide-react'

// /*
// <aside>
// 💡
// 「こちらはモックであり、単一ファイルに収まるよう構築されています。このページは最終的に削除するため、本番プロジェクトでは、プロジェクトの設計やルールに従ってページやコンポーネントを分割してください」。
// </aside>
// */

// // --- 型定義 (JSDoc) ---

// /**
//  * @typedef {Object} Vehicle
//  * @property {string} id - 一意のID
//  * @property {string} plateNumber - プレートNo. (例: 湘南230あ3409)
//  * @property {string} type - 車種 (例: 大型, 中型, マイクロ)
//  * @property {number} seats - 正席数
//  * @property {number} subSeats - 補助席数
//  * @property {string} phone - 車両携帯番号
//  */

// /**
//  * @typedef {Object} User
//  * @property {string} id - 一意のID
//  * @property {string} name - 氏名
//  * @property {string} email - メールアドレス
//  * @property {string} phone - 社用携帯番号
//  * @property {string} employeeNumber - 乗務員番号 (ログインID)
//  * @property {string} password - パスワード (モック)
//  * @property {'admin' | 'editor' | 'viewer'} role - 権限
//  * @property {boolean} isDriver - 乗務員フラグ (trueなら乗務員)
//  */

// /**
//  * @typedef {Object} Customer
//  * @property {string} id - 一意のID
//  * @property {string} name - 会社名
//  */

// /**
//  * @typedef {Object} CustomerContact
//  * @property {string} id - 一意のID
//  * @property {string} customerId - 紐づく会社ID
//  * @property {string} name - 担当者名
//  * @property {string} phone - 担当者電話番号
//  */

// /**
//  * @typedef {Object} Holiday
//  * @property {string} date - 日付 (YYYY-MM-DD)
//  * @property {string} name - 祝日名
//  */

// /**
//  * @typedef {Object} Schedule
//  * @property {string} id - 一意のID
//  * @property {string} date - 運行日 (YYYY-MM-DD)
//  * @property {string} vehicleId - 車両ID
//  * @property {string[]} driverIds - 乗務員ID (ユーザーID) の配列
//  * @property {string} customerId - 顧客ID
//  * @property {string} contactId - 担当者ID
//  * @property {string} organizationName - 団体名 (手入力)
//  * @property {string} organizationContact - 担当者名 (手入力)
//  * @property {string} destination - 行き先 (手入力)
//  * @property {boolean} hasGuide - ガイドの有無 (手入力)
//  * @property {string} departureTime - 出庫時間 (HH:mm)
//  * @property {string} returnTime - 帰庫時間 (HH:mm)
//  * @property {string} remarks - 備考 (手入力)
//  * @property {string | null} pdfFile - 添付ファイル (運行指示書)
//  */

// /**
//  * @typedef {Object} RollCaller
//  * @property {string} date - 日付 (YYYY-MM-DD)
//  * @property {string} userId - ユーザーID (User.id)
//  */

// // --- サンプルデータ (要件 1.6 / 2.) ---
// // 基準日を「現在」に設定 (2025年11月7日)
// const BASE_DATE = new Date('2025-11-07T12:00:00+09:00')

// /** @type {Vehicle[]} */
// const MOCK_VEHICLES = [
//   {
//     id: 'v1',
//     plateNumber: '湘南230あ3409',
//     type: '大型',
//     seats: 45,
//     subSeats: 0,
//     phone: '090-5579-5321',
//   },
//   {
//     id: 'v2',
//     plateNumber: '湘南230あ3410',
//     type: '大型',
//     seats: 49,
//     subSeats: 11,
//     phone: '090-1234-5678',
//   },
//   {
//     id: 'v3',
//     plateNumber: '湘南230あ3407',
//     type: '中型',
//     seats: 27,
//     subSeats: 0,
//     phone: '090-5579-5328',
//   },
//   {
//     id: 'v4',
//     plateNumber: '湘南230あ3405',
//     type: 'マイクロ',
//     seats: 21,
//     subSeats: 6,
//     phone: 'なし',
//   },
//   {
//     id: 'v5',
//     plateNumber: '湘南230あ3408',
//     type: 'マイクロ',
//     seats: 21,
//     subSeats: 6,
//     phone: '090-5579-5304',
//   },
// ]

// /** @type {User[]} (乗務員マスタと統合) */
// const MOCK_USERS = [
//   {
//     id: 'u1',
//     name: '佐藤 太郎',
//     email: 'sato@example.com',
//     phone: '090-1111-1111',
//     employeeNumber: '1001',
//     password: 'password',
//     role: 'admin',
//     isDriver: true,
//   },
//   {
//     id: 'u2',
//     name: '鈴木 一郎',
//     email: 'suzuki@example.com',
//     phone: '090-2222-2222',
//     employeeNumber: '1002',
//     password: 'password',
//     role: 'editor',
//     isDriver: true,
//   },
//   {
//     id: 'u3',
//     name: '高橋 三郎',
//     email: 'takahashi@example.com',
//     phone: '090-3333-3333',
//     employeeNumber: '1003',
//     password: 'password',
//     role: 'viewer',
//     isDriver: true,
//   },
//   {
//     id: 'u4',
//     name: '田中 次郎',
//     email: 'tanaka@example.com',
//     phone: '090-4444-4444',
//     employeeNumber: '1004',
//     password: 'password',
//     role: 'admin',
//     isDriver: false,
//   }, // 事務員 (乗務員ではない)
//   {
//     id: 'u5',
//     name: '渡辺 五郎',
//     email: 'watanabe@example.com',
//     phone: '090-5555-5555',
//     employeeNumber: '1005',
//     password: 'password',
//     role: 'editor',
//     isDriver: true,
//   },
// ]

// /** @type {Customer[]} */
// const MOCK_CUSTOMERS = [
//   {
//     id: 'c1',
//     name: '株式会社A観光',
//   },
//   {
//     id: 'c2',
//     name: 'B旅行株式会社',
//   },
//   {
//     id: 'c3',
//     name: '学校法人C学園',
//   },
// ]

// /** @type {CustomerContact[]} */
// const MOCK_CONTACTS = [
//   {
//     id: 'cc1',
//     customerId: 'c1',
//     name: 'A観光 担当1',
//     phone: '03-1111-1111',
//   },
//   {
//     id: 'cc2',
//     customerId: 'c1',
//     name: 'A観光 担当2',
//     phone: '03-1111-1112',
//   },
//   {
//     id: 'cc3',
//     customerId: 'c2',
//     name: 'B旅行 担当A',
//     phone: '03-2222-2222',
//   },
//   {
//     id: 'cc4',
//     customerId: 'c3',
//     name: 'C学園 事務',
//     phone: '046-333-3333',
//   },
// ]

// /** @type {Holiday[]} */
// const MOCK_HOLIDAYS = [
//   {
//     date: '2025-01-01',
//     name: '元日',
//   },
//   {
//     date: '2025-11-03',
//     name: '文化の日',
//   },
//   {
//     date: '2025-11-23',
//     name: '勤労感謝の日',
//   },
//   {
//     date: '2025-11-24',
//     name: '振替休日',
//   },
// ]

// /**
//  * 基準日 (BASE_DATE) を中心とした日付文字列を生成
//  * @param {number} daysOffset - 基準日からのオフセット日数
//  * @returns {string} 'YYYY-MM-DD' 形式の文字列
//  */
// const getDateStr = daysOffset => {
//   const date = new Date(BASE_DATE)
//   date.setDate(date.getDate() + daysOffset)
//   return date.toISOString().split('T')[0]
// }

// /** @type {Schedule[]} */
// const MOCK_SCHEDULES = [
//   {
//     id: 's1',
//     date: getDateStr(0),
//     vehicleId: 'v1',
//     driverIds: ['u1', 'u3'],
//     customerId: 'c1',
//     contactId: 'cc1',
//     organizationName: 'A観光 箱根ツアー',
//     organizationContact: 'A観光 担当1',
//     destination: '箱根',
//     hasGuide: true,
//     departureTime: '08:00',
//     returnTime: '18:00',
//     remarks: '備考欄です。',
//     pdfFile: null,
//   },
//   {
//     id: 's2',
//     date: getDateStr(0),
//     vehicleId: 'v3',
//     driverIds: ['u2'],
//     customerId: 'c3',
//     contactId: 'cc4',
//     organizationName: 'C学園 遠足',
//     organizationContact: 'C学園 事務',
//     destination: '江ノ島',
//     hasGuide: false,
//     departureTime: '09:00',
//     returnTime: '16:00',
//     remarks: '',
//     pdfFile: '指示書_C学園.pdf',
//   },
//   {
//     id: 's3',
//     date: getDateStr(2),
//     vehicleId: 'v1',
//     driverIds: ['u1'],
//     customerId: 'c2',
//     contactId: 'cc3',
//     organizationName: 'B旅行 空港送迎',
//     organizationContact: 'B旅行 担当A',
//     destination: '羽田空港',
//     hasGuide: false,
//     departureTime: '06:00',
//     returnTime: '10:00',
//     remarks: '早朝手当',
//     pdfFile: null,
//   },
//   {
//     id: 's4',
//     date: getDateStr(5),
//     vehicleId: 'v5',
//     driverIds: ['u5'],
//     customerId: 'c1',
//     contactId: 'cc2',
//     organizationName: 'A観光 グループA',
//     organizationContact: 'A観光 担当2',
//     destination: '鎌倉',
//     hasGuide: true,
//     departureTime: '10:00',
//     returnTime: '17:00',
//     remarks: '',
//     pdfFile: null,
//   },
//   {
//     id: 's5',
//     date: getDateStr(12),
//     vehicleId: 'v5',
//     driverIds: ['u5'],
//     customerId: 'c1',
//     contactId: 'cc2',
//     organizationName: 'A観光 グループA',
//     organizationContact: 'A観光 担当2',
//     destination: '鎌倉',
//     hasGuide: true,
//     departureTime: '10:00',
//     returnTime: '17:00',
//     remarks: '',
//     pdfFile: null,
//   },
// ]

// /** @type {RollCaller[]} */
// const MOCK_ROLL_CALLERS = [
//   {date: getDateStr(0), userId: 'u1'},
//   {date: getDateStr(1), userId: 'u2'},
// ]

// /** ログイン中のユーザーID (モック) */
// const MOCK_LOGGED_IN_USER_ID = 'u1' // 佐藤 太郎 (乗務員)

// // --- グローバル状態管理 (Context) ---

// /**
//  * @typedef {Object} DataContextType
//  * @property {Vehicle[]} vehicles
//  * @property {User[]} users
//  * @property {User[]} drivers - usersからisDriver:trueでフィルタリングされた配列
//  * @property {Customer[]} customers
//  * @property {CustomerContact[]} contacts
//  * @property {Holiday[]} holidays
//  * @property {Schedule[]} schedules
//  * @property {RollCaller[]} rollCallers
//  * @property {boolean} isLoading
//  * @property {string | null} error
//  * @property {Function} addOrUpdateItem - (type, item) => void
//  * @property {Function} deleteItem - (type, id) => void
//  * @property {Function} addItems - (type, items) => void
//  * @property {Function} updateRollCaller - (date, userId) => void
//  */

// // @ts-ignore
// const DataContext = createContext(null)

// /**
//  * モックデータとCRUD操作を提供するプロバイダ
//  * @param {{children: React.ReactNode}} props
//  */
// const DataProvider = ({children}) => {
//   const [vehicles, setVehicles] = useState([])
//   const [users, setUsers] = useState([])
//   const [customers, setCustomers] = useState([])
//   const [contacts, setContacts] = useState([])
//   const [holidays, setHolidays] = useState([])
//   const [schedules, setSchedules] = useState([])
//   const [rollCallers, setRollCallers] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // 初期データ読み込み (モック)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       try {
//         setVehicles(MOCK_VEHICLES)
//         setUsers(MOCK_USERS)
//         setCustomers(MOCK_CUSTOMERS)
//         setContacts(MOCK_CONTACTS)
//         setHolidays(MOCK_HOLIDAYS)
//         setSchedules(MOCK_SCHEDULES)
//         setRollCallers(MOCK_ROLL_CALLERS)
//         setError(null)
//       } catch (e) {
//         // @ts-ignore
//         setError('データの読み込みに失敗しました。')
//         console.error(e)
//       } finally {
//         setIsLoading(false)
//       }
//     }, 500) // 500msのローディング演出
//     return () => clearTimeout(timer)
//   }, [])

//   // 派生データ: 乗務員リスト (isDriver: true のユーザー)
//   const drivers = useMemo(() => users.filter(u => u.isDriver), [users])

//   /**
//    * 汎用的なCRUD操作 (追加/更新)
//    * @param {'vehicles' | 'users' | 'customers' | 'contacts' | 'holidays' | 'schedules'} type
//    * @param {Object} item
//    */
//   const addOrUpdateItem = useCallback((type, item) => {
//     // @ts-ignore
//     const setStateAction = {
//       vehicles: setVehicles,
//       users: setUsers,
//       customers: setCustomers,
//       contacts: setContacts,
//       holidays: setHolidays,
//       schedules: setSchedules,
//     }[type]

//     if (!setStateAction) return

//     // @ts-ignore
//     setStateAction(prevItems => {
//       const existingIndex = prevItems.findIndex(i => i.id === item.id)
//       if (existingIndex > -1) {
//         // 更新
//         const newItems = [...prevItems]
//         newItems[existingIndex] = item
//         return newItems
//       } else {
//         // 追加 (IDがなければランダムIDを付与)
//         // @ts-ignore
//         const newItem = item.id ? item : {...item, id: `${type}-${Date.now()}`}
//         return [...prevItems, newItem]
//       }
//     })
//   }, [])

//   /**
//    * 複数アイテムの一括追加 (コピー機能で使用)
//    */
//   const addItems = useCallback((type, items) => {
//     const setStateAction = {
//       schedules: setSchedules,
//     }[type]

//     if (!setStateAction) return

//     setStateAction(prevItems => [...prevItems, ...items])
//   }, [])

//   /**
//    * 汎用的なCRUD操作 (削除)
//    * @param {'vehicles' | 'users' | 'customers' | 'contacts' | 'holidays' | 'schedules'} type
//    * @param {string} id
//    */
//   const deleteItem = useCallback((type, id) => {
//     // @ts-ignore
//     const setStateAction = {
//       vehicles: setVehicles,
//       users: setUsers,
//       customers: setCustomers,
//       contacts: setContacts,
//       holidays: setHolidays,
//       schedules: setSchedules,
//     }[type]

//     if (!setStateAction) return

//     // @ts-ignore
//     setStateAction(prevItems => prevItems.filter(i => i.id !== id))
//   }, [])

//   /**
//    * 点呼者の更新
//    * @param {string} date YYYY-MM-DD
//    * @param {string} userId
//    */
//   const updateRollCaller = useCallback((date, userId) => {
//     setRollCallers(prev => {
//       const filtered = prev.filter(rc => rc.date !== date)
//       if (userId) {
//         return [...filtered, {date, userId}]
//       }
//       return filtered
//     })
//   }, [])

//   const value = {
//     vehicles,
//     users,
//     drivers, // 派生データをコンテキストで渡す
//     customers,
//     contacts,
//     holidays,
//     schedules,
//     rollCallers,
//     isLoading,
//     error,
//     addOrUpdateItem,
//     addItems,
//     deleteItem,
//     updateRollCaller,
//   }

//   return (
//     // @ts-ignore
//     <DataContext.Provider value={value}>{children}</DataContext.Provider>
//   )
// }

// /**
//  * データコンテキストを使用するカスタムフック
//  * @returns {DataContextType}
//  */
// const useData = () => {
//   const context = useContext(DataContext)
//   if (!context) {
//     throw new Error('useData must be used within a DataProvider')
//   }
//   return context
// }

// // --- ユーティリティコンポーネント ---

// /**
//  * ローディングスピナー
//  */
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-64">
//     <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
//   </div>
// )

// /**
//  * エラーメッセージ
//  * @param {{ message: string }} props
//  */
// const ErrorDisplay = ({message}) => (
//   <div className="flex justify-center items-center h-64">
//     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
//       <AlertTriangle className="w-6 h-6 mr-2" />
//       <span>{message || 'エラーが発生しました。'}</span>
//     </div>
//   </div>
// )

// /**
//  * データが空の場合のメッセージ
//  * @param {{ message: string }} props
//  */
// const EmptyState = ({message}) => (
//   <div className="text-center py-12 text-gray-500">
//     <Package className="w-12 h-12 mx-auto mb-2" />
//     <p>{message || 'データがありません。'}</p>
//   </div>
// )

// /**
//  * モーダルコンポーネント
//  * @param {{
//  * isOpen: boolean;
//  * onClose: () => void;
//  * title: string;
//  * children: React.ReactNode;
//  * size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
//  * }} props
//  */
// const Modal = ({isOpen, onClose, title, children, size = 'md'}) => {
//   if (!isOpen) return null

//   const sizeClasses = {
//     sm: 'max-w-sm',
//     md: 'max-w-md',
//     lg: 'max-w-lg',
//     xl: 'max-w-xl',
//     full: 'max-w-full m-4',
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-12 overflow-y-auto">
//       <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} m-4`}>
//         {/* モーダルヘッダー */}
//         <div className="flex justify-between items-center p-4 border-b">
//           <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//         {/* モーダルボディ */}
//         <div className="p-4 max-h-[75vh] overflow-y-auto">{children}</div>
//       </div>
//     </div>
//   )
// }

// // --- UIコンポーネント (フォーム) ---
// // ... (FormInput, FormSelect, FormToggle, FormTextArea, FormFileUpload, FormCard コンポーネントは変更がないため省略せず記述)

// /**
//  * フォーム入力 (Text, Email, Password, Number, Date, Time)
//  * @param {{
//  * label: string;
//  * id: string;
//  * value: string | number;
//  * onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//  * type?: string;
//  * required?: boolean;
//  * icon?: React.ReactNode;
//  * }} props
//  */
// const FormInput = ({label, id, value, onChange, type = 'text', required = false, icon}) => (
//   <div className="mb-4">
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="relative">
//       {icon && (
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//           {React.cloneElement(icon, {className: 'w-4 h-4'})}
//         </div>
//       )}
//       <input
//         type={type}
//         id={id}
//         name={id}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm ${icon ? 'pl-10' : ''} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
//       />
//     </div>
//   </div>
// )

// /**
//  * フォーム選択 (Select)
//  * @param {{
//  * label: string;
//  * id: string;
//  * value: string;
//  * onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//  * options: { value: string; label: string }[];
//  * required?: boolean;
//  * icon?: React.ReactNode;
//  * }} props
//  */
// const FormSelect = ({label, id, value, onChange, options, required = false, icon}) => (
//   <div className="mb-4">
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="relative">
//       {icon && (
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//           {React.cloneElement(icon, {className: 'w-4 h-4'})}
//         </div>
//       )}
//       <select
//         id={id}
//         name={id}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm ${icon ? 'pl-10' : ''} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none`}
//       >
//         <option value="">--- 選択してください ---</option>
//         {options.map(opt => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
//         <ChevronRight className="w-4 h-4 rotate-90" />
//       </div>
//     </div>
//   </div>
// )

// /**
//  * フォームトグル (Checkbox)
//  * @param {{
//  * label: string;
//  * id: string;
//  * checked: boolean;
//  * onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//  * }} props
//  */
// const FormToggle = ({label, id, checked, onChange}) => (
//   <div className="flex items-center mb-4">
//     <input
//       id={id}
//       name={id}
//       type="checkbox"
//       checked={checked}
//       onChange={onChange}
//       className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//     />
//     <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
//       {label}
//     </label>
//   </div>
// )

// /**
//  * フォームテキストエリア
//  * @param {{
//  * label: string;
//  * id: string;
//  * value: string;
//  * onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//  * rows?: number;
//  * }} props
//  */
// const FormTextArea = ({label, id, value, onChange, rows = 3}) => (
//   <div className="mb-4">
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <textarea
//       id={id}
//       name={id}
//       value={value}
//       onChange={onChange}
//       rows={rows}
//       className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//     />
//   </div>
// )

// /**
//  * フォームファイル入力 (要件 1.2)
//  * @param {{
//  * label: string;
//  * id: string;
//  * fileName: string | null;
//  * onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//  * }} props
//  */
// const FormFileUpload = ({label, id, fileName, onChange}) => (
//   <div className="mb-4">
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <div className="mt-1 flex items-center space-x-2">
//       <label
//         htmlFor={id}
//         className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
//       >
//         <Upload className="w-4 h-4 mr-2" />
//         ファイルを選択
//       </label>
//       <input id={id} name={id} type="file" className="sr-only" onChange={onChange} />
//       {fileName ? (
//         <span className="text-sm text-gray-600 flex items-center">
//           <FileText className="w-4 h-4 mr-1 text-gray-500" />
//           {fileName}
//         </span>
//       ) : (
//         <span className="text-sm text-gray-500">選択されていません</span>
//       )}
//     </div>
//   </div>
// )

// /**
//  * フォームカード (セクション区切り)
//  * @param {{ title: string; icon: React.ReactNode; children: React.ReactNode }} props
//  */
// const FormCard = ({title, icon, children}) => (
//   <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm mb-6">
//     <div className="flex items-center p-3 border-b border-gray-200 bg-white rounded-t-lg">
//       {React.cloneElement(icon, {className: 'w-5 h-5 mr-2 text-indigo-600'})}
//       <h4 className="text-md font-semibold text-gray-800">{title}</h4>
//     </div>
//     <div className="p-4">{children}</div>
//   </div>
// )

// // --- マスタ管理 (要件 1.6) ---
// // ... (VehicleMaster, VehicleForm, UserMaster, UserForm, CustomerMaster, CustomerForm, ContactForm, HolidayMaster, HolidayForm は変更なし)
// // (コード長削減のため、前回の実装をそのまま維持すると仮定し、ここでは省略せずに記述します)

// // (VehicleMaster, VehicleForm, UserMaster, UserForm, CustomerMaster, CustomerForm, ContactForm, HolidayMaster, HolidayForm の実装は前回と同じ)
// // ※ 実際のファイルには前回と同じ内容が含まれます。

// const VehicleMaster = ({onEdit}) => {
//   const {vehicles, deleteItem} = useData()
//   return (
//     <div>
//       <h3 className="text-xl font-semibold mb-4">車両マスタ</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">プレートNo.</th>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">車種</th>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">座席数</th>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">車両携帯</th>
//               <th className="p-3 text-center text-sm font-semibold text-gray-600">操作</th>
//             </tr>
//           </thead>
//           <tbody>
//             {vehicles.length === 0 ? (
//               <tr>
//                 <td colSpan={5}>
//                   <EmptyState message="車両データがありません。" />
//                 </td>
//               </tr>
//             ) : (
//               vehicles.map(v => (
//                 <tr key={v.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3 text-sm text-gray-800">{v.plateNumber}</td>
//                   <td className="p-3 text-sm text-gray-700">{v.type}</td>
//                   <td className="p-3 text-sm text-gray-700">
//                     正 {v.seats} / 補 {v.subSeats}
//                   </td>
//                   <td className="p-3 text-sm text-gray-700">{v.phone}</td>
//                   <td className="p-3 text-center">
//                     <button onClick={() => onEdit(v)} className="p-1 text-blue-600 hover:text-blue-800">
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button onClick={() => deleteItem('vehicles', v.id)} className="p-1 text-red-600 hover:text-red-800">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
// const VehicleForm = ({initialData, onSave, onCancel}) => {
//   const [formData, setFormData] = useState({
//     id: initialData?.id || '',
//     plateNumber: initialData?.plateNumber || '',
//     type: initialData?.type || '大型',
//     seats: initialData?.seats || 45,
//     subSeats: initialData?.subSeats || 0,
//     phone: initialData?.phone || '',
//   })
//   const handleChange = e => {
//     const {name, value, type} = e.target
//     setFormData(prev => ({...prev, [name]: type === 'number' ? parseInt(value) || 0 : value}))
//   }
//   const handleSubmit = e => {
//     e.preventDefault()
//     onSave(formData)
//   }
//   return (
//     <form onSubmit={handleSubmit}>
//       <FormInput label="プレートNo." id="plateNumber" value={formData.plateNumber} onChange={handleChange} required />
//       <FormSelect
//         label="車種"
//         id="type"
//         value={formData.type}
//         onChange={handleChange}
//         options={[
//           {value: '大型', label: '大型'},
//           {value: '中型', label: '中型'},
//           {value: '小型', label: '小型'},
//           {value: 'マイクロ', label: 'マイクロ'},
//         ]}
//         required
//       />
//       <div className="grid grid-cols-2 gap-4">
//         <FormInput label="正席数" id="seats" type="number" value={formData.seats} onChange={handleChange} required />
//         <FormInput label="補助席数" id="subSeats" type="number" value={formData.subSeats} onChange={handleChange} />
//       </div>
//       <FormInput label="車両携帯番号" id="phone" value={formData.phone} onChange={handleChange} />
//       <div className="flex justify-end space-x-2 pt-4">
//         <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
//           キャンセル
//         </button>
//         <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
//           <Save className="w-4 h-4 mr-2" />
//           保存
//         </button>
//       </div>
//     </form>
//   )
// }
// const UserMaster = ({onEdit}) => {
//   const {users, deleteItem} = useData()
//   return (
//     <div>
//       <h3 className="text-xl font-semibold mb-4">ユーザーマスタ (乗務員含む)</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">氏名</th>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">乗務員番号</th>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">携帯番号</th>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">権限</th>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">区分</th>
//               <th className="p-3 text-center text-sm font-semibold text-gray-600">操作</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length === 0 ? (
//               <tr>
//                 <td colSpan={6}>
//                   <EmptyState message="ユーザーデータがありません。" />
//                 </td>
//               </tr>
//             ) : (
//               users.map(u => (
//                 <tr key={u.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3 text-sm text-gray-800">{u.name}</td>
//                   <td className="p-3 text-sm text-gray-700">{u.employeeNumber}</td>
//                   <td className="p-3 text-sm text-gray-700">{u.phone}</td>
//                   <td className="p-3 text-sm text-gray-700">{{admin: '管理者', editor: '編集者', viewer: '閲覧者'}[u.role]}</td>
//                   <td className="p-3 text-sm text-gray-700">
//                     {u.isDriver ? (
//                       <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">乗務員</span>
//                     ) : (
//                       <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">事務員</span>
//                     )}
//                   </td>
//                   <td className="p-3 text-center">
//                     <button onClick={() => onEdit(u)} className="p-1 text-blue-600 hover:text-blue-800">
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button onClick={() => deleteItem('users', u.id)} className="p-1 text-red-600 hover:text-red-800">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
// const UserForm = ({initialData, onSave, onCancel}) => {
//   const [formData, setFormData] = useState({
//     id: initialData?.id || '',
//     name: initialData?.name || '',
//     email: initialData?.email || '',
//     phone: initialData?.phone || '',
//     employeeNumber: initialData?.employeeNumber || '',
//     password: initialData?.password || 'password',
//     role: initialData?.role || 'viewer',
//     isDriver: initialData?.isDriver || false,
//   })
//   const handleChange = e => {
//     const {name, value, type, checked} = e.target
//     setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}))
//   }
//   const handleSubmit = e => {
//     e.preventDefault()
//     onSave(formData)
//   }
//   return (
//     <form onSubmit={handleSubmit}>
//       <FormInput label="氏名" id="name" value={formData.name} onChange={handleChange} required />
//       <FormInput
//         label="乗務員番号 (ログインID)"
//         id="employeeNumber"
//         value={formData.employeeNumber}
//         onChange={handleChange}
//         required
//       />
//       <FormInput label="メールアドレス" id="email" type="email" value={formData.email} onChange={handleChange} />
//       <FormInput label="社用携帯番号" id="phone" value={formData.phone} onChange={handleChange} />
//       <FormSelect
//         label="権限"
//         id="role"
//         value={formData.role}
//         onChange={handleChange}
//         options={[
//           {value: 'admin', label: '管理者'},
//           {value: 'editor', label: '編集者'},
//           {value: 'viewer', label: '閲覧者'},
//         ]}
//         required
//       />
//       <FormToggle label="乗務員として登録する" id="isDriver" checked={formData.isDriver} onChange={handleChange} />
//       <p className="text-xs text-gray-500 mb-4">(パスワードはモックのため固定です)</p>
//       <div className="flex justify-end space-x-2 pt-4">
//         <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
//           キャンセル
//         </button>
//         <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
//           <Save className="w-4 h-4 mr-2" />
//           保存
//         </button>
//       </div>
//     </form>
//   )
// }
// const CustomerMaster = ({onEditCustomer, onEditContact}) => {
//   const {customers, contacts, deleteItem} = useData()
//   return (
//     <div>
//       <h3 className="text-xl font-semibold mb-4">会社・担当者マスタ</h3>
//       <div className="space-y-6">
//         {customers.length === 0 ? (
//           <EmptyState message="会社データがありません。" />
//         ) : (
//           customers.map(c => (
//             <div key={c.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-t-lg">
//                 <span className="font-semibold text-gray-800 flex items-center">
//                   <Building className="w-5 h-5 mr-2 text-gray-600" />
//                   {c.name}
//                 </span>
//                 <div>
//                   <button onClick={() => onEditCustomer(c)} className="p-1 text-blue-600 hover:text-blue-800">
//                     <Edit2 className="w-4 h-4" />
//                   </button>
//                   <button onClick={() => deleteItem('customers', c.id)} className="p-1 text-red-600 hover:text-red-800">
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-3">
//                 {contacts.filter(con => con.customerId === c.id).length === 0 ? (
//                   <div className="text-sm text-gray-500 px-3 py-2">担当者が登録されていません。</div>
//                 ) : (
//                   <table className="min-w-full">
//                     <tbody>
//                       {contacts
//                         .filter(con => con.customerId === c.id)
//                         .map(con => (
//                           <tr key={con.id} className="border-b last:border-b-0">
//                             <td className="p-2 text-sm text-gray-700 flex items-center">
//                               <User className="w-4 h-4 mr-2 text-gray-500" />
//                               {con.name}
//                             </td>
//                             <td className="p-2 text-sm text-gray-600">{con.phone}</td>
//                             <td className="p-2 text-right">
//                               <button onClick={() => onEditContact(con)} className="p-1 text-blue-600 hover:text-blue-800">
//                                 <Edit2 className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => deleteItem('contacts', con.id)}
//                                 className="p-1 text-red-600 hover:text-red-800"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }
// const CustomerForm = ({initialData, onSave, onCancel}) => {
//   const [formData, setFormData] = useState({id: initialData?.id || '', name: initialData?.name || ''})
//   const handleSubmit = e => {
//     e.preventDefault()
//     if (formData.name) {
//       onSave(formData)
//     }
//   }
//   return (
//     <form onSubmit={handleSubmit}>
//       <FormInput
//         label="会社名"
//         id="name"
//         value={formData.name}
//         onChange={e => setFormData({...formData, name: e.target.value})}
//         required
//       />
//       <div className="flex justify-end space-x-2 pt-4">
//         <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
//           キャンセル
//         </button>
//         <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
//           <Save className="w-4 h-4 mr-2" />
//           保存
//         </button>
//       </div>
//     </form>
//   )
// }
// const ContactForm = ({initialData, onSave, onCancel}) => {
//   const {customers} = useData()
//   const [formData, setFormData] = useState({
//     id: initialData?.id || '',
//     customerId: initialData?.customerId || '',
//     name: initialData?.name || '',
//     phone: initialData?.phone || '',
//   })
//   const handleChange = e => {
//     const {name, value} = e.target
//     setFormData(prev => ({...prev, [name]: value}))
//   }
//   const handleSubmit = e => {
//     e.preventDefault()
//     if (formData.name && formData.customerId) {
//       onSave(formData)
//     }
//   }
//   return (
//     <form onSubmit={handleSubmit}>
//       <FormSelect
//         label="会社"
//         id="customerId"
//         value={formData.customerId}
//         onChange={handleChange}
//         options={customers.map(c => ({value: c.id, label: c.name}))}
//         required
//       />
//       <FormInput label="担当者名" id="name" value={formData.name} onChange={handleChange} required />
//       <FormInput label="担当者 携帯番号" id="phone" value={formData.phone} onChange={handleChange} />
//       <div className="flex justify-end space-x-2 pt-4">
//         <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
//           キャンセル
//         </button>
//         <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
//           <Save className="w-4 h-4 mr-2" />
//           保存
//         </button>
//       </div>
//     </form>
//   )
// }
// const HolidayMaster = ({onEdit}) => {
//   const {holidays, deleteItem} = useData()
//   const sortedHolidays = useMemo(() => {
//     return [...holidays].sort((a, b) => a.date.localeCompare(b.date))
//   }, [holidays])
//   return (
//     <div>
//       <h3 className="text-xl font-semibold mb-4">祝日マスタ</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">日付 (YYYY-MM-DD)</th>
//               <th className="p-3 text-left text-sm font-semibold text-gray-600">祝日名</th>
//               <th className="p-3 text-center text-sm font-semibold text-gray-600">操作</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedHolidays.length === 0 ? (
//               <tr>
//                 <td colSpan={3}>
//                   <EmptyState message="祝日データがありません。" />
//                 </td>
//               </tr>
//             ) : (
//               sortedHolidays.map(h => (
//                 <tr key={h.date} className="border-b hover:bg-gray-50">
//                   <td className="p-3 text-sm text-gray-800">{h.date}</td>
//                   <td className="p-3 text-sm text-gray-700">{h.name}</td>
//                   <td className="p-3 text-center">
//                     <button onClick={() => onEdit(h)} className="p-1 text-blue-600 hover:text-blue-800">
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button onClick={() => deleteItem('holidays', h.date)} className="p-1 text-red-600 hover:text-red-800">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
// const HolidayForm = ({initialData, onSave, onCancel}) => {
//   const [formData, setFormData] = useState({
//     date: initialData?.date || new Date().toISOString().split('T')[0],
//     name: initialData?.name || '',
//   })
//   const handleSubmit = e => {
//     e.preventDefault()
//     if (formData.name && formData.date) {
//       onSave(formData)
//     }
//   }
//   return (
//     <form onSubmit={handleSubmit}>
//       <FormInput
//         label="日付"
//         id="date"
//         type="date"
//         value={formData.date}
//         onChange={e => setFormData({...formData, date: e.target.value})}
//         disabled={!!initialData}
//         required
//       />
//       <FormInput
//         label="祝日名"
//         id="name"
//         value={formData.name}
//         onChange={e => setFormData({...formData, name: e.target.value})}
//         required
//       />
//       {!!initialData && <p className="text-xs text-gray-500 -mt-2 mb-4">祝日データの日付 (ID) は変更できません。</p>}
//       <div className="flex justify-end space-x-2 pt-4">
//         <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
//           キャンセル
//         </button>
//         <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
//           <Save className="w-4 h-4 mr-2" />
//           保存
//         </button>
//       </div>
//     </form>
//   )
// }

// const MasterManagementPage = () => {
//   const {addOrUpdateItem} = useData()
//   const [modalContent, setModalContent] = useState(null)
//   const closeModal = () => setModalContent(null)
//   const openModal = (type, data = null) => {
//     if (type === 'vehicle') {
//       setModalContent({
//         title: data ? '車両の編集' : '車両の追加',
//         content: (
//           <VehicleForm
//             initialData={data}
//             onSave={item => {
//               addOrUpdateItem('vehicles', item)
//               closeModal()
//             }}
//             onCancel={closeModal}
//           />
//         ),
//       })
//     } else if (type === 'user') {
//       setModalContent({
//         title: data ? 'ユーザーの編集' : 'ユーザーの追加',
//         content: (
//           <UserForm
//             initialData={data}
//             onSave={item => {
//               addOrUpdateItem('users', item)
//               closeModal()
//             }}
//             onCancel={closeModal}
//           />
//         ),
//       })
//     } else if (type === 'customer') {
//       setModalContent({
//         title: data ? '会社の編集' : '会社の追加',
//         content: (
//           <CustomerForm
//             initialData={data}
//             onSave={item => {
//               addOrUpdateItem('customers', item)
//               closeModal()
//             }}
//             onCancel={closeModal}
//           />
//         ),
//       })
//     } else if (type === 'contact') {
//       setModalContent({
//         title: data ? '担当者の編集' : '担当者の追加',
//         content: (
//           <ContactForm
//             initialData={data}
//             onSave={item => {
//               addOrUpdateItem('contacts', item)
//               closeModal()
//             }}
//             onCancel={closeModal}
//           />
//         ),
//       })
//     } else if (type === 'holiday') {
//       setModalContent({
//         title: data ? '祝日の編集' : '祝日の追加',
//         content: (
//           <HolidayForm
//             initialData={data}
//             onSave={item => {
//               addOrUpdateItem('holidays', {...item, id: item.date})
//               closeModal()
//             }}
//             onCancel={closeModal}
//           />
//         ),
//       })
//     }
//   }
//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <button
//           onClick={() => openModal('vehicle')}
//           className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
//         >
//           <Bus className="w-5 h-5 mr-2 text-indigo-600" /> 車両を追加
//         </button>
//         <button
//           onClick={() => openModal('user')}
//           className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
//         >
//           <Users className="w-5 h-5 mr-2 text-indigo-600" /> ユーザーを追加
//         </button>
//         <button
//           onClick={() => openModal('customer')}
//           className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
//         >
//           <Building className="w-5 h-5 mr-2 text-indigo-600" /> 会社を追加
//         </button>
//         <button
//           onClick={() => openModal('contact')}
//           className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
//         >
//           <UserCheck className="w-5 h-5 mr-2 text-indigo-600" /> 担当者を追加
//         </button>
//         <button
//           onClick={() => openModal('holiday')}
//           className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 flex items-center justify-center"
//         >
//           <Flag className="w-5 h-5 mr-2 text-indigo-600" /> 祝日を追加
//         </button>
//       </div>
//       <VehicleMaster onEdit={v => openModal('vehicle', v)} />
//       <UserMaster onEdit={u => openModal('user', u)} />
//       <CustomerMaster onEditCustomer={c => openModal('customer', c)} onEditContact={c => openModal('contact', c)} />
//       <HolidayMaster onEdit={h => openModal('holiday', h)} />
//       <Modal isOpen={!!modalContent} onClose={closeModal} title={modalContent?.title || ''}>
//         {modalContent?.content}
//       </Modal>
//     </div>
//   )
// }

// // --- スケジュールフォーム (要件 1.2 / 1.1) ---
// // (ScheduleForm も変更なし)
// const ScheduleForm = ({initialData, onSave, onCancel}) => {
//   const {vehicles, drivers, customers, contacts} = useData()
//   const [formData, setFormData] = useState({
//     id: initialData?.id || '',
//     date: initialData?.date || new Date().toISOString().split('T')[0],
//     vehicleId: initialData?.vehicleId || '',
//     driverIds: initialData?.driverIds || [],
//     customerId: initialData?.customerId || '',
//     contactId: initialData?.contactId || '',
//     organizationName: initialData?.organizationName || '',
//     organizationContact: initialData?.organizationContact || '',
//     destination: initialData?.destination || '',
//     hasGuide: initialData?.hasGuide || false,
//     departureTime: initialData?.departureTime || '08:00',
//     returnTime: initialData?.returnTime || '17:00',
//     remarks: initialData?.remarks || '',
//     pdfFile: initialData?.pdfFile || null,
//   })
//   const [fileName, setFileName] = useState(initialData?.pdfFile || null)
//   const availableContacts = useMemo(() => {
//     if (!formData.customerId) return contacts
//     return contacts.filter(c => c.customerId === formData.customerId)
//   }, [formData.customerId, contacts])
//   useEffect(() => {
//     if (formData.contactId && !availableContacts.find(c => c.id === formData.contactId)) {
//       setFormData(prev => ({...prev, contactId: ''}))
//     }
//   }, [formData.contactId, availableContacts])
//   useEffect(() => {
//     if (formData.customerId) {
//       const customer = customers.find(c => c.id === formData.customerId)
//       if (customer && !formData.organizationName) {
//         setFormData(prev => ({...prev, organizationName: customer.name}))
//       }
//     }
//   }, [formData.customerId, customers, formData.organizationName])
//   useEffect(() => {
//     if (formData.contactId) {
//       const contact = contacts.find(c => c.id === formData.contactId)
//       if (contact && !formData.organizationContact) {
//         setFormData(prev => ({...prev, organizationContact: contact.name}))
//       }
//     }
//   }, [formData.contactId, contacts, formData.organizationContact])
//   const handleChange = e => {
//     const {name, value, type, checked} = e.target
//     setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}))
//   }
//   const handleDriverChange = e => {
//     const {options} = e.target
//     const selectedDriverIds = []
//     for (const option of options) {
//       if (option.selected) {
//         selectedDriverIds.push(option.value)
//       }
//     }
//     setFormData(prev => ({...prev, driverIds: selectedDriverIds}))
//   }
//   const handleFileChange = e => {
//     const file = e.target.files ? e.target.files[0] : null
//     if (file) {
//       setFileName(file.name)
//       setFormData(prev => ({...prev, pdfFile: file.name}))
//     } else {
//       setFileName(null)
//       setFormData(prev => ({...prev, pdfFile: null}))
//     }
//   }
//   const handleSubmit = e => {
//     e.preventDefault()
//     onSave(formData)
//   }
//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <FormCard title="基本情報" icon={<Briefcase />}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
//           <FormInput
//             label="運行日"
//             id="date"
//             type="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//             icon={<Calendar />}
//           />
//           <FormSelect
//             label="車両"
//             id="vehicleId"
//             value={formData.vehicleId}
//             onChange={handleChange}
//             options={vehicles.map(v => ({value: v.id, label: `${v.plateNumber} (${v.type})`}))}
//             required
//             icon={<Bus />}
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
//           <FormInput
//             label="出庫時間"
//             id="departureTime"
//             type="time"
//             value={formData.departureTime}
//             onChange={handleChange}
//             required
//             icon={<Clock />}
//           />
//           <FormInput
//             label="帰庫時間"
//             id="returnTime"
//             type="time"
//             value={formData.returnTime}
//             onChange={handleChange}
//             required
//             icon={<Clock />}
//           />
//         </div>
//       </FormCard>
//       <FormCard title="顧客・担当者情報" icon={<Building />}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
//           <FormSelect
//             label="顧客 (会社)"
//             id="customerId"
//             value={formData.customerId}
//             onChange={handleChange}
//             options={customers.map(c => ({value: c.id, label: c.name}))}
//             icon={<Building />}
//           />
//           <FormSelect
//             label="顧客 (担当者)"
//             id="contactId"
//             value={formData.contactId}
//             onChange={handleChange}
//             options={availableContacts.map(c => ({value: c.id, label: c.name}))}
//             disabled={!formData.customerId}
//             icon={<UserCheck />}
//           />
//         </div>
//         <p className="text-xs text-gray-500 mb-4 -mt-2">(顧客マスタから選ぶと、団体名・担当者名が自動入力されます)</p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
//           <FormInput
//             label="団体名 (手入力)"
//             id="organizationName"
//             value={formData.organizationName}
//             onChange={handleChange}
//             required
//             icon={<Users2 />}
//           />
//           <FormInput
//             label="担当者名 (手入力)"
//             id="organizationContact"
//             value={formData.organizationContact}
//             onChange={handleChange}
//             icon={<User />}
//           />
//         </div>
//       </FormCard>
//       <FormCard title="運行詳細" icon={<Info />}>
//         <FormInput
//           label="行き先 (手入力)"
//           id="destination"
//           value={formData.destination}
//           onChange={handleChange}
//           required
//           icon={<MapPin />}
//         />
//         <div className="mb-4">
//           <label htmlFor="driverIds" className="block text-sm font-medium text-gray-700 mb-1">
//             乗務員 <span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//               <Users className="w-4 h-4" />
//             </div>
//             <select
//               id="driverIds"
//               name="driverIds"
//               multiple
//               value={formData.driverIds}
//               onChange={handleDriverChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
//             >
//               {drivers.map(d => (
//                 <option key={d.id} value={d.id}>
//                   {d.name}
//                 </option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 mt-1">(複数選択可: Ctrl/Cmdキーを押しながらクリック)</p>
//           </div>
//         </div>
//         <FormToggle label="ガイドの有無 (手入力)" id="hasGuide" checked={formData.hasGuide} onChange={handleChange} />
//         <FormFileUpload label="運行指示書 (PDF)" id="pdfFile" fileName={fileName} onChange={handleFileChange} />
//         <FormTextArea label="備考" id="remarks" value={formData.remarks} onChange={handleChange} />
//       </FormCard>
//       <div className="flex justify-end space-x-2 pt-4">
//         <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
//           キャンセル
//         </button>
//         <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
//           <Save className="w-4 h-4 mr-2" />
//           保存
//         </button>
//       </div>
//     </form>
//   )
// }

// // --- スケジュール管理 (要件 1.1 + 追加要件 1, 2) ---

// // ユーティリティ: 日付操作
// const addDays = (date, days) => {
//   const newDate = new Date(date)
//   newDate.setDate(newDate.getDate() + days)
//   return newDate
// }

// const getISODateString = date => {
//   return date.toISOString().split('T')[0]
// }

// const getDayOfWeek = dateStr => {
//   const day = new Date(dateStr).getDay()
//   return ['日', '月', '火', '水', '木', '金', '土'][day]
// }

// /**
//  * ガントチャートヘッダー (日付 + 点呼者) (追加要件 1)
//  * @param {{
//  * startDate: Date;
//  * numDays: number;
//  * holidays: Holiday[];
//  * users: User[];
//  * rollCallers: RollCaller[];
//  * onUpdateRollCaller: (date: string, userId: string) => void;
//  * }} props
//  */
// const ScheduleGridHeader = ({startDate, numDays, holidays, users, rollCallers, onUpdateRollCaller}) => {
//   const holidayMap = useMemo(() => new Map(holidays.map(h => [h.date, h.name])), [holidays])
//   const rollCallerMap = useMemo(() => new Map(rollCallers.map(rc => [rc.date, rc.userId])), [rollCallers])

//   const days = Array.from({
//     length: numDays,
//   }).map((_, i) => {
//     const date = addDays(startDate, i)
//     const dateStr = getISODateString(date)
//     const dayOfWeek = date.getDay()
//     const isSaturday = dayOfWeek === 6
//     const isSunday = dayOfWeek === 0
//     const isHoliday = holidayMap.has(dateStr)

//     let dayClass = 'text-gray-700'
//     if (isHoliday) dayClass = 'text-red-600'
//     else if (isSunday) dayClass = 'text-red-500'
//     else if (isSaturday) dayClass = 'text-blue-500'

//     return {
//       date: date,
//       dateStr: dateStr,
//       day: date.getDate(),
//       dayOfWeek: getDayOfWeek(dateStr),
//       dayClass: dayClass,
//       tooltip: holidayMap.get(dateStr) || '',
//       rollCallerId: rollCallerMap.get(dateStr) || '',
//     }
//   })

//   return (
//     <div className="sticky top-0 z-20 bg-gray-100 shadow-md">
//       {/* 1行目: 日付・曜日 */}
//       <div className="grid grid-cols-[150px_repeat(14,minmax(100px,1fr))] border-b border-gray-300">
//         <div className="p-2 text-sm font-semibold text-gray-700 border-r border-gray-300 flex items-center bg-gray-200">
//           日付 / 車両
//         </div>
//         {days.map(d => (
//           <div key={d.dateStr} className={`p-2 text-center border-r border-gray-300 ${d.dayClass}`} title={d.tooltip}>
//             <div className="text-xs">{d.dayOfWeek}</div>
//             <div className="text-lg font-semibold">{d.day}</div>
//           </div>
//         ))}
//       </div>

//       {/* 2行目: 点呼者選択 (追加要件 1) */}
//       <div className="grid grid-cols-[150px_repeat(14,minmax(100px,1fr))] border-b-2 border-gray-300 bg-white">
//         <div className="p-2 text-xs font-semibold text-gray-700 border-r border-gray-300 flex items-center bg-gray-100">
//           点呼者
//         </div>
//         {days.map(d => (
//           <div key={`rc-${d.dateStr}`} className="p-1 border-r border-gray-300">
//             <select
//               value={d.rollCallerId}
//               onChange={e => onUpdateRollCaller(d.dateStr, e.target.value)}
//               className="w-full text-xs p-1 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             >
//               <option value="">未定</option>
//               {users.map(u => (
//                 <option key={u.id} value={u.id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// /**
//  * スケジュールバー (ガントチャートのアイテム) (追加要件 2: コピー機能)
//  * @param {{
//  * schedule: Schedule;
//  * onClick: () => void;
//  * onCopyStart: (e: React.MouseEvent) => void;
//  * getDriverNames: (driverIds: string[]) => string;
//  * }} props
//  */
// const ScheduleBar = ({schedule, onClick, onCopyStart, getDriverNames}) => {
//   const duration = 1
//   const gridColumnStart = 1

//   return (
//     <div className={`col-start-${gridColumnStart} col-span-${duration} mx-0.5 group relative`}>
//       <button
//         onClick={onClick}
//         className="w-full h-full p-1.5 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 focus:outline-none overflow-hidden text-left relative"
//         title={`${schedule.organizationName}\n${schedule.destination}\n${getDriverNames(schedule.driverIds)}`}
//       >
//         <div className="text-xs font-semibold truncate pr-4">
//           {schedule.departureTime} - {schedule.organizationName}
//         </div>
//         <div className="text-[10px] truncate opacity-80">{schedule.destination}</div>
//         <div className="text-[10px] truncate opacity-80">{getDriverNames(schedule.driverIds)}</div>
//       </button>

//       {/* コピーボタン (ホバー時に表示) */}
//       <button
//         onClick={e => {
//           e.stopPropagation() // 親のonClick(編集)をトリガーしない
//           onCopyStart(e)
//         }}
//         className="absolute top-0.5 right-0.5 p-1 bg-white text-blue-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-blue-100 transition-opacity shadow-sm"
//         title="このスケジュールをコピー"
//       >
//         <Copy className="w-3 h-3" />
//       </button>
//     </div>
//   )
// }

// /**
//  * スケジュールグリッド本体 (要件 1.1 + 追加要件 2: コピー機能)
//  * @param {{
//  * vehicles: Vehicle[];
//  * schedules: Schedule[];
//  * startDate: Date;
//  * numDays: number;
//  * onEditSchedule: (schedule: Schedule) => void;
//  * onNewSchedule: (date: string, vehicleId: string) => void;
//  * getDriverNames: (driverIds: string[]) => string;
//  * copySource: Schedule | null; // コピー元がある場合はコピーモード
//  * selectedTargets: Set<string>; // 選択されたコピー先
//  * onCopyTargetClick: (vehicleId: string, dateStr: string) => void;
//  * onCopyStart: (schedule: Schedule) => void;
//  * }} props
//  */
// const ScheduleGridBody = ({
//   vehicles,
//   schedules,
//   startDate,
//   numDays,
//   onEditSchedule,
//   onNewSchedule,
//   getDriverNames,
//   copySource,
//   selectedTargets,
//   onCopyTargetClick,
//   onCopyStart,
// }) => {
//   const isCopyMode = !!copySource

//   const scheduleMap = useMemo(() => {
//     const map = new Map()
//     for (const v of vehicles) {
//       map.set(v.id, new Map())
//     }
//     for (const s of schedules) {
//       const vehicleSchedules = map.get(s.vehicleId)
//       if (vehicleSchedules) {
//         if (!vehicleSchedules.has(s.date)) {
//           vehicleSchedules.set(s.date, [])
//         }
//         vehicleSchedules.get(s.date).push(s)
//       }
//     }
//     return map
//   }, [schedules, vehicles])

//   const days = Array.from({
//     length: numDays,
//   }).map((_, i) => getISODateString(addDays(startDate, i)))

//   return (
//     <div className={`grid grid-cols-[150px_repeat(14,minmax(100px,1fr))] relative ${isCopyMode ? 'bg-gray-800' : ''}`}>
//       {/* コピーモード時のオーバーレイ (全体を暗くする) - 上位のdivのbgで代用 */}

//       {vehicles.map(v => (
//         <React.Fragment key={v.id}>
//           {/* 車両情報 (縦軸) */}
//           <div
//             className={`sticky left-0 p-2 border-r border-b border-gray-300 bg-white shadow-sm min-h-[70px] z-10 ${isCopyMode ? 'opacity-50' : ''}`}
//           >
//             <div className="text-sm font-semibold text-gray-800">{v.plateNumber}</div>
//             <div className="text-xs text-gray-600">
//               {v.type} (正{v.seats}/補{v.subSeats})
//             </div>
//           </div>

//           {/* スケジュールセル (日付ごと) */}
//           {days.map(dateStr => {
//             const daySchedules = scheduleMap.get(v.id)?.get(dateStr) || []
//             const cellKey = `${v.id}:${dateStr}`
//             const isSelectedTarget = selectedTargets.has(cellKey)

//             // コピーモード時のセルスタイル
//             let cellClass = 'bg-white hover:bg-gray-50' // 通常時
//             if (isCopyMode) {
//               if (isSelectedTarget) {
//                 // 選択されたセル: 背景を黄色っぽく、不透明度を高くして強調
//                 cellClass = 'bg-yellow-100 ring-2 ring-inset ring-yellow-400 z-20 cursor-pointer opacity-100'
//               } else {
//                 // 選択されていないセル: 背景を白のまま不透明度を下げ、親のbg-gray-800を透かして暗く見せる
//                 // これにより、内部のスケジュールバーも薄く見えるようになる
//                 cellClass = 'bg-white opacity-25 cursor-pointer hover:opacity-40'
//               }
//             }

//             return (
//               <div
//                 key={cellKey}
//                 className={`p-1 border-r border-b border-gray-300 min-h-[70px] transition-all relative ${cellClass}`}
//                 onClick={e => {
//                   if (isCopyMode) {
//                     onCopyTargetClick(v.id, dateStr)
//                   } else {
//                     // @ts-ignore
//                     if (e.target.classList.contains('border-r') || e.target === e.currentTarget) {
//                       onNewSchedule(dateStr, v.id)
//                     }
//                   }
//                 }}
//               >
//                 {/* スケジュールバーを表示 (コピーモード時は pointer-events-none で操作無効化) */}
//                 <div className={`space-y-0.5 ${isCopyMode ? 'pointer-events-none' : ''}`}>
//                   {daySchedules.map(s => (
//                     <ScheduleBar
//                       key={s.id}
//                       schedule={s}
//                       onClick={() => !isCopyMode && onEditSchedule(s)}
//                       onCopyStart={() => !isCopyMode && onCopyStart(s)}
//                       getDriverNames={getDriverNames}
//                     />
//                   ))}
//                 </div>

//                 {/* コピーモード時の選択済みマーク */}
//                 {isCopyMode && isSelectedTarget && (
//                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                     <Check className="w-8 h-8 text-yellow-600 opacity-80" />
//                   </div>
//                 )}
//               </div>
//             )
//           })}
//         </React.Fragment>
//       ))}
//     </div>
//   )
// }

// /**
//  * スケジュール管理ページ (SchedulePage)
//  */
// const SchedulePage = () => {
//   const {vehicles, schedules, drivers, holidays, users, rollCallers, addOrUpdateItem, addItems, updateRollCaller} = useData()
//   const [startDate, setStartDate] = useState(BASE_DATE)
//   const [numDays] = useState(14) // 2週間表示
//   const [modalContent, setModalContent] = useState(null)

//   // コピー機能用ステート
//   const [copySource, setCopySource] = useState(null)
//   const [selectedTargets, setSelectedTargets] = useState(new Set())

//   const closeModal = () => setModalContent(null)

//   const openScheduleForm = data => {
//     setModalContent({
//       title: data?.id ? '運行データの編集' : '運行データの新規作成',
//       type: 'schedule',
//       // @ts-ignore
//       content: (
//         <ScheduleForm
//           initialData={data}
//           onSave={item => {
//             addOrUpdateItem('schedules', item)
//             closeModal()
//           }}
//           onCancel={closeModal}
//         />
//       ),
//     })
//   }

//   const handleNewSchedule = (date, vehicleId) => {
//     openScheduleForm({
//       date,
//       vehicleId,
//     })
//   }

//   const getDriverNames = useCallback(
//     driverIds => {
//       return driverIds
//         .map(id => drivers.find(d => d.id === id)?.name)
//         .filter(Boolean)
//         .join(', ')
//     },
//     [drivers]
//   )

//   // --- コピー機能ロジック ---

//   const handleCopyStart = schedule => {
//     setCopySource(schedule)
//     setSelectedTargets(new Set())
//   }

//   const handleCopyCancel = () => {
//     setCopySource(null)
//     setSelectedTargets(new Set())
//   }

//   const handleCopyTargetClick = (vehicleId, dateStr) => {
//     if (!copySource) return

//     const key = `${vehicleId}:${dateStr}`
//     setSelectedTargets(prev => {
//       const next = new Set(prev)
//       if (next.has(key)) {
//         next.delete(key)
//       } else {
//         next.add(key)
//       }
//       return next
//     })
//   }

//   const handleCopyExecute = () => {
//     if (!copySource || selectedTargets.size === 0) return

//     if (!window.confirm(`${selectedTargets.size}件のセルにスケジュールをコピーしますか？`)) {
//       return
//     }

//     const newSchedules = []
//     selectedTargets.forEach(key => {
//       const [vehicleId, dateStr] = key.split(':')
//       // @ts-ignore
//       const {id, ...sourceData} = copySource

//       newSchedules.push({
//         ...sourceData,
//         id: `copy-${Date.now()}-${Math.random()}`,
//         vehicleId: vehicleId,
//         date: dateStr,
//       })
//     })

//     addItems('schedules', newSchedules)
//     handleCopyCancel()
//   }

//   return (
//     <div>
//       {/* ヘッダー (日付移動) */}
//       <div className="flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow-sm border">
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setStartDate(addDays(startDate, -7))}
//             className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//             disabled={!!copySource}
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => setStartDate(addDays(startDate, -1))}
//             className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//             disabled={!!copySource}
//           >
//             <ChevronLeft className="w-4 h-4" /> <span className="text-sm">前日</span>
//           </button>
//           <button
//             onClick={() => setStartDate(BASE_DATE)}
//             className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-sm font-medium"
//             disabled={!!copySource}
//           >
//             今日 ({getISODateString(BASE_DATE)})
//           </button>
//           <button
//             onClick={() => setStartDate(addDays(startDate, 1))}
//             className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//             disabled={!!copySource}
//           >
//             <span className="text-sm">翌日</span> <ChevronRight className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setStartDate(addDays(startDate, 7))}
//             className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//             disabled={!!copySource}
//           >
//             <ChevronRight className="w-5 h-5" />
//           </button>
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => openScheduleForm(null)}
//             className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center"
//             disabled={!!copySource}
//           >
//             <Plus className="w-5 h-5 mr-1" /> 新規作成
//           </button>
//         </div>
//       </div>

//       {/* コピーモード用コントロールバー */}
//       {copySource && (
//         <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 text-white p-4 z-50 flex justify-between items-center shadow-lg transform transition-transform">
//           <div className="flex items-center">
//             <Copy className="w-6 h-6 mr-3 text-yellow-400" />
//             <div>
//               <p className="font-bold text-lg">コピーモード中</p>
//               <p className="text-sm text-gray-300">
//                 コピー元のデータ: {copySource.organizationName} ({copySource.destination})
//               </p>
//               <p className="text-sm text-gray-300">
//                 コピー先を選択してください: <span className="font-bold text-yellow-400">{selectedTargets.size}</span> 箇所
//               </p>
//             </div>
//           </div>
//           <div className="flex space-x-4">
//             <button
//               onClick={handleCopyCancel}
//               className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium"
//             >
//               キャンセル
//             </button>
//             <button
//               onClick={handleCopyExecute}
//               disabled={selectedTargets.size === 0}
//               className={`px-6 py-2 rounded-lg font-bold flex items-center ${
//                 selectedTargets.size > 0
//                   ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
//                   : 'bg-gray-500 text-gray-300 cursor-not-allowed'
//               }`}
//             >
//               <Check className="w-5 h-5 mr-2" />
//               コピー実施
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ガントチャート */}
//       <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md bg-gray-50 relative">
//         <ScheduleGridHeader
//           startDate={startDate}
//           numDays={numDays}
//           holidays={holidays}
//           users={users}
//           rollCallers={rollCallers}
//           onUpdateRollCaller={updateRollCaller}
//         />
//         <ScheduleGridBody
//           vehicles={vehicles}
//           schedules={schedules}
//           startDate={startDate}
//           numDays={numDays}
//           // @ts-ignore
//           onEditSchedule={s => openScheduleForm(s)}
//           onNewSchedule={handleNewSchedule}
//           getDriverNames={getDriverNames}
//           copySource={copySource}
//           selectedTargets={selectedTargets}
//           onCopyTargetClick={handleCopyTargetClick}
//           onCopyStart={handleCopyStart}
//         />
//       </div>

//       {/* スケジュール編集モーダル */}
//       <Modal
//         // @ts-ignore
//         isOpen={modalContent?.type === 'schedule'}
//         onClose={closeModal}
//         // @ts-ignore
//         title={modalContent?.title || ''}
//         size="xl"
//       >
//         {/* @ts-ignore */}
//         {modalContent?.content}
//       </Modal>
//     </div>
//   )
// }

// // --- マイページ (要件 1.5) ---
// // (MyPage, MyPageWeeklyView, MyPageMonthlyView は変更なし)
// // (コード長削減のため、前回の実装をそのまま維持すると仮定し、ここでは省略せずに記述します)

// const MyPage = ({loggedInUserId}) => {
//   const {schedules, vehicles, users} = useData()
//   const [viewMode, setViewMode] = useState('weekly')
//   const [currentDate, setCurrentDate] = useState(BASE_DATE)
//   const currentUser = users.find(u => u.id === loggedInUserId)
//   const mySchedules = useMemo(() => {
//     return schedules
//       .filter(s => s.driverIds.includes(loggedInUserId))
//       .sort((a, b) => a.date.localeCompare(b.date) || a.departureTime.localeCompare(b.departureTime))
//   }, [schedules, loggedInUserId])
//   if (!currentUser) {
//     return <ErrorDisplay message="ログインユーザーが見つかりません。" />
//   }
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">マイページ ({currentUser.name}さん)</h2>
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex space-x-1 p-1 bg-gray-200 rounded-lg">
//           <button
//             onClick={() => setViewMode('weekly')}
//             className={`px-4 py-1.5 rounded-md text-sm font-medium ${viewMode === 'weekly' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
//           >
//             <List className="w-4 h-4 inline-block mr-1" />
//             週間ビュー
//           </button>
//           <button
//             onClick={() => setViewMode('monthly')}
//             className={`px-4 py-1.5 rounded-md text-sm font-medium ${viewMode === 'monthly' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
//           >
//             <CalendarDays className="w-4 h-4 inline-block mr-1" />
//             月間ビュー
//           </button>
//         </div>
//       </div>
//       {viewMode === 'weekly' ? (
//         <MyPageWeeklyView mySchedules={mySchedules} vehicles={vehicles} startDate={currentDate} />
//       ) : (
//         <MyPageMonthlyView mySchedules={mySchedules} currentDate={currentDate} setCurrentDate={setCurrentDate} />
//       )}
//     </div>
//   )
// }
// const MyPageWeeklyView = ({mySchedules, vehicles, startDate}) => {
//   const vehicleMap = useMemo(() => new Map(vehicles.map(v => [v.id, v])), [vehicles])
//   const schedulesByDate = useMemo(() => {
//     const groups = new Map()
//     mySchedules.forEach(s => {
//       if (!groups.has(s.date)) {
//         groups.set(s.date, [])
//       }
//       groups.get(s.date).push(s)
//     })
//     return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]))
//   }, [mySchedules])
//   return (
//     <div className="space-y-6">
//       {schedulesByDate.length === 0 ? (
//         <EmptyState message="今週のスケジュールはありません。" />
//       ) : (
//         schedulesByDate.map(([dateStr, schedules]) => (
//           <div key={dateStr}>
//             <h4 className="text-lg font-semibold mb-2 p-2 bg-gray-100 rounded-t-lg border-b-2 border-indigo-500">
//               {dateStr} ({getDayOfWeek(dateStr)})
//             </h4>
//             <div className="space-y-3">
//               {schedules.map(s => (
//                 <div key={s.id} className="p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <span className="text-sm font-medium text-gray-500">
//                         {s.departureTime} 〜 {s.returnTime}
//                       </span>
//                       <h5 className="text-xl font-semibold text-gray-800">{s.organizationName}</h5>
//                     </div>
//                     {s.pdfFile && (
//                       <a
//                         href="#"
//                         onClick={e => {
//                           e.preventDefault()
//                           alert(`「${s.pdfFile}」を開きます (モック)`)
//                         }}
//                         className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200"
//                       >
//                         <FileText className="w-4 h-4 mr-1" />
//                         運行指示書
//                       </a>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
//                     <div className="flex items-center text-gray-600">
//                       <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
//                       <strong>行き先:</strong> <span className="ml-1">{s.destination}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <Bus className="w-4 h-4 mr-1.5 text-gray-400" />
//                       <strong>車両:</strong> <span className="ml-1">{vehicleMap.get(s.vehicleId)?.plateNumber || '不明'}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <User className="w-4 h-4 mr-1.5 text-gray-400" />
//                       <strong>担当:</strong> <span className="ml-1">{s.organizationContact}</span>
//                     </div>
//                   </div>
//                   {s.remarks && (
//                     <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700 border border-gray-200">
//                       <strong>備考:</strong> {s.remarks}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   )
// }
// const MyPageMonthlyView = ({mySchedules, currentDate, setCurrentDate}) => {
//   const [selectedDate, setSelectedDate] = useState(null)
//   const month = currentDate.getMonth()
//   const year = currentDate.getFullYear()
//   const firstDayOfMonth = new Date(year, month, 1).getDay()
//   const daysInMonth = new Date(year, month + 1, 0).getDate()
//   const schedulesByDate = useMemo(() => {
//     const map = new Map()
//     mySchedules.forEach(s => {
//       if (!map.has(s.date)) {
//         map.set(s.date, [])
//       }
//       map.get(s.date).push(s)
//     })
//     return map
//   }, [mySchedules])
//   const handlePrevMonth = () => {
//     setCurrentDate(new Date(year, month - 1, 1))
//   }
//   const handleNextMonth = () => {
//     setCurrentDate(new Date(year, month + 1, 1))
//   }
//   const todayStr = getISODateString(new Date())
//   const days = []
//   for (let i = 0; i < firstDayOfMonth; i++) {
//     days.push({key: `prev-${i}`, isBlank: true})
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     const dateStr = getISODateString(new Date(year, month, d))
//     days.push({
//       key: dateStr,
//       dateStr: dateStr,
//       day: d,
//       isToday: dateStr === todayStr,
//       schedules: schedulesByDate.get(dateStr) || [],
//     })
//   }
//   return (
//     <div className="bg-white rounded-lg shadow-md border">
//       <div className="flex justify-between items-center p-3 border-b">
//         <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-gray-100">
//           <ChevronLeft className="w-5 h-5" />
//         </button>
//         <h3 className="text-xl font-semibold">
//           {year}年 {month + 1}月
//         </h3>
//         <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-gray-100">
//           <ChevronRight className="w-5 h-5" />
//         </button>
//       </div>
//       <div className="grid grid-cols-7 border-b">
//         {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
//           <div
//             key={day}
//             className={`p-2 text-center text-sm font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}
//           >
//             {day}
//           </div>
//         ))}
//       </div>
//       <div className="grid grid-cols-7">
//         {days.map(d => {
//           if (d.isBlank) {
//             return <div key={d.key} className="h-24 border-b border-r bg-gray-50"></div>
//           }
//           return (
//             <div
//               key={d.key}
//               className="h-28 border-b border-r p-1.5 overflow-y-auto relative"
//               onClick={() => d.schedules.length > 0 && setSelectedDate(d.dateStr)}
//             >
//               <span
//                 className={`text-sm font-medium ${d.isToday ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-800'}`}
//               >
//                 {d.day}
//               </span>
//               <div className="mt-1 space-y-0.5">
//                 {d.schedules.map(s => (
//                   <div
//                     key={s.id}
//                     className="p-0.5 bg-blue-500 text-white rounded text-[10px] truncate"
//                     title={s.organizationName}
//                   >
//                     {s.departureTime} {s.organizationName}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )
//         })}
//       </div>
//       <Modal isOpen={!!selectedDate} onClose={() => setSelectedDate(null)} title={`スケジュール詳細 (${selectedDate})`}>
//         {selectedDate &&
//           schedulesByDate.get(selectedDate).map(s => (
//             <div key={s.id} className="mb-2 p-2 border rounded">
//               <p>
//                 <strong>{s.organizationName}</strong> ({s.departureTime}〜)
//               </p>
//               <p className="text-sm">行き先: {s.destination}</p>
//             </div>
//           ))}
//       </Modal>
//     </div>
//   )
// }

// // --- メインコンポーネント ---
// // (AppHeader, BusScheduleMockupApp, AppContent は変更なし)
// const AppHeader = ({currentPage, onNavigate}) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const navItems = [
//     {id: 'schedule', label: 'スケジュール管理', icon: <Calendar />},
//     {id: 'myPage', label: 'マイページ', icon: <User />},
//     {id: 'master', label: 'マスタ管理', icon: <Settings />},
//   ]
//   const NavLink = ({id, label, icon}) => (
//     <button
//       onClick={() => {
//         onNavigate(id)
//         setIsMenuOpen(false)
//       }}
//       className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${currentPage === id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
//     >
//       {React.cloneElement(icon, {className: 'w-5 h-5 mr-2'})}
//       {label}
//     </button>
//   )
//   return (
//     <header className="bg-white shadow-md sticky top-0 z-40">
//       <nav className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <Bus className="w-8 h-8 text-indigo-600" />
//             <span className="text-xl font-bold text-gray-800 ml-2">バス予約管理システム</span>
//           </div>
//           <div className="hidden md:flex space-x-2">
//             {navItems.map(item => (
//               <NavLink key={item.id} {...item} />
//             ))}
//           </div>
//           <div className="md:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
//               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>
//       </nav>
//       {isMenuOpen && (
//         <div className="md:hidden bg-white shadow-lg border-t">
//           <div className="p-4 space-y-2">
//             {navItems.map(item => (
//               <NavLink key={item.id} {...item} />
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }
// export default function BusScheduleMockupApp() {
//   const [currentPage, setCurrentPage] = useState('schedule')
//   return (
//     <DataProvider>
//       <div className="min-h-screen bg-gray-100 text-gray-800">
//         <AppHeader currentPage={currentPage} onNavigate={setCurrentPage} />
//         <main className="container mx-auto p-4">
//           <AppContent currentPage={currentPage} />
//         </main>
//       </div>
//     </DataProvider>
//   )
// }
// const AppContent = ({currentPage}) => {
//   const {isLoading, error} = useData()
//   if (isLoading) {
//     return <LoadingSpinner />
//   }
//   if (error) {
//     return <ErrorDisplay message={error} />
//   }
//   switch (currentPage) {
//     case 'schedule':
//       return <SchedulePage />
//     case 'myPage':
//       return <MyPage loggedInUserId={MOCK_LOGGED_IN_USER_ID} />
//     case 'master':
//       return <MasterManagementPage />
//     default:
//       return <div>ページが見つかりません。</div>
//   }
// }
