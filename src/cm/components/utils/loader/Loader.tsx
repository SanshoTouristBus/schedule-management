'use client'
import {Absolute, C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'
import {Z_INDEX} from 'src/cm/lib/constants/constants'

import LoadingBar from 'react-top-loading-bar'
import {useRef} from 'react'

export default function Loader(props: any) {
  const ref = useRef<any>(null)

  return (
    <>
      <div
        className={`fixed inset-0 h-full w-full backdrop-blur-md bg-white/10`}
        style={{
          zIndex: Z_INDEX.loader,
        }}
      >
        <LoadingBar ref={ref} height={4} />
        <Absolute>
          <C_Stack className={` items-center`}>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animation-delay-150"></div>
              </div>

              {props.children && (
                <R_Stack className={` flex items-center `}>
                  <div className="text-center">
                    <div className=" font-semibold   text-lg text-gray-600 italic">{props.children}</div>
                  </div>
                  <R_Stack className={` gap-2`}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
                  </R_Stack>
                </R_Stack>
              )}
            </div>

            {/* <Blocks
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
            /> */}
          </C_Stack>
        </Absolute>
      </div>
    </>
  )
}
