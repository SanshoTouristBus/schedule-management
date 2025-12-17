import {Trash2} from 'lucide-react'

import {cl} from 'src/cm/lib/methods/common'
import {useMemo} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import FileErrors from 'src/cm/hooks/useFileUpload/FileErrors'
import {anyObject} from '@cm/types/utility-types'
import {acceptType} from '@cm/types/file-types'
import {C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {twMerge} from 'tailwind-merge'
import {PaperclipIcon} from 'lucide-react'

type props = {
  accept: acceptType
  [key: string]: anyObject | any
}
const FileUploader = (props: props) => {
  const {
    fileArrState,
    setfileArrState,
    fileErrorState,
    setfileErrorState,
    handleFileChange,
    maxFiles,
    thumbnailStyle = {width: 160, height: 120},
    accept,
  } = props

  const dropZonProps = useDropzone({
    // onDrop,
    noClick: true,
    accept: accept,
    maxFiles,
    multiple: maxFiles > 1,
    onDrop(acceptedFiles, fileRejections, event) {
      let errors: FileRejection[] = []
      if (fileRejections.length > 0) {
        errors = fileRejections
      } else {
        handleFileChange(acceptedFiles)
      }

      setfileErrorState(errors)
    },
  })

  const {fileRejections, getRootProps, getInputProps, isDragActive, open} = dropZonProps
  const pillClass = ` inline-block p-0.5 px-2 text-xs text-white pointer-events-none rounded-full shadow-md  bg-gray-500`
  const style = useMemo(() => {
    return {
      ...(isDragActive ? borderDragStyle : borderNormalStyle),
    }
  }, [isDragActive])

  const wrapperAlertClass = twMerge(`shadow-sm p-2 rounded-sm`)

  return (
    <div className={` mx-auto w-fit  ${wrapperAlertClass} `}>
      <div {...getRootProps({style})} className={``}>
        <input {...getInputProps()} />

        <R_Stack
          onClick={e => {
            e.preventDefault()

            open()
          }}
          className="onHover  w-full items-center gap-2  py-1  text-center text-xs"
        >
          <R_Stack>
            <R_Stack className={`  text-gray-500 gap-0.5`}>
              <PaperclipIcon />
              <div>ファイル</div>
            </R_Stack>
            {Object.keys(accept).map((acceptStr, idx) => {
              const acceptExtentions = accept[acceptStr]
              if (acceptExtentions.length > 0) {
                return acceptExtentions.map((ext, idx2) => {
                  return (
                    <span key={idx2} className={cl(pillClass, `bg-gray-500`)}>
                      {ext}
                    </span>
                  )
                })
              } else {
                return (
                  <span key={idx} className={cl(pillClass, `bg-gray-500`)}>
                    {'.' + acceptStr.replace(/.+\//, '')}
                  </span>
                )
              }
            })}
          </R_Stack>
          <FileErrors {...{maxFiles, fileErrorState}} />
        </R_Stack>

        <ul className={`row-stack   `}>
          {fileArrState.map((obj, idx) => {
            return (
              <li key={idx} className={cl(`t-paper  relative overflow-hidden`)}>
                <C_Stack className={`relative`}>
                  <R_Stack>
                    <Trash2
                      onClick={e => {
                        const oldArr = [...fileArrState]
                        oldArr.splice(idx, 1)
                        setfileArrState(oldArr)
                      }}
                      className={`icon-btn  bg-error-main z-10 w-6 text-white  `}
                    />
                    <small>{obj.fileName}</small>
                  </R_Stack>
                </C_Stack>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default FileUploader

const borderNormalStyle = {
  // border: '1px dotted #888',
}

const borderDragStyle = {
  background: '#ACD7FF',
  border: '4px solid #ACD7FF',
  backgroundColor: '#ACD7FF',
  opacity: '30%',
}
