'use client'

import { CenterScreen, C_Stack } from '@cm/components/styles/common-components/common-components'
import { T_LINK } from '@cm/components/styles/common-components/links'

const TopPage = () => {




  if (process.env.NEXT_PUBLIC_ROOTPATH === `QRBP`) {
    return (
      <CenterScreen>
        <C_Stack>
          <T_LINK href={`/QRBP`}>BPアプリ</T_LINK>
          <T_LINK href={`/newCar`}>納期CSアプリ</T_LINK>
        </C_Stack>
      </CenterScreen>
    )
  } else if (process.env.NEXT_PUBLIC_ROOTPATH === `shinren`) {
    return (
      <CenterScreen>
        <C_Stack>
          <T_LINK href={`/shinren`}>日報アプリ</T_LINK>
        </C_Stack>
      </CenterScreen>
    )
  }
}

export default TopPage
