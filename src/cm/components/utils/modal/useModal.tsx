import {useCallback, useState} from 'react'
import {basicModalPropType, ModalCore} from '@cm/components/utils/modal/ModalCore'

/**
 * useModal フック
 * @template T openの型
 */
export type useModalReturn<T = any> = {
  Modal: React.FC<basicModalPropType>
  handleOpen: (openValue?: T) => void
  handleClose: (closeValue?: T) => void
  open: T
  setopen: (openValue: T) => void
}

function useModal<T = any>(props?: {defaultOpen?: boolean; defaultState?: T; alertOnClose?: boolean}): useModalReturn<T> {
  // 初期値の決定
  const initialOpen =
    props?.defaultState !== undefined ? props.defaultState : props?.defaultOpen ? (true as any as T) : (false as any as T)

  const [open, setopen] = useState<T>(initialOpen)

  const handleOpen = (openValue?: T) => setopen(openValue !== undefined ? openValue : (true as any as T))
  const handleClose = () => setopen(null as any)

  const Modal = useCallback(
    (modalProps: basicModalPropType) => {
      return (
        <ModalCore
          {...{
            ...props,
            open,
            setopen,
            ...modalProps,
          }}
        >
          {modalProps.children}
        </ModalCore>
      )
    },
    [open, setopen, props]
  )

  return {
    Modal,
    handleOpen,
    handleClose,
    open,
    setopen,
  }
}

export default useModal
