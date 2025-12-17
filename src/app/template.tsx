'use client'

import { Paper } from '@cm/components/styles/common-components/paper'
import { R_Stack } from '@cm/components/styles/common-components/common-components'
import { T_LINK } from '@cm/components/styles/common-components/links'

import GlobalTemplate from '@cm/components/layout/GlobalTemplate'

import React from 'react'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import { isDev } from '@cm/lib/methods/common'

export default function template({ children }) {
  const { session } = useGlobal()


  return <GlobalTemplate>{children}</GlobalTemplate>
}

//
