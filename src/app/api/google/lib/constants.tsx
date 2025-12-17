import {basePath} from 'src/cm/lib/methods/common'
export const redirectUri = `${basePath}/google/api/oauth2callback`
export const createEventPath = `${basePath}/google/calendar/event`

export const getCookie = name => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}
