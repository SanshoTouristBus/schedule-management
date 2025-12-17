import {Z_INDEX} from 'src/cm/lib/constants/constants'
import {cl} from 'src/cm/lib/methods/common'

const Drawer = ({menuContext, children}) => {
  const {isOpen, setIsOpen, toggleMenu} = menuContext
  return (
    <>
      <div
        style={{zIndex: Z_INDEX.modal}}
        onClick={toggleMenu}
        className={` duration  fixed inset-0  bg-black ${isOpen ? 'opacity-70' : ' hidden'}`}
      ></div>
      <div className={cl(`drawer max-w-[200px]  bg-gray-100  `, isOpen ? 'open ' : '')}>{children}</div>
    </>
  )
}

export default Drawer
