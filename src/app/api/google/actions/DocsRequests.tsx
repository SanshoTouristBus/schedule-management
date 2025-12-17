import {docs_v1} from 'googleapis'

export type textInsertRequest = {
  text: string
  color?: string
  backgroundColor?: string
  alignment?: 'START' | 'CENTER' | 'END' | 'JUSTIFIED'
}

// ヘルパー関数群
export const DocsRequests = {
  insertText: (options: textInsertRequest & {startIndex?: number}) => {
    const {
      //
      startIndex = 1,
      text,
    } = options

    const insertTextRequest: docs_v1.Schema$Request = {insertText: {location: {index: startIndex}, text}}

    return insertTextRequest
  },

  updateStyleRequest: (options: textInsertRequest & {startIndex?: number}) => {
    const {
      //
      text,
      startIndex = 1,
      color = '#000000',
      backgroundColor = '#FFFFFF',
    } = options
    const textStyle = {
      foregroundColor: color ? {color: {rgbColor: colorCodeToRgb(color)}} : undefined,
      backgroundColor: backgroundColor ? {color: {rgbColor: colorCodeToRgb(backgroundColor)}} : undefined,
    }

    const range = {
      startIndex: startIndex,
      endIndex: startIndex ? startIndex + text.length : text.length,
    }
    const updateTextStyleRequest: docs_v1.Schema$Request = {
      updateTextStyle: {range, textStyle, fields: Object.keys(textStyle).join(', ')},
    }

    return updateTextStyleRequest
  },

  updateParagraphStyleRequest: (options: textInsertRequest & {startIndex?: number}) => {
    const {
      //
      text,
      startIndex = 1,
      alignment,
    } = options

    if (!alignment) return null

    const range = {
      startIndex: startIndex,
      endIndex: startIndex ? startIndex + text.length : text.length,
    }

    const paragraphStyle = {
      alignment: alignment,
    }

    const updateParagraphStyleRequest: docs_v1.Schema$Request = {
      updateParagraphStyle: {
        range,
        paragraphStyle,
        fields: 'alignment',
      },
    }

    return updateParagraphStyleRequest
  },

  setIndex: (textStyleUpdateRequest: textInsertRequest[]) => {
    // 何文字目まで書き込んだか
    let nextstartIndex = 1

    const result = textStyleUpdateRequest.map((data, i) => {
      const textRequest = DocsRequests.insertText({...data, startIndex: nextstartIndex})
      const updateTextStyleRequest = DocsRequests.updateStyleRequest({...data, startIndex: nextstartIndex})
      const updateParagraphStyleRequest = DocsRequests.updateParagraphStyleRequest({...data, startIndex: nextstartIndex})

      // 次の文字列の開始位置
      nextstartIndex += data.text.length

      return [textRequest, updateTextStyleRequest, updateParagraphStyleRequest].filter(Boolean)
    })

    const data = result.flat() as docs_v1.Schema$Request[]

    return data
  },
}

const colorCodeToRgb = (colorCodeStr: string) => {
  return {
    red: parseInt(colorCodeStr.slice(1, 3), 16) / 255,
    green: parseInt(colorCodeStr.slice(3, 5), 16) / 255,
    blue: parseInt(colorCodeStr.slice(5, 7), 16) / 255,
  }
}
