import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer, ToastOptions} from 'react-toastify'
const options: ToastOptions = {
  style: {zIndex: 2147483647, width: '100%', maxWidth: 700},
  position: 'bottom-right',
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  rtl: false,
  draggable: true,
  pauseOnHover: true,
  theme: 'dark',
}
export default function GlobalToast() {
  return <ToastContainer {...options} />
}
