import React, {useRef, useEffect, ReactNode, CSSProperties} from 'react'
import {useSlate, useFocused} from 'slate-react'
import ReactDOM from 'react-dom'
import {Editor, Range} from 'slate'

import {SlateToolbar} from 'src/cm/components/SlateEditor/SlateToolbar'

import {cl} from 'src/cm/lib/methods/common'
import {anyObject} from '@cm/types/utility-types'
import {Padding} from 'src/cm/components/styles/common-components/common-components'
import {Z_INDEX} from 'src/cm/lib/constants/constants'

const HoveringToolbar = (props: any) => {
  const editor = useSlate()
  const {selection} = editor
  const ref = useRef<any>(null)
  const inFocus = useFocused()

  const el = ref.current
  useEffect(() => {
    if (!el) {
      return
    }

    if (!selection || !inFocus || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection?.getRangeAt(0)

    const rect = domRange?.getBoundingClientRect() ?? {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      bottom: 0,
      right: 0,
    }

    el.style.position = 'absolute'
    el.style.opacity = '1'
    el.style.zIndex = Z_INDEX.modal
    el.style.top = `${rect.top + window.pageYOffset + el.offsetHeight}px`

    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`
  }, [selection])

  return (
    <Portal>
      <Menu
        ref={ref}
        {...{
          style: {
            padding: '8px 7px',
            position: 'absolute',
            zIndex: '1',
            top: '-10000px',
            left: '-10000px',
            marginTop: '-6px',
            opacity: '0',
            backgroudColor: '#222',
            transition: 'opacity 0.75s',
          },
          onMouseDown: e => {
            e.preventDefault()
          },
        }}
      >
        <Padding className={`bg-sub-main rounded-md  shadow-md`}>
          <SlateToolbar {...{editor}}>{props.children}</SlateToolbar>
        </Padding>
      </Menu>
    </Portal>
  )
}

export default HoveringToolbar
export const Portal = ({children}: {children?: ReactNode}) => {
  return typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null
}

export const Menu = React.forwardRef(
  (
    props: {
      style: CSSProperties
      className: string
    } & anyObject,
    ref: any
  ) => {
    const {style, className, ...rest} = props
    return <div {...props} style={style} data-test-id="menu" ref={ref} className={cl(className)} />
  }
)
