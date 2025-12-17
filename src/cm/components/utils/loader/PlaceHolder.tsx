import {CSSProperties} from 'react'

export default function PlaceHolder(props: {style?: CSSProperties; className?: string; children?: any}) {
  const {style, className, children} = props

  return <div className="text-center p-2 bg-gray-100 rounded">{children}</div>
  // return (
  //   <Center
  //     {...{
  //       className: twMerge(' relative mb-2  p-3 min-h-8 animate-pulse  rounded-md  bg-gray-300/80 ', className),
  //       style,
  //     }}
  //   >
  //     {children}
  //   </Center>
  // )
}
