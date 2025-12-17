import {Transforms, Editor, Element as SlateElement, Range, Point} from 'slate'

import isUrl from 'is-url'
import {getCommands} from 'src/cm/components/SlateEditor/libs/slate-commands'

export const getWithMethods = () => {
  return {
    withChecklists: editor => {
      const {deleteBackward} = editor
      editor.deleteBackward = (...args) => {
        const {selection} = editor
        if (selection && Range.isCollapsed(selection)) {
          const [match] = Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'checkListItem',
          })

          if (match) {
            const [, path] = match
            const start = Editor.start(editor, path)

            if (Point.equals(selection.anchor, start)) {
              const newProperties: Partial<SlateElement> = {
                type: 'paragraph',
              }
              Transforms.setNodes(editor, newProperties, {
                match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'checkListItem',
              })
              return
            }
          }
        }

        deleteBackward(...args)
      }

      return editor
    },
    withInlines: editor => {
      const {insertData, insertText, isInline, isElementReadOnly, isSelectable} = editor
      const {SUB_CMD} = getCommands({editor})

      editor.isInline = element => {
        return ['link', 'button', 'badge'].includes(element.type) || isInline(element)
      }

      // editor.isElementReadOnly = element => element.type === 'badge' || isElementReadOnly(element)

      // editor.isSelectable = element => element.type !== 'badge' && isSelectable(element)

      editor.insertText = text => {
        if (text && isUrl(text)) {
          SUB_CMD.wrapLink(editor, text)
        } else {
          insertText(text)
        }
      }

      editor.insertData = data => {
        const text = data.getData('text/plain')

        if (text && isUrl(text)) {
          SUB_CMD.wrapLink(editor, text)
        } else {
          insertData(data)
        }
      }

      return editor
    },
  }
}
