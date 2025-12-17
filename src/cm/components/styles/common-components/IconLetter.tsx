import {cl} from 'src/cm/lib/methods/common'
import {CSSProperties, ReactNode, ComponentType} from 'react'

type Props = {
  Icon: ComponentType<any>
  colorClass?: string
  children?: ReactNode
  style?: CSSProperties
  className?: string
}
const IconLetter = (props: Props) => {
  const {Icon, colorClass = '', children, style, className} = props
  return (
    <div className={`row-stack w-fit gap-1 ${className}`}>
      <Icon strokeWidth={2.5} className={cl(`h-6 w-6  p-[3px]  text-sky-700   `, colorClass)} style={style} />
      {children}
    </div>
  )
}

export default IconLetter
