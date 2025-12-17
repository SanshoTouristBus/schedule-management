import {MarkDownDisplay} from 'src/cm/components/utils/texts/MarkdownDisplay'
import React, {useState, useEffect, useMemo} from 'react'

const Typewriter = (props: {children: string; delay?: number; startAfter?: number} & any) => {
  const {children, startAfter = 1000, ...rest} = props

  const text = children
  const delay = useMemo(() => {
    return props.delay ? props.delay : 100
  }, [])

  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    let currentText = ''
    let i = 0

    // 文字列を一文字ずつ追加する関数
    const type = async () => {
      if (i < text.length) {
        currentText += text.charAt(i)
        setTypedText(currentText)
        i++
        setTimeout(type, delay) // delay ミリ秒後に次の文字を追加
      }
    }

    setTimeout(() => {
      type()
    }, startAfter)
  }, [text]) // text または delay が変わったときに効果を再実行

  // return <div {...rest}>{typedText}</div>
  return <MarkDownDisplay {...rest}>{typedText}</MarkDownDisplay>
}

export default Typewriter
