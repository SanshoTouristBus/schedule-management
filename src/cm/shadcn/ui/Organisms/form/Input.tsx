import Label from '@shadcn/ui/Organisms/form/Label'
import useFormProps from '@shadcn/ui/Organisms/form/useFormProps'
import React from 'react'
type inputProps = formPropType & {}
export default function Input(props: inputProps) {
  const {selectProps, customProps, label} = useFormProps(props)

  if (customProps.type === 'checkbox') {
    return (
      <div>
        <label className="flex items-center gap-1 text-sm cursor-pointer">
          <input {...customProps} />

          {label}
        </label>
      </div>
    )
  }
  return (
    <div className={` relative`}>
      <Label required={customProps.required}>{label}</Label>
      {props.type === 'textarea' ? <textarea {...customProps} /> : <input {...customProps} />}
    </div>
  )
}
