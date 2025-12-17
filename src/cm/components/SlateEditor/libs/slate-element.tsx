import {useSlateStatic, useReadOnly, ReactEditor, useSelected} from 'slate-react'

import {Transforms, Element as SlateElement} from 'slate'
import {cl} from 'src/cm/lib/methods/common'

import {slateStylesOnMark} from 'src/cm/components/SlateEditor/libs/slate-constants'
import {T_LINK} from '@cm/components/styles/common-components/links'

export const getSlateElements = () => {
  return {
    CodeElement: props => {
      return (
        <pre {...props.attributes}>
          <code>{props.children}</code>
        </pre>
      )
    },

    DefaultElement: props => {
      return <p {...props.attributes}>{props.children}</p>
    },
    CheckListItemElement: ({attributes, children, element}) => {
      const editor = useSlateStatic()
      const readOnly = useReadOnly()
      const {checked} = element

      return (
        <div {...attributes} className={`row-stack  `}>
          <span contentEditable={false} className={`mr-2`}>
            <input
              type="checkbox"
              checked={checked}
              onChange={event => {
                const path = ReactEditor.findPath(editor, element)
                const newProperties: Partial<SlateElement> = {
                  checked: event.target.checked,
                }
                Transforms.setNodes(editor, newProperties, {at: path})
              }}
            />
          </span>
          <span
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className={` flex    ${checked ? 'line-through opacity-60' : ' '}`}
          >
            {children}
          </span>
        </div>
      )
    },

    LinkElement: ({attributes, children, element}) => {
      const InlineChromiumBugfix = () => (
        <span contentEditable={false} className={'text-[0px]'}>
          {String.fromCodePoint(160) /* Non-breaking space */}
        </span>
      )
      const selected = useSelected()
      return (
        <T_LINK
          onClick={e => {
            e.preventDefault()
            if (!element.url) return alert('urlがありません')

            window.open(element.url, '_blank')
          }}
          {...attributes}
          href={element.url ?? ''}
          className={cl(selected ? '' : '', 't-link cursor-pointer')}
        >
          {/* <InlineChromiumBugfix /> */}
          {children}
          {/* <InlineChromiumBugfix /> */}
        </T_LINK>
      )
    },
  }
}

export const getSlateLeafs = () => {
  return {
    Leaf: props => {
      const {leaf} = props
      let styles = {}
      Object.keys(slateStylesOnMark.style).forEach(key => {
        if (!leaf[key]) return
        styles = {...styles, ...slateStylesOnMark.style[key]}
      })

      const classNameArr: any[] = []
      Object.keys(slateStylesOnMark.className).forEach(key => {
        if (!leaf[key]) return
        classNameArr.push(slateStylesOnMark.className[key])
      })
      const className = cl(...classNameArr)

      return (
        <span className={className} {...props.attributes} style={styles}>
          {props.children}
        </span>
      )
    },
  }
}
