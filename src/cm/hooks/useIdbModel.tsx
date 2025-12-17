'use client'

import {set, get, update} from 'idb-keyval'

import {useState} from 'react'
import {IDB_Model_Key} from '@cm/class/IDB_CLASS'
import useSWR from 'swr'

export const useIdbModel = ({key, defaultValue}) => {
  const [valueChanged, setvalueChanged] = useState(0)
  const {data} = useSWR(
    JSON.stringify({
      valueChanged,
      key,
      defaultValue,
    }),
    async () => {
      const currentValue = (await get(key)) || defaultValue
      return currentValue
    }
  )

  const handler = async cb => {
    setvalueChanged(prev => (prev += 1))
    return await cb()
  }
  const readModel = async (key: IDB_Model_Key) => {
    return handler(async () => await get(key))
  }

  const createModel = async (key: IDB_Model_Key) => {
    await set(key, defaultValue[key])
    return handler(async () => await get(key))
  }
  type updater = (oldValue: any) => any
  const updateModel = async (validator: updater) => {
    await update(key, validator)

    return handler(async () => await get(key))
  }
  const initModelItem = async () => {
    await set(key, defaultValue[key])
    return handler(async () => await get(key))
  }

  return {
    data,
    readModel,
    createModel,
    updateModel,
    initModelItem,
  }
}

export default useIdbModel
