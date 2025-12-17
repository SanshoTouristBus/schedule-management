type changeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLSelectElement>
  | React.ChangeEvent<HTMLTextAreaElement>
type blurEvent = React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLSelectElement> | React.FocusEvent<HTMLTextAreaElement>

type formPropType = {
  label?: string
  id?: string
  name?: string
  value?: string
  checked?: boolean
  type?: 'text' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'readonly' | 'checkbox' | 'radio'
  onChange?: (e: changeEvent) => void
  onBlur?: (e: blurEvent) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  rows?: number
  cols?: number
}
