'use client'
import React from 'react'

import {atomKey, useJotaiByKey} from '@cm/hooks/useJotai'
import {basicModalPropType, ModalCore} from '@cm/components/utils/modal/ModalCore'

const GlobalModal = React.memo((props: basicModalPropType & {id: string}) => {
  const modalId = `modal_${props.id}` as atomKey
  const [openState, setopenState] = useJotaiByKey<any>(modalId, null)
  const open = props?.open ?? openState
  const setopen = props?.setopen ?? setopenState
  return <ModalCore {...{...props, open, setopen}} />
})

export default GlobalModal
