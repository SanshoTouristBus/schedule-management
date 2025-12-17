'use client'

import {XCircle} from 'lucide-react'
import useWindowSize from 'src/cm/hooks/useWindowSize'
import {Z_INDEX} from 'src/cm/lib/constants/constants'

import React, {CSSProperties, useCallback, useMemo} from 'react'

import {v4 as uuidv4} from 'uuid'
import useCursorPosition from 'src/cm/hooks/useCursorPosition'

import {atomTypes, useJotaiByKey} from '@cm/hooks/useJotai'
import {JSX} from 'react'
const style: CSSProperties = {
  zIndex: Z_INDEX.popover,
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
}

const MyPopover = React.memo(
  (props: {
    button: JSX.Element | string
    children: any
    positionFree?: boolean
    offsets?: {
      x: number
      y: number
    }
    stayOpen?: boolean
    childrenWidth?: number

    mode?: 'click' | 'hover' | 'hover-absolute'
  }) => {
    const {button, children, positionFree = true, stayOpen, childrenWidth, offsets = {x: 10, y: 20}, mode = `hover`} = props
    const [showpopoverAtom, setshowpopoverAtom] = useJotaiByKey<atomTypes[`showpopover`]>(`showpopover`, null)

    const uuid = useMemo(() => uuidv4(), [])

    const {height, width} = useWindowSize()
    const isOpen = showpopoverAtom === uuid

    const buttonZindex = showpopoverAtom ? Z_INDEX.overlay - 5 : undefined
    const overlayZindex = showpopoverAtom ? Z_INDEX.overlay - 10 : undefined
    const contentZindex = buttonZindex ? buttonZindex + 5 : undefined

    const {cursorPosition, updatePosition} = useCursorPosition({refreshPosition: `manual`})

    const show = useCallback(e => {
      setshowpopoverAtom(uuid)
      updatePosition(e)
    }, [])

    const close = e => setshowpopoverAtom(null)

    const onClick = isOpen ? close : show
    const onMouseEnter = e => {
      show(e)
    }
    const onMouseLeave = stayOpen ? undefined : close

    const Wrapper = useCallback(({button, children}) => {
      return (
        <>
          <span
            style={{zIndex: buttonZindex, cursor: 'pointer'}}
            {...(mode === `click` ? {onClick} : {onMouseEnter, onMouseLeave})}
          >
            {button}
          </span>
          <div>{children}</div>
        </>
      )
    }, [])

    const Conetnt = () => {
      const makePositionFreeStyle = useCallback(() => {
        const cursorIsOnLeftHalf = cursorPosition?.x < width / 2
        const top = cursorPosition?.y + (offsets.y ?? 0)
        let left: any = cursorPosition?.x + (offsets.x ?? 0)
        let right: any = undefined
        if (!cursorIsOnLeftHalf) {
          left = undefined
          right = width - cursorPosition?.x + (offsets.x * 2 || 0)
        }

        const positionFreeStyle: CSSProperties = {
          cursor: 'pointer',
          ...{zIndex: Z_INDEX.popover, position: 'fixed'},

          ...{top: top, left, right},
        }

        if (mode === 'hover-absolute') {
          const positionFreeStyle = {
            cursor: 'pointer',
            ...{zIndex: Z_INDEX.popover, position: 'absolute'},
          }
          return positionFreeStyle as CSSProperties
        }

        return positionFreeStyle
      }, [cursorPosition?.x, cursorPosition?.y, height, width, offsets.x, offsets.y])

      const contentStyle = {
        ...(positionFree ? makePositionFreeStyle() : style),
        zIndex: contentZindex,
      }

      return (
        <>
          {props.children && isOpen && (
            <div style={{...contentStyle, zIndex: contentZindex}}>
              <div className={`h-fit  `}>
                <div className={` flex justify-end`}>
                  {!positionFree && (
                    <XCircle
                      onClick={close}
                      style={{zIndex: Number(overlayZindex) + 10}}
                      className={` w-10 rounded-full text-gray-600 shadow-md`}
                    ></XCircle>
                  )}
                </div>
                <div>{children}</div>
              </div>
            </div>
          )}
        </>
      )
    }

    const OverLay = () => {
      return (
        <> {stayOpen && <div className={` absolute inset-0 bg-black opacity-0    `} style={{zIndex: overlayZindex}}></div>}</>
      )
    }

    const OverLayToClick = () => {
      return (
        <>
          {isOpen && (
            <div
              onClick={close}
              className={` fixed inset-0 h-full w-full bg-white opacity-0    `}
              style={{zIndex: overlayZindex}}
            ></div>
          )}
        </>
      )
    }

    if (mode === `click`) {
      return (
        <>
          <Wrapper {...{button}}>
            <Conetnt />
          </Wrapper>
          <OverLay />
          <OverLayToClick />
        </>
      )
    } else if (mode === `hover` || mode === `hover-absolute`) {
      return (
        <>
          <Wrapper {...{button, children}}>
            <Conetnt />
          </Wrapper>
          <OverLay />
          {/* <OverLayToClick /> */}
        </>
      )
    }

    return <div>mode must be defined</div>
  }
)

export default MyPopover
