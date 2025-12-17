'use client'
import {signOut} from 'next-auth/react'
import {useEffect} from 'react'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'

const LogoutForm = () => {
  const {router, toggleLoad, session, query} = useGlobal()

  useEffect(() => {
    if (session?.id) {
      const logout = async () => {
        toggleLoad(async () => {
          const res = await signOut({redirect: false})
          router.refresh()
        })
      }
      logout()
    }
  }, [session?.id])

  return <></>
}

export default LogoutForm
