import useInitMySelect from '@cm/components/DataLogic/TFs/MyForm/components/HookFormControl/Control/MySelect/lib/useInitMySelect'
import {Button} from 'src/cm/components/styles/common-components/Button'
import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import React from 'react'
import {getColorStyles} from '@cm/lib/methods/colors'

export default function MyRadio(props) {
  const {contexts} = useInitMySelect(props)
  const {MySelectContextValue, controlContextValue} = contexts

  return (
    <R_Stack className={`  justify-start gap-1.5 pb-1`}>
      {MySelectContextValue.options.map((op, i) => {
        const isActive = op.id === controlContextValue.currentValue

        return (
          <div key={i}>
            <Button
              type={`button`}
              className={`rounded-sm text-[14px]`}
              onClick={() => {
                controlContextValue.ReactHookForm.setValue(controlContextValue.col.id, op.id)
                controlContextValue.field.onBlur()
              }}
              active={isActive}
              style={{...getColorStyles(op.color ?? `#202020`)}}
            >
              {op.label}
            </Button>
          </div>
        )
      })}
    </R_Stack>
  )
}
