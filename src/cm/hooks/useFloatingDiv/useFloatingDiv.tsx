import {C_Stack, Center, R_Stack} from '@cm/components/styles/common-components/common-components'

import {judgeIfOutside} from '@cm/hooks/useFloatingDiv/judgeIfOutside'
import {setDivPosition} from '@cm/hooks/useFloatingDiv/setDivPosition'

import {Z_INDEX} from '@cm/lib/constants/constants'
import {GridIcon} from 'lucide-react'
import {useState, useCallback, useRef, CSSProperties, useEffect} from 'react'

const useFloatingDiv = (props?: {defaultPosition?: {x: number; y: number}}) => {
  const localStoragePos = localStorage.getItem('dragPosition')

  const defaultPosition = localStoragePos
    ? JSON.parse(localStoragePos)
    : {
        x: props?.defaultPosition?.x ?? 0,
        y: props?.defaultPosition?.y ?? 0,
      }

  const [position, setPosition] = useState(defaultPosition)

  const ref = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDivPosition({newPosition: defaultPosition, ref, setPosition})
  }, [])

  const onMouseMove = (event: MouseEvent) => {
    const newPosition = {x: event.clientX, y: event.clientY}
    const moveBackPositoin = judgeIfOutside({ref, childRef, newPosition})

    if (moveBackPositoin) {
      // setDivPosition({newPosition: moveBackPositoin, ref, setPosition})
      return
    }

    if (ref.current) {
      setDivPosition({newPosition, ref, setPosition})
    }
  }

  const onMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }, [onMouseMove, position, ref, childRef])

  const onMouseDown = useCallback(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [onMouseMove, position, ref, childRef])

  const style: CSSProperties = {position: 'fixed', zIndex: Z_INDEX.modal}
  const eventHandler = {
    onMouseDown,
    onMouseUp,
  }
  const divProps = {
    ref,
    style,
  }

  const DragButton = ({children}) => {
    return <Center {...eventHandler}>{children}</Center>
  }

  const AreaX = () => {
    return (
      <button {...eventHandler}>
        <GridIcon className={` h-10 w-10 text-gray-700`} />
      </button>
    )
  }

  const DraggableDiv = useCallback(({children}) => {
    return (
      <div>
        <div {...divProps}>
          <C_Stack className={`ｈ-full w-full items-start  gap-1 bg-white p-1`}>
            <AreaX />

            <R_Stack className={`ｈ-full w-full items-stretch  justify-stretch gap-1 p-1`}>
              {/* <AreaY /> */}
              <div onClick={e => e.stopPropagation()} ref={childRef}>
                {children}
              </div>
              {/* <AreaY /> */}
            </R_Stack>

            {/* <AreaX /> */}
          </C_Stack>
        </div>
      </div>
    )
  }, [])

  return {DraggableDiv, DragButton}
}

export default useFloatingDiv

const ScrollPosition = {
  x: window.scrollX,
  y: window.scrollY,
}
