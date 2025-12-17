import axios from 'axios'
import {toast} from 'react-toastify'

export const fetcher = (resource: {url: string; method?: string; body?: any; isOnline?: boolean}) => {
  const url = resource?.url ?? resource
  const method = resource?.method?.toLowerCase() ?? 'post'
  const body = resource?.body

  const {isOnline} = resource
  if (isOnline === false) {
    return {}
  }

  return axios[method](url, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      return res.data
    })
    .catch(error => {
      if (process.env.NODE_ENV === 'development') {
        console.error(error.stack)
        // 開発環境でのみ詳細ログ
      }
      // if (error.response) {
      //   console.info(error.response.data)
      //   console.info(error.response.status) // 例：400
      //   console.info(error.response.statusText) // Bad Request
      //   console.info(error.response.headers)
      // } else if (error.request) {
      //   console.info(error.request)
      // } else {
      //   console.info('Error', error.message)
      // }

      toast.error(`通信エラーが発生しました。`)

      return {error}
    })
}
