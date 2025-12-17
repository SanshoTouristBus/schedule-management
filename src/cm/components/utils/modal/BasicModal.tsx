'use client'
import React, {useState} from 'react'

import {basicModalPropType, ModalCore} from '@cm/components/utils/modal/ModalCore'

const BasicModal = React.memo((props: basicModalPropType) => {
  const [openState, setopenState] = useState(false)

  const open = props?.open ?? openState
  const setopen = props?.setopen ?? setopenState

  return <ModalCore {...{...props, open, setopen}} />
})

export default BasicModal
