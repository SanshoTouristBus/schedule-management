'use client'
import useRedirect from 'src/cm/hooks/useRedirect'

import Loader from '@cm/components/utils/loader/Loader'

const Redirector = ({redirectPath}) => {
  useRedirect(true, redirectPath)

  return <Loader>Redirecting</Loader>
}

export default Redirector
