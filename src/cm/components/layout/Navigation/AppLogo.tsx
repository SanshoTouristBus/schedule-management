import {R_Stack} from 'src/cm/components/styles/common-components/common-components'
import React from 'react'
const AppLogo = React.memo((props: {showLogoOnly; AppName; Logo}) => {
  const {showLogoOnly, AppName, Logo} = props

  return (
    <div className={`row-stack  `}>
      <div
        className={` ${process.env.NEXT_PUBLIC_IS_STAGING ? 'text-red-200' : 'text-primary-main'}   text-lg font-bold  italic   md:text-xl lg:text-3xl   `}
      >
        <R_Stack className={` justify-between `}>
          <R_Stack>
            {showLogoOnly ? (
              <></>
            ) : (
              <h1
                className={`${process.env.NEXT_PUBLIC_IS_STAGING ? 'text-red-500' : 'text-primary-main'} text-[20px] xl:text-[25px]`}
              >
                {' '}
                {AppName}
              </h1>
            )}
            {Logo}
          </R_Stack>
        </R_Stack>
      </div>
    </div>
  )
})

export default AppLogo
