import {BaseEditor, BaseRange, Range, Element, Descendant} from 'slate'
import {ReactEditor} from 'slate-react'
import {HistoryEditor} from 'slate-history'
import {elementcolTypeString, markString, slateOnKeyDownKeyStringType} from 'src/cm/components/SlateEditor/libs/slate-constants'
import {JSX} from 'react'
declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
    Range: BaseRange & {
      [key: string]: unknown
    }
  }
}

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>
  }

export type AnyElement = {
  checked?: boolean
  type?: elementcolTypeString
  level?: number
  url?: string
  children?: CustomText[]
}

export type CustomElement = AnyElement

export type CustomText = {
  // bold?: boolean
  // italic?: boolean
  // code?: boolean
  text: string
} & {
  [key in markString]?: boolean
}

export type EmptyText = {
  text: string
}

export type key_toolHandlerObjType = {[key in string]: toolHandlerType}
export type slateKeyDownParamsType = {
  [key in slateOnKeyDownKeyStringType]?: key_toolHandlerObjType
}
export type toolbarComponentType = (props: toolHandlerType & {editor: any; onClick: any}) => JSX.Element
export type toolHandlerType = {
  mark?: markString
  type?: elementcolTypeString
  group?: string
  toolbar?: {
    letter?: any
    component?: toolbarComponentType
  }
  downedKey?: slateOnKeyDownKeyStringType
  onKeyDown?: (props: any) => void
}

export type BlockQuoteElement = {
  type: 'block-quote'
  align?: string
  children: Descendant[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  align?: string
  children: Descendant[]
}

export type CheckListItemElement = {
  type: 'checkListItem'
  checked: boolean
  children: Descendant[]
}

export type EditableVoidElement = {
  type: 'editable-void'
  children: EmptyText[]
}

export type HeadingElement = {
  type: 'heading'
  align?: string
  children: Descendant[]
}

export type HeadingTwoElement = {
  type: 'heading-two'
  align?: string
  children: Descendant[]
}

export type ImageElement = {
  type: 'image'
  url: string
  children: EmptyText[]
}

export type LinkElement = {type: 'link'; url: string; children: Descendant[]}

export type ButtonElement = {type: 'button'; children: Descendant[]}

export type BadgeElement = {type: 'badge'; children: Descendant[]}

export type ListItemElement = {type: 'list-item'; children: Descendant[]}

export type MentionElement = {
  type: 'mention'
  character: string
  children: CustomText[]
}

export type ParagraphElement = {
  type: 'paragraph'
  align?: string
  children: Descendant[]
}

export type TableElement = {type: 'table'; children: any[]}

export type TableCellElement = {type: 'table-cell'; children: CustomText[]}

export type TableRowElement = {type: 'table-row'; children: any[]}

export type TitleElement = {type: 'title'; children: Descendant[]}

export type VideoElement = {type: 'video'; url: string; children: EmptyText[]}

export type CodeBlockElement = {
  type: 'code-block'
  language: string
  children: Descendant[]
}

export type CodeLineElement = {
  type: 'codeLine'
  children: Descendant[]
}

// export type CustomElement =
//   | BlockQuoteElement
//   | BulletedListElement
//   | CheckListItemElement
//   | EditableVoidElement
//   | HeadingElement
//   | HeadingTwoElement
//   | ImageElement
//   | LinkElement
//   | ButtonElement
//   | BadgeElement
//   | ListItemElement
//   | MentionElement
//   | ParagraphElement
//   | TableElement
//   | TableRowElement
//   | TableCellElement
//   | TitleElement
//   | VideoElement
//   | CodeBlockElement
//   | CodeLineElement
