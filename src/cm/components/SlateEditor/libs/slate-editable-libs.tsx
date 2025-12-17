import {key_toolHandlerObjType} from '@cm/types/slate-types'

import {getSlateKeyDownParams} from 'src/cm/components/SlateEditor/libs/slate-constants'

import {getSlateElements, getSlateLeafs} from 'src/cm/components/SlateEditor/libs/slate-element'
import {getCommands} from 'src/cm/components/SlateEditor/libs/slate-commands'

export const getEditableMethods = ({editor}) => {
  const SE = getSlateElements()
  const {Leaf} = getSlateLeafs()
  return {
    renderElement: props => {
      const selectedType = props.element.type
      switch (selectedType) {
        case 'code':
          return <SE.CodeElement {...props} />
        case 'checkListItem':
          return <SE.CheckListItemElement {...props} />
        case 'link':
          return <SE.LinkElement {...props} />
        default:
          return <SE.DefaultElement {...props} />
      }
    },

    renderLeaf: props => {
      return <Leaf {...props} />
    },

    onKeyDown: ({event, editor}) => {
      const {selection} = editor
      const {slateKeyDownParams, getTargetKeys} = getSlateKeyDownParams()

      const eventKeys = Object.keys(slateKeyDownParams)

      eventKeys.forEach(specialKey => {
        if (event[specialKey]) {
          const toolHandlerObject: key_toolHandlerObjType = slateKeyDownParams[specialKey]
          const toolHandler = toolHandlerObject[event.key] ?? {}

          const SETTER = getCommands({editor})

          if (toolHandler.mark) {
            event.preventDefault()
            SETTER.toggleAnyMark({editor, toolHandler})
          }

          if (toolHandler.type) {
            event.preventDefault()
            SETTER.toggleType({editor, toolHandler})
          }
        }
      })
    },
  }
}
