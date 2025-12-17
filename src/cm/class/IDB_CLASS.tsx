import {set, get, getMany, keys, update, del} from 'idb-keyval'

import {v4 as uuidv4} from 'uuid'

export interface IDB_Single_Item {
  id?: string | number
  updatedAt?: Date
  [key: string]: any
}

export type IDB_Model_Key = string | 'lightMaster'

export interface UpsertParams {
  key: IDB_Model_Key
  data: IDB_Single_Item
  setdatabase?: (updater: (prev: any) => any) => void
}

export interface DeleteParams {
  key: IDB_Model_Key
  id: string | number
  setdatabase?: (updater: (prev: any) => any) => void
}

export interface IDBOperationResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface IDBStats {
  totalKeys: number
  keyNames: string[]
  lastUpdated: Date
}

const generateId = (): string => uuidv4()

const createTimestamp = (): Date => new Date()

const isValidId = (id: any): id is string | number => {
  return (typeof id === 'string' && id.length > 0) || (typeof id === 'number' && !isNaN(id))
}

const safeJsonStringify = (data: any): string => {
  try {
    return JSON.stringify(data)
  } catch (error) {
    console.warn('Failed to stringify data:', error)
    return String(data)
  }
}

export class IDB_CLASS {
  static single = {
    deleteById: async (params: DeleteParams): Promise<IDBOperationResult<IDB_Single_Item[]>> => {
      const {key, id, setdatabase} = params

      if (!isValidId(id)) {
        return {
          success: false,
          error: 'Invalid ID provided',
        }
      }

      try {
        const currentArray = await IDB_CLASS.array.read(key)

        if (!Array.isArray(currentArray)) {
          return {
            success: false,
            error: 'Data is not an array',
          }
        }

        const filteredArray = currentArray.filter(item => item.id !== id)

        await IDB_CLASS.array.save(key, filteredArray)

        if (setdatabase) {
          setdatabase(prev => ({...prev, [key]: filteredArray}))
        }

        return {
          success: true,
          data: filteredArray,
        }
      } catch (error) {
        console.error('Error in deleteById:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },

    getById: async (key: IDB_Model_Key, id: string | number): Promise<IDBOperationResult<IDB_Single_Item | null>> => {
      if (!isValidId(id)) {
        return {
          success: false,
          error: 'Invalid ID provided',
        }
      }

      try {
        const array = await IDB_CLASS.array.read(key)

        if (!Array.isArray(array)) {
          return {
            success: true,
            data: null,
          }
        }

        const item = array.find(item => item.id === id) || null

        return {
          success: true,
          data: item,
        }
      } catch (error) {
        console.error('Error in getById:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },

    exists: async (key: IDB_Model_Key, id: string | number): Promise<boolean> => {
      const result = await IDB_CLASS.single.getById(key, id)
      return result.success && result.data !== null
    },
  }

  static array = {
    save: async <T = any,>(key: IDB_Model_Key, data: T): Promise<IDBOperationResult<void>> => {
      try {
        await set(key, data)
        return {success: true}
      } catch (error) {
        console.error('Error in save:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Save failed',
        }
      }
    },

    read: async <T = any,>(key: IDB_Model_Key): Promise<T | null> => {
      try {
        const result = await get(key)
        return result ?? null
      } catch (error) {
        console.error('Error in read:', error)
        return null
      }
    },

    upsertItemInArray: async (params: UpsertParams): Promise<IDBOperationResult<IDB_Single_Item[]>> => {
      const {key, data, setdatabase} = params

      if (!data || typeof data !== 'object') {
        return {
          success: false,
          error: 'Invalid data provided',
        }
      }

      try {
        const refreshedDataArr = await IDB_CLASS.updateIDB(key, (oldArray: IDB_Single_Item[]) => {
          if (!Array.isArray(oldArray)) {
            oldArray = []
          }

          const existingIndex = oldArray.findIndex(item => item.id === data.id)

          const newItem: IDB_Single_Item = {
            ...data,
            id: data.id ?? generateId(),
            updatedAt: createTimestamp(),
          }

          if (existingIndex !== -1) {
            oldArray[existingIndex] = newItem
          } else {
            oldArray.push(newItem)
          }

          return oldArray
        })

        if (setdatabase && refreshedDataArr) {
          setdatabase(prev => ({...prev, [key]: refreshedDataArr}))
        }

        return {
          success: true,
          data: refreshedDataArr || [],
        }
      } catch (error) {
        console.error('Error in upsertItemInArray:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Upsert failed',
        }
      }
    },

    getLength: async (key: IDB_Model_Key): Promise<number> => {
      try {
        const array = await IDB_CLASS.array.read(key)
        return Array.isArray(array) ? array.length : 0
      } catch (error) {
        console.error('Error in getLength:', error)
        return 0
      }
    },

    clear: async (key: IDB_Model_Key): Promise<IDBOperationResult<void>> => {
      try {
        await del(key)
        return {success: true}
      } catch (error) {
        console.error('Error in clear:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Clear failed',
        }
      }
    },
  }

  static async getIDB_Keys(): Promise<IDBOperationResult<any[]>> {
    try {
      const keyList = await keys()
      return {
        success: true,
        data: keyList,
      }
    } catch (error) {
      console.error('Error reading keys from IndexedDB:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get keys',
      }
    }
  }

  static async getManyFromIDB<T = any>(keys: IDB_Model_Key[]): Promise<IDBOperationResult<T[]>> {
    if (!Array.isArray(keys) || keys.length === 0) {
      return {
        success: false,
        error: 'Invalid keys array',
      }
    }

    try {
      const results = await getMany(keys)
      return {
        success: true,
        data: results,
      }
    } catch (error) {
      console.error('Error in getManyFromIDB:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get multiple items',
      }
    }
  }

  static async updateIDB<T = any>(key: IDB_Model_Key, updater: (oldValue: T) => T): Promise<T | null> {
    if (typeof updater !== 'function') {
      console.error('Updater must be a function')
      return null
    }

    try {
      await update(key, updater)
      const refreshedData = await IDB_CLASS.array.read<T>(key)
      return refreshedData
    } catch (error) {
      console.error('Error updating IndexedDB:', error)
      return null
    }
  }

  static async getStats(): Promise<IDBOperationResult<IDBStats>> {
    try {
      const keysResult = await IDB_CLASS.getIDB_Keys()

      if (!keysResult.success || !keysResult.data) {
        return {
          success: false,
          error: 'Failed to get database keys',
        }
      }

      const stats: IDBStats = {
        totalKeys: keysResult.data.length,
        keyNames: keysResult.data.map(key => String(key)),
        lastUpdated: createTimestamp(),
      }

      return {
        success: true,
        data: stats,
      }
    } catch (error) {
      console.error('Error getting stats:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get stats',
      }
    }
  }

  static async backup(): Promise<IDBOperationResult<Record<string, any>>> {
    try {
      const keysResult = await IDB_CLASS.getIDB_Keys()

      if (!keysResult.success || !keysResult.data) {
        return {
          success: false,
          error: 'Failed to get database keys for backup',
        }
      }

      const keyStrings = keysResult.data.map(key => String(key))
      const dataResult = await IDB_CLASS.getManyFromIDB(keyStrings)

      if (!dataResult.success) {
        return {
          success: false,
          error: 'Failed to get data for backup',
        }
      }

      const backup: Record<string, any> = {}
      keyStrings.forEach((key, index) => {
        backup[key] = dataResult.data?.[index]
      })

      return {
        success: true,
        data: backup,
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Backup failed',
      }
    }
  }

  static async restore(backupData: Record<string, any>): Promise<IDBOperationResult<void>> {
    if (!backupData || typeof backupData !== 'object') {
      return {
        success: false,
        error: 'Invalid backup data',
      }
    }

    try {
      const promises = Object.entries(backupData).map(([key, data]) => IDB_CLASS.array.save(key, data))

      await Promise.all(promises)

      return {success: true}
    } catch (error) {
      console.error('Error restoring backup:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Restore failed',
      }
    }
  }
}
