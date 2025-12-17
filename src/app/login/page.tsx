'use client'
import React from 'react'
import {Absolute, C_Stack} from 'src/cm/components/styles/common-components/common-components'
import Redirector from 'src/cm/components/utils/Redirector'
import PlaceHolder from 'src/cm/components/utils/loader/PlaceHolder'
import LoginForm from './LoginForm'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import useModal from '@cm/components/utils/modal/useModal'
const AdminLogin = props => {
  const {session, query} = useGlobal()

  const {rootPath, error} = query

  const redirectRoot = session?.app ? session?.app : (rootPath ?? process.env.NEXT_PUBLIC_ROOTPATH)
  const REDIRECT_CON1_redirectBySession = session?.id && redirectRoot
  const REDIRECT_CON2_NO_LOGIN = process.env.NEXT_PUBLIC_NO_LOGIN === 'true' && redirectRoot
  const doRedirect = REDIRECT_CON2_NO_LOGIN || REDIRECT_CON1_redirectBySession
  if (!session) {
    return <PlaceHolder />
  }

  if (doRedirect && session?.id) {
    return <Redirector redirectPath={`/${redirectRoot}`} />
  }

  const UserEditModalReturn = useModal<{userId: number}>()

  return (
    <Absolute className={`w-full p-4`}>
      <C_Stack className={`items-center gap-4`}>
        <LoginForm {...{rootPath, error}} />
      </C_Stack>
    </Absolute>
  )
}

export default AdminLogin
