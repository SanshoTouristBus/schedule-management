import {MarkDownDisplay} from '@cm/components/utils/texts/MarkdownDisplay'
import {toast} from 'react-toastify'
import {requestResultType} from '@cm/types/types'

export const toastByResult = (result: requestResultType) => {
  const {success, message, error} = result
  if (success === true) {
    toast.success(<MarkDownDisplay>{message}</MarkDownDisplay>)
  } else if (success === false) {
    // console.info(`ToasByResultエラー: ${message}`)
    toast.error(message)
  }
}
