import {ControlProps} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control'
import React, {useEffect, useRef, useState} from 'react'

const MyTextarea = React.forwardRef((props: ControlProps, ref) => {
  const {formProps, Register, col, controlContextValue} = props

  const {onChange} = Register
  const defaultHeight = col.form?.style?.height ?? 100

  const [height, setheight] = useState(defaultHeight)

  const textAreaStyle = {
    ...controlContextValue.ControlStyle,
    height,
  }

  const textAreaRef = useRef<any>(null)
  const self = textAreaRef.current
  const {scrollHeight} = self ?? {}

  useEffect(() => {
    AdjustHeight()
  }, [self, scrollHeight])

  const AdjustHeight = () => {
    if (textAreaStyle.height <= scrollHeight) {
      setheight(scrollHeight)
    }
  }

  const {inputProps, autoOpen} = col.inputProps ?? {}

  return (
    <div>
      <textarea
        {...{
          ...inputProps,
          style: {...textAreaStyle},
          className: formProps.className,
          ...Register,
          ref: e => {
            Register.ref(e)
            textAreaRef.current = e // you can still assign to ref
          },
          onChange: e => {
            AdjustHeight() //高さ緒性
            onChange(e)
          },
        }}
      />
    </div>
  )
})

export default MyTextarea
