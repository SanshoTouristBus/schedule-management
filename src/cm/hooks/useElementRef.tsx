import {useEffect, useRef, useState} from 'react'

const useElementRef = (props?: {id?: string}) => {
  const TargetElementRef = useRef<any>(null)

  type rect = {
    left: number
    top: number
    width: number
    height: number
    bottom: number
    right: number
    x: number
    y: number
  }
  type TargetElementPropsType = {
    id: string
    self: any | null
    rect: rect
  }

  const [TargetElementProps, setTargetElementProps] = useState<TargetElementPropsType>({
    id: props?.id ?? '',
    self: null,
    rect: {left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0, x: 0, y: 0},
  })

  useEffect(() => {
    /**エレメント本人の取得 */
    const self = TargetElementRef?.current

    /**rectの取得 */
    let rect = {left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0, x: 0, y: 0}
    if (self) {
      rect = self.getBoundingClientRect()
    }

    setTargetElementProps(prev => {
      return {...prev, self, rect}
    })
  }, [TargetElementRef])

  return {
    TargetElementRef,
    TargetElementProps,
  }
}
export default useElementRef
