'use client'

import {useSWRConfig} from 'swr'

export default function useMatchMutate() {
  const {cache, mutate, ...extraConfig} = useSWRConfig()

  return (matcher = /.+/, ...args) => {
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance')
    }
    const keys: any[] = []

    try {
      for (const key of cache.keys()) {
        if (matcher?.test(key)) {
          keys.push(key)
        }
      }
    } catch (error) {
      console.error(error.stack) //////////
    }

    const mutations = keys.map(key => {
      mutate(key, ...args)
    })

    return Promise.all(mutations)
  }
}
