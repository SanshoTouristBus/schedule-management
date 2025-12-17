import {CustomEditor, toolHandlerType} from '@cm/types/slate-types'
import {Transforms, Editor, Element as SlateElement} from 'slate'

import {getSlateKeyDownParams} from 'src/cm/components/SlateEditor/libs/slate-constants'

import {getSubCommands} from 'src/cm/components/SlateEditor/libs/slate-sub-commands'

export const getCommands = ({editor}) => {
  const SUB_CMD = getSubCommands()
  return {
    SUB_CMD,
    toggleAnyMark: (props: {editor: CustomEditor; toolHandler: toolHandlerType}) => {
      const {editor, toolHandler} = props

      const {mark, onKeyDown} = toolHandler
      if (!mark) return

      const additionalValueObject = onKeyDown?.({editor, toolHandler})

      //mark指定がある場合
      const {slateKeyDownParams} = getSlateKeyDownParams()
      const marksOnTheSameGroup = Object.values(slateKeyDownParams)
        .map((obj: any) => {
          return Object.values(obj).flat()
        })
        .flat()
        .filter((obj: any) => {
          return toolHandler.group && obj.group === toolHandler?.group
        })

      if (marksOnTheSameGroup.length > 0) {
        marksOnTheSameGroup.forEach((obj: any) => {
          Editor.removeMark(editor, obj.mark)
        })
      }

      const marked = editor.getMarks()?.[mark]

      if (marked) {
        Editor.removeMark(editor, mark)
      } else {
        Editor.addMark(editor, mark, true)
      }
    },

    toggleType: (props: {editor: CustomEditor; toolHandler: toolHandlerType}) => {
      const {editor, toolHandler} = props
      const {type, onKeyDown} = toolHandler
      if (!type) return

      const additionalValueObject = onKeyDown?.({editor, toolHandler})

      const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === type,
      })

      Transforms.setNodes(
        editor,
        {type: match ? 'paragraph' : type},
        {match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n)}
      )
    },
  }
}
