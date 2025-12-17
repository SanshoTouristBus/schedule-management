import {isDev} from '@cm/lib/methods/common'
import {toast} from 'react-toastify'

export const showSpendTime = async (cb: () => Promise<any>, showToast = isDev) => {
  const now = new Date()

  const result = await cb()

  if (showToast) {
    const time = new Date().getTime() - now.getTime()
    const formattedTime = time.toLocaleString()
    toast.info(`${formattedTime}ms`)
    return {result, formattedTime}
  }
  return {result, formattedTime: ''}
}
