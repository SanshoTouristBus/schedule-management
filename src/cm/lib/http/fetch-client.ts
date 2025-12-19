import {anyObject} from '@cm/types/utility-types'

type fetchOptionType = {
  method?: string
  headers?: anyObject
  cache?: 'no-store' | 'force-cache'
  revalidate?: number
  tags?: string[]
}

export async function fetchAlt(url: string, body: any, defaultOptions?: fetchOptionType, usefetchPonyfill?: any): Promise<any> {
  const defaultRevalidate = 0

  const {
    method = 'POST',
    headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public',
    },
    revalidate = defaultRevalidate,
    tags = ['fetch-alt'],
  } = defaultOptions ?? {}

  const options: any = {
    method,
    headers,
    body: JSON.stringify(body),
    next: {revalidate, tags},
  }

  if (method === 'GET') {
    delete options.body
  }

  // const fetchMethod = usefetchPonyfill === false ? fetch : fetchPonyfill().fetch

  const result = await fetch(url, {...options})
    .then(async response => {
      const {status, headers, statusText} = response
      if (!response.status) {
        ;(console.error(`fetchAlt error [status:${status}, statusText:${statusText}] `), {url, body})
        const result = await response.json()
        console.error(result)
      }

      if (!response.ok) {
        const res = await response.json()
        console.error(res)
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    })
    .catch(error => {
      console.error(error.stack)
      return error
    })
  return result
}
