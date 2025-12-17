import {useEffect, useState} from 'react'
import {anyObject} from '@cm/types/utility-types'
type storageType = typeof localStorage | anyObject
function useLocalStorage(key, initialValue) {
  /**localStorageを取得 */
  const {localStorageClient, keys, storageUsageMb} = (() => {
    const [localStorageClient, setlocalStorage] = useState<storageType>()
    useEffect(() => {
      setlocalStorage(localStorage)
    }, [])

    const keys = Object.keys(localStorageClient ?? {})

    let total = 0
    for (const key in localStorageClient) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += key.length + localStorage[key].length
      }
    }
    const storageUsageMb = (total * 2) / 1000 / 1000
    return {localStorageClient, keys, storageUsageMb}
  })()

  /**基本関数 */
  const {refresh, value, setValue} = (() => {
    const refresh = () => {
      if (localStorageClient?.getItem) {
        const storedValue = localStorageClient.getItem(key)
        const value = storedValue ? JSON.parse(storedValue) : initialValue
        setValue(value)
      }
    }

    const [value, setValue] = useState(initialValue)
    useEffect(() => {
      if (localStorageClient) {
        refresh()
      }
    }, [localStorageClient])
    return {refresh, value, setValue}
  })()

  const clear = () => {
    localStorageClient?.removeItem(key)
    refresh()
  }

  const allReset = () => {
    keys.forEach(key => {
      localStorageClient?.removeItem(key)
    })
    refresh()
  }

  const setStoredValue = newValue => {
    if (typeof window === 'undefined') return
    setValue(newValue)
    localStorageClient?.setItem(key, JSON.stringify(newValue))
  }

  return {
    localStorage: localStorageClient,
    data: value,
    set: setStoredValue,
    clear,
    allReset,
  }
}

export default useLocalStorage
