import {Center} from 'src/cm/components/styles/common-components/common-components'

import {ObjectMap} from 'src/cm/lib/methods/common'
import {CSSProperties} from 'react'
import {key_toolHandlerObjType, slateKeyDownParamsType, toolHandlerType} from '@cm/types/slate-types'
import {IconBtn} from '@cm/components/styles/common-components/IconBtn'

export type elementcolTypeString = 'checkListItem' | 'link' | 'code' | 'paragraph' | 'heading' | 'listItem' | 'button' | 'badge'

export type markString = 'bold' | 'italic' | 'underline' | 'codeLine' | 'fontSize1' | 'fontSize2' | 'fontSize3' | '-' | 'red'

export type slateOnKeyDownKeyStringType = 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey' | 'noShortCut'

const ctrlKeyOrMeta: key_toolHandlerObjType = {
  '-': {mark: undefined, type: `checkListItem`, toolbar: {letter: `ToDo`}},
  b: {mark: 'bold'},
  u: {mark: 'underline'},
  i: {mark: 'italic'},
  1: {mark: 'fontSize1', toolbar: {letter: `大`}, group: 'fontSize'},
  2: {mark: 'fontSize2', toolbar: {letter: `中`}, group: 'fontSize'},
  3: {mark: 'fontSize3', toolbar: {letter: `小`}, group: 'fontSize'},
}

const colors = [
  {letter: '赤', color: '#FF0000'},
  {letter: '橙', color: '#FF7F00'},
  {letter: '黄', color: '#FFFF00'},
  {letter: '緑', color: '#00FF00'},
  {letter: '青', color: '#0000FF'},
  {letter: '紫', color: '#8B00FF'},
  {letter: '白', color: '#FFFFFF'},
  {letter: '黒', color: '#000000'},
]

const colorKeys = Object.fromEntries(
  colors.map(d => {
    const {letter, color} = d
    const value = {mark: color, toolbar: {letter: <IconBtn rounded={true} color={color}></IconBtn>}, group: `color`}
    return [color, value]
  })
) as key_toolHandlerObjType
// export type shortCutKeystr = ctr

export const slateStylesOnMark: {
  style: {[key in markString]?: CSSProperties}
  className: {[key in markString]?: string}
} = {
  style: {
    bold: {fontWeight: 'bold', fontSize: '1.05em'},
    italic: {fontStyle: 'italic'},
    underline: {textDecoration: 'underline'},
    codeLine: {fontFamily: 'monospace', backgroundColor: '#eee', padding: '3px'},
    fontSize1: {fontSize: '1.2em'},
    fontSize2: {fontSize: '1em'},
    fontSize3: {fontSize: '0.8em'},
    ...Object.fromEntries(
      colors.map(d => {
        const {letter, color} = d
        return [color, {color: color}]
      })
    ),
  },
  className: {
    bold: '',
  },
}

export const getSlateKeyDownParams = () => {
  const slateKeyDownParams: slateKeyDownParamsType = {
    metaKey: {...ctrlKeyOrMeta},
    ctrlKey: {...ctrlKeyOrMeta},
    altKey: {},
    shiftKey: {},
    noShortCut: {...colorKeys},
  }

  Object.keys(slateKeyDownParams).forEach(key => {
    const marksOnSpecialKeyObject = slateKeyDownParams[key as slateOnKeyDownKeyStringType]
    slateKeyDownParams[key] = ObjectMap(marksOnSpecialKeyObject, (key, value: toolHandlerType) => {
      let toolbar = value.toolbar
      const {letter} = toolbar ?? {}

      toolbar = {
        letter: typeof letter == 'string' ? String(letter ?? key).toUpperCase() : letter,
        component: toolbar?.component ?? DefaultComponent,
      }

      return {...value, toolbar}
    })
  })

  const getTargetKeys = () => {
    const targetKeys = Object.values(slateKeyDownParams).map(obj => Object.keys(obj))
    return targetKeys
  }
  const getUniquedSlateKeyDownParams = () => {
    const {slateKeyDownParams} = getSlateKeyDownParams()

    const UniquedslateKeyDownParams: key_toolHandlerObjType = {}
    Object.keys(slateKeyDownParams).forEach((downedKey: slateOnKeyDownKeyStringType) => {
      const marksOnSpecialKey = slateKeyDownParams[downedKey] ?? {}
      Object.keys(marksOnSpecialKey).forEach(key => {
        if (UniquedslateKeyDownParams[key]) return
        UniquedslateKeyDownParams[key] = marksOnSpecialKey[key]
      })
    })

    return UniquedslateKeyDownParams as key_toolHandlerObjType
  }
  return {slateKeyDownParams, getTargetKeys, getUniquedSlateKeyDownParams}
}

export const DefaultComponent = (props: toolHandlerType & {editor: any; onClick: any}) => {
  const {mark, editor, toolbar, downedKey, onClick} = props

  return (
    <Center
      className={`
      onHover h-[30px] min-w-[30px] border-[1px] bg-gray-100 p-1   text-lg  font-bold`}
      onClick={onClick}
    >
      {toolbar?.letter}
    </Center>
  )
}

export const testInitialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to block nodes, you can create inline nodes. Here is a ',
      },
      {
        type: 'link',
        url: 'https://en.wikipedia.org/wiki/Hypertext',
        children: [{text: 'hyperlink'}],
      },
      {
        text: ', and here is a more unusual inline: an ',
      },
      {
        type: 'button',
        children: [{text: 'editable button'}],
      },
      {
        text: '! Here is a read-only inline: ',
      },
      {
        type: 'badge',
        children: [{text: 'Approved'}],
      },
      {
        text: '.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'There are two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected. ',
      },
      // The following is an example of an inline at the end of a block.
      // This is an edge case that can cause issues.
      {
        type: 'link',
        url: 'https://twitter.com/JustMissEmma/status/1448679899531726852',
        children: [{text: 'Finally, here is our favorite dog video.'}],
      },
      {text: ''},
    ],
  },
]
