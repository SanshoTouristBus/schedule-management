'use client'
import {JSX} from 'react'
import ReactDOM from 'react-dom'
type usePortalProp = {
  JsxElement: JSX.Element
  rootId?:
    | 'poratal-root-top-fixed'
    | `portal-root-bottom`
    | 'portal-root-bottom-fixed'
    | 'basic-modal'
    | 'navBar'
    | 'menu-toggle-btn'

  anyRootId?: string
}

export const makePortal = (props: usePortalProp) => {
  const {JsxElement, rootId = 'poratal-root-top-fixed', anyRootId} = props

  const targetElement = document?.getElementById(anyRootId ?? rootId)

  if (targetElement) {
    return <div>{ReactDOM?.createPortal(JsxElement, targetElement)}</div>
  } else {
    return <></>
  }
}
