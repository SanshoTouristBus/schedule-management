import Loader from '@cm/components/utils/loader/Loader'
import React, {useState} from 'react'

export default function useLocalLoading() {
  const [localLoading, setlocalLoading] = useState(false)
  const toggleLocalLoading = async cb => {
    setlocalLoading(true)
    const res = await cb()
    setlocalLoading(false)
    return res
  }

  const LocalLoader = ({children}: {children?: React.ReactNode}) => {
    return <div>{localLoading && <Loader>{children ?? `Loading`}</Loader>}</div>
  }

  return {
    LocalLoader,
    toggleLocalLoading,
  }
}
