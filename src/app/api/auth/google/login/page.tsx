'use client'
import {getAuthUrl} from '@app/api/auth/google/getAuthUrl'

import {Absolute} from '@cm/components/styles/common-components/common-components'
import {T_LINK} from '@cm/components/styles/common-components/links'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'

import React from 'react'
import useSWR from 'swr'

export default function login() {
  const {router} = useGlobal()
  const {data: authUrl} = useSWR(`/googleAuthLogin`, async () => {
    return await getAuthUrl()
  })

  if (authUrl) {
    return (
      <Absolute>
        <T_LINK href={authUrl ?? ''}>Google認証</T_LINK>
      </Absolute>
    )
  }
}
