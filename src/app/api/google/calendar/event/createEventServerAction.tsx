import {createEventPath} from '@app/api/google/lib/constants'
import {fetchAlt} from '@cm/lib/http/fetch-client'

export type eventCreateObjectPropsType = {
  calendarId: 'primary'
  requestBody: {
    summary: string
    description: string
    start: {dateTime: string}
    end: {dateTime: string}
  }
}
export const createGoogleCalendarEvent = async (props: {tokenId; email; eventCreateObjectProps: eventCreateObjectPropsType}) => {
  const {tokenId, email, eventCreateObjectProps} = props
  const res = await fetchAlt(createEventPath, {tokenId, email, eventCreateObjectProps})
  return res
}
