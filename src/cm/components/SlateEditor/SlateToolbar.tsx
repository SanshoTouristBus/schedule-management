import {getCommands} from 'src/cm/components/SlateEditor/libs/slate-commands'

import {getSlateKeyDownParams} from 'src/cm/components/SlateEditor/libs/slate-constants'

import {IconBtn} from 'src/cm/components/styles/common-components/IconBtn'
IconBtn
import {useSlate} from 'slate-react'

import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {Fragment} from 'react'
import {key_toolHandlerObjType} from '@cm/types/slate-types'
import {LinkIcon} from 'lucide-react'

export const SlateToolbar = ({editor, children}) => {
  const {slateKeyDownParams, getUniquedSlateKeyDownParams} = getSlateKeyDownParams()

  const UniquedslateKeyDownParams: key_toolHandlerObjType = getUniquedSlateKeyDownParams()

  return (
    <R_Stack className={` flex-wrap gap-1.5`}>
      {Object.keys(UniquedslateKeyDownParams).map((key, i) => {
        const toolHandler = UniquedslateKeyDownParams[key]
        const {mark, type, toolbar, downedKey} = toolHandler
        const {letter, component} = toolbar ?? {}
        const onClick = () => {
          const SETTER = getCommands({editor})
          if (toolHandler.mark) {
            SETTER.toggleAnyMark({editor, toolHandler})
          }

          if (toolHandler.type) {
            SETTER.toggleType({editor, toolHandler})
          }
        }
        const Btn = component?.({editor, ...toolHandler, onClick})

        return <Fragment key={i}>{Btn}</Fragment>
      })}
      {children}
    </R_Stack>
  )
}

export const getTools = ({editor}) => {
  const {SUB_CMD} = getCommands({editor})

  const AddLinkButton = () => {
    const editor = useSlate()
    return (
      <IconBtn
        active={SUB_CMD.isLinkActive(editor)}
        onMouseDown={event => {
          event.preventDefault()
          const url = window.prompt('Enter the URL of the link:')
          if (!url) return
          SUB_CMD.insertLink(editor, url)
        }}
      >
        <span>
          <LinkIcon className={`w-6`} />
        </span>
      </IconBtn>
    )
  }

  const RemoveLinkButton = () => {
    const editor = useSlate()

    return (
      <IconBtn
        active={SUB_CMD.isLinkActive(editor)}
        onMouseDown={event => {
          if (SUB_CMD.isLinkActive(editor)) {
            SUB_CMD.unwrapLink(editor)
          }
        }}
      >
        <span>link off</span>
      </IconBtn>
    )
  }

  const ToggleEditableButtonButton = () => {
    const editor = useSlate()
    return (
      <IconBtn
        active
        onMouseDown={event => {
          event.preventDefault()
          if (SUB_CMD.isButtonActive(editor)) {
            SUB_CMD.unwrapButton(editor)
          } else {
            SUB_CMD.insertButton(editor)
          }
        }}
      >
        <span>smart_button</span>
      </IconBtn>
    )
  }
  return {
    AddLinkButton,
    RemoveLinkButton,
    ToggleEditableButtonButton,
  }
}
