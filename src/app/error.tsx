'use client' // Error components must be Client Components

import {Center, C_Stack} from 'src/cm/components/styles/common-components/common-components'
import BasicModal from 'src/cm/components/utils/modal/BasicModal'
import useMyNavigation from 'src/cm/hooks/globalHooks/useMyNavigation'
import {useEffect} from 'react'
import {Button} from '@cm/components/styles/common-components/Button'

export default function Error({error, reset}) {
  const {router} = useMyNavigation()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <>
      <Center>
        <C_Stack className={`items-center gap-10`}>
          <h2>再読み込みしてください</h2>
          <Button onClick={() => router.refresh()}>再読み込み</Button>
        </C_Stack>
      </Center>
      <div className={`fixed  bottom-4 right-4`}>
        <BasicModal Trigger={<div className={`text-gray-50`}>_</div>}>
          <div className={`p-4`}>{error.message}</div>
        </BasicModal>
      </div>
    </>
  )
}
