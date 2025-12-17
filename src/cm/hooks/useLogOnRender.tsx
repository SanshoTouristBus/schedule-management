import {useEffect} from 'react'

const useLogOnRender = (key?: any) => {
  useEffect(() => {
    console.info(`===Log:${key}===`)
  }, [])
}

export default useLogOnRender
