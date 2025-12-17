import {cl} from 'src/cm/lib/methods/common'
import React, {ReactNode, PropsWithChildren} from 'react'
import ReactDOM from 'react-dom'

interface BaseProps {
  className: string
  [key: string]: unknown
}
type OrNull<T> = T | null

export const SlateButton = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
    >,
    ref: any
  ) => (
    <span
      {...props}
      ref={ref}
      style={{
        color: reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc',
      }}
    />
  )
)

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any
      } & BaseProps
    >,
    ref: any
  ) => {
    const textLines = value.document.nodes
      .map(node => node.text)
      .toArray()
      .join('\n')
    return (
      <div ref={ref} {...props} className={cl(className)}>
        <div
          style={{
            fontSize: 14,
            padding: '5px 20px',
            color: '#404040',
            borderTop: ' 2px solid#eeeeee',
            background: '#f8f8f8',
          }}
        >
          Slate's value as text
        </div>
        <div
          style={{
            color: '#404040;',
          }}
        >
          {textLines}
        </div>
      </div>
    )
  }
)

export const Instruction = React.forwardRef(({className, ...props}: PropsWithChildren<BaseProps>, ref: any) => (
  <div {...props} ref={ref} />
))

export const Menu = React.forwardRef(({className, ...props}: PropsWithChildren<BaseProps>, ref: any) => (
  <div {...props} data-test-id="menu" ref={ref} />
))

export const Portal = ({children}: {children?: ReactNode}) => {
  return typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null
}

export const Toolbar = React.forwardRef(({className, ...props}: PropsWithChildren<BaseProps>, ref: any) => (
  <Menu {...props} ref={ref} />
))

export const Icon = React.forwardRef(({className, ...props}: PropsWithChildren<BaseProps>, ref: any) => (
  <span {...props} ref={ref} />
))
