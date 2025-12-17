'use client'
import {ControlProps} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control'

import React, {useEffect} from 'react'
import useFileUploadPropsOptimized from '@cm/hooks/useFileUpload/useFileUploadPropsOptimized'

const MyFileControl = React.forwardRef((props: ControlProps, ref) => {
  const {col, ReactHookForm, Register, currentValue, setextraFormState} = props

  const {
    component: {FileUploaderMemo},
    fileUploadIsReady,
    fileArrState,
  } = useFileUploadPropsOptimized({
    maxFiles: 1,
    readAs: 'readAsDataURL',
    accept: col?.form?.file?.accept ?? {
      'image/png': [],
      'image/jpg': ['.jpg', '.jpeg'],
    },
  })

  useEffect(() => {
    if (fileUploadIsReady) {
      const {name} = Register
      ReactHookForm.setValue(name, currentValue ?? pathToNoImage)

      setextraFormState(prev => {
        return {
          ...prev,
          files: {
            [name]: fileArrState,
          },
        }
      })
    } else {
      ReactHookForm.setValue(Register.name, null)
    }
  }, [fileUploadIsReady])

  return <div className={col?.form?.disabled ? 'disabled' : ''}>{FileUploaderMemo}</div>
})

export default MyFileControl

export const pathToNoImage = `/image/utils/noImage.jpg`
