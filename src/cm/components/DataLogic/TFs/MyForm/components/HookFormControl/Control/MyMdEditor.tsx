import {ControlProps} from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control'
import {liftUpNewValueOnChange} from 'src/cm/components/DataLogic/TFs/MyForm/MyForm'
import SlateEditor from 'src/cm/components/SlateEditor/SlateEditor'
import {controlDefaultStyle} from 'src/cm/constants/defaults'
import {toJson} from 'src/cm/lib/methods/common'
import React from 'react'

const MyMdEditor = React.forwardRef((props: ControlProps, ref) => {
  const {formProps, Register, col, ReactHookForm, currentValue} = props

  const initialValue = toJson(currentValue)
    ? JSON.parse(currentValue)
    : [{type: 'paragraph', children: [{text: currentValue ?? col.form?.defaultValue ?? ''}]}]

  const textAreaStyle = {
    ...controlDefaultStyle,
    ...col?.form?.style,
  }

  return (
    <SlateEditor
      {...{
        controlContextValue: props.controlContextValue,
        style: textAreaStyle,
        showToolbar: true,
        initialValue,
        onEditorChange: slateValue => {
          liftUpNewValueOnChange({id: col.id, newValue: JSON.stringify(slateValue), ReactHookForm})
        },
      }}
    />
  )
})

export default MyMdEditor
