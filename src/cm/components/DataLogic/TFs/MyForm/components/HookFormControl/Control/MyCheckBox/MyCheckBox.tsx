import {liftUpNewValueOnChange} from 'src/cm/components/DataLogic/TFs/MyForm/MyForm'
import React from 'react'
import {anyObject} from '@cm/types/utility-types'
const MyCheckBox = React.forwardRef((props: anyObject, ref) => {
  const {field, records, ReactHookForm, col, currentValue, Register, formProps, latestFormData} = props

  const {onChange} = Register

  const ischecked = currentValue

  const newValue = !ischecked

  return (
    <div
      className=" flex  h-7 flex-col gap-y-4"
      onClick={async e => {
        liftUpNewValueOnChange({id: col.id, newValue: newValue, ReactHookForm})
        field.onBlur()
      }}
    >
      <button
        {...{
          id: 'toggle-switch',
          type: 'button',
          role: 'switch',
          'aria-checked': currentValue,
        }}
        className="aria-checked:bg-primary-main group mt-1 flex h-5 w-[40px] overflow-hidden rounded-xl bg-slate-400 p-1 outline-hidden transition-colors duration-200 ease-in-out focus-visible:ring-3 focus-visible:ring-blue-400"
      >
        <span className="h-3 w-3 rounded-full bg-white transition-transform duration-200 ease-in-out group-aria-checked:translate-x-[20px]"></span>
      </button>
    </div>
  )
})

export default MyCheckBox
