'use client'
import {getEditableMethods} from 'src/cm/components/SlateEditor/libs/slate-editable-libs'

import {withHistory} from 'slate-history'

import React, {CSSProperties, useMemo, useState} from 'react'
import {createEditor, Descendant} from 'slate'
import {Slate, Editable, withReact} from 'slate-react'

import HoveringToolbar from 'src/cm/components/SlateEditor/HoveringToolBar/HoveringToolbar'
import {getWithMethods} from 'src/cm/components/SlateEditor/libs/slate-plugins'
import {CustomEditor} from '@cm/types/slate-types'
import {testInitialValue} from 'src/cm/components/SlateEditor/libs/slate-constants'

import {getTools} from 'src/cm/components/SlateEditor/SlateToolbar'

import {C_Stack} from 'src/cm/components/styles/common-components/common-components'
import {toJson} from 'src/cm/lib/methods/common'
import {MarkDownDisplay} from 'src/cm/components/utils/texts/MarkdownDisplay'

import {ControlContextType} from '@cm/types/form-control-type'

const SlateEditor = React.memo(
  (props: {
    style?: CSSProperties
    showToolbar?: boolean
    readOnly?: boolean
    initialValue?: Descendant[]
    onEditorChange?: (value: Descendant[]) => void
    children?: any
    controlContextValue?: ControlContextType
  }) => {
    const {showToolbar = false, readOnly = false, onEditorChange, controlContextValue} = props

    const {field} = controlContextValue ?? {}

    let initialValue = props.initialValue ?? props.children ?? testInitialValue

    if (toJson(initialValue)) {
      initialValue = toJson(initialValue)
    }

    if (!Array.isArray(initialValue)) {
      return <MarkDownDisplay>{initialValue}</MarkDownDisplay>
    }

    const With = getWithMethods()
    const withs = [withHistory, With.withInlines, With.withChecklists, withReact]

    const editor: CustomEditor = useMemo(() => {
      return withs.reduce((acc, withMethod) => {
        return withMethod(acc)
      }, createEditor())
    }, [])

    const [currentValue, setcurrentValue] = useState<any>(initialValue)
    const {renderElement, renderLeaf, onKeyDown} = getEditableMethods({editor})

    const {AddLinkButton, RemoveLinkButton, ToggleEditableButtonButton} = getTools({editor})

    return (
      <div
        className={readOnly ? `` : `formBackGround p-1`}
        style={{
          overflow: 'auto',
          ...props.style,
        }}
      >
        <Slate
          editor={editor}
          initialValue={currentValue}
          onValueChange={value => {
            onEditorChange?.(value)
          }}
        >
          <C_Stack className={`gap-4`}>
            {showToolbar && (
              <HoveringToolbar>
                <AddLinkButton />
                <RemoveLinkButton />
              </HoveringToolbar>
            )}
            <div>
              <Editable
                {...{
                  onBlur: field?.onBlur,
                  readOnly,
                  placeholder: '',
                  renderElement,
                  renderLeaf,
                  onKeyDown: event => onKeyDown({event, editor}),

                  // onKeyDown: onKeydownTest,
                }}
              />
            </div>
          </C_Stack>
        </Slate>
      </div>
    )
  }
)

export default SlateEditor
