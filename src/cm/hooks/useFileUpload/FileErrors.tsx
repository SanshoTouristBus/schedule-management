import {Alert} from '@cm/components/styles/common-components/Alert'
import {FileRejection} from 'react-dropzone'

const FileErrors = ({maxFiles, fileErrorState}) => {
  if (fileErrorState.length === 0) {
    return <div></div>
  }

  const breakWordCl = `w-[150px]  break-words text-sm`
  return (
    <Alert>
      <p className={`text-center font-bold text-error-main`}>ファイル入力エラー</p>
      <table className={`simple-table`}>
        <tbody>
          {fileErrorState.map((props: FileRejection, idx: number) => {
            const {file, errors} = props
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <p className={`${breakWordCl} font-bold`}>{file.name}</p>
                  <small>{file.size} byte</small>
                </td>

                {errors.map(e => {
                  let msg = ''
                  switch (e?.code) {
                    case 'file-invalid-type':
                      msg = `有効ファイル：${e.message.replace(/File type must be/, '')}`
                      break
                    case 'too-many-files':
                      msg = `最大ファイル数：${maxFiles}`

                      break
                    default:
                      msg = `読み取り不可能${e.message}`
                  }
                  return (
                    <td key={e.code} className={`${breakWordCl} text-error-main`}>
                      {msg}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </Alert>
  )
}
export default FileErrors
