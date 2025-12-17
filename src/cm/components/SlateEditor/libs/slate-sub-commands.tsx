import {AnyElement, CustomElement} from '@cm/types/slate-types'
import {Transforms, Editor, Element as SlateElement, Range} from 'slate'

export const getSubCommands = () => {
  const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, {
      match: (n: CustomElement) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })

    return !!link
  }

  const insertLink = (editor, url) => {
    if (editor.selection) {
      wrapLink(editor, url)
    }
  }

  const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
  }
  const wrapLink = (editor, url: string) => {
    const isLinkActive = editor => {
      const [link] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
      })
      return !!link
    }

    if (isLinkActive(editor)) {
      unwrapLink(editor)
    }

    const {selection} = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link: AnyElement = {
      type: 'link',
      url,
      children: isCollapsed ? [{text: url}] : [],
    }

    if (isCollapsed) {
      Transforms.insertNodes(editor, link)
    } else {
      Transforms.wrapNodes(editor, link, {split: true})
      Transforms.collapse(editor, {edge: 'end'})
    }
  }

  const isButtonActive = editor => {
    const [button] = Editor.nodes(editor, {
      match: (n: CustomElement) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'button',
    })
    return !!button
  }

  const unwrapButton = editor => {
    Transforms.unwrapNodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'button',
    })
  }
  const wrapButton = editor => {
    if (isButtonActive(editor)) {
      unwrapButton(editor)
    }

    const {selection} = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const button: AnyElement = {
      type: 'button',
      children: isCollapsed ? [{text: 'Edit me!'}] : [],
    }

    if (isCollapsed) {
      Transforms.insertNodes(editor, button)
    } else {
      Transforms.wrapNodes(editor, button, {split: true})
      Transforms.collapse(editor, {edge: 'end'})
    }
  }
  const insertButton = editor => {
    if (editor.selection) {
      wrapButton(editor)
    }
  }

  return {
    insertLink,
    isLinkActive,
    unwrapLink,
    wrapLink,

    isButtonActive,
    insertButton,
    wrapButton,
    unwrapButton,
  }
}
