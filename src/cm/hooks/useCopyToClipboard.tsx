import {useRef, useState} from 'react'

const useCopyToClipboard = () => {
  const copyTargetRef = useRef<any>(null)
  const [copiedText, setcopiedText] = useState<any>(null)

  const copyToClipboard = () => {
    const text = copyTargetRef.current ? copyTargetRef.current?.innerText : ''

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setcopiedText(text)
    } else {
      console.error('Clipboard API is not available')
    }
  }

  return {copyTargetRef, copiedText, setcopiedText, copyToClipboard}
}

export default useCopyToClipboard
