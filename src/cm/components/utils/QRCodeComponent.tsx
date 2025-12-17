import {QRCodeSVG} from 'qrcode.react'

interface QRCodeComponentProps {
  url: string
  style?: React.CSSProperties
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({url, style}) => {
  return (
    <div style={{textAlign: 'center', margin: 'auto', ...style}}>
      <QRCodeSVG bgColor="#FFFFFF" fgColor="#000000" level="Q" style={{...style}} value={url} />
    </div>
  )
}

export default QRCodeComponent
