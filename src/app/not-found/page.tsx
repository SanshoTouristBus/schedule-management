'use client'
import {T_LINK} from '@cm/components/styles/common-components/links'
import Redirector from '@cm/components/utils/Redirector'
import useGlobal from '@cm/hooks/globalHooks/useGlobal'
import {HREF} from '@cm/lib/methods/urls'
import {Absolute, Center, C_Stack, R_Stack} from 'src/cm/components/styles/common-components/common-components'

const UnAuthorizedPage = () => {
  const {query, router, session} = useGlobal()
  const {rootPath} = query

  if (session?.id) {
    return <Redirector {...{redirectPath: `/`}} />
  }

  return (
    <Absolute className={`w-full p-4 text-xl`}>
      <Center>
        <C_Stack className={`gap-20`}>
          <C_Stack className={`gap-4 text-center text-gray-600 `}>
            <p>このページは利用できません</p>
            <small>
              アカウントに権限がないか、
              <br />
              端末サイズが不適合である可能性があります
            </small>
          </C_Stack>
          <R_Stack className={` justify-center gap-8`}>
            <div
              className={`t-link `}
              onClick={e => {
                router.push(`/${rootPath}`)
              }}
            >
              戻る
            </div>
            <T_LINK href={HREF(`/login?rootPath=${rootPath}`, {}, query)}>ログイン</T_LINK>
          </R_Stack>
        </C_Stack>
      </Center>
    </Absolute>
  )
}

export default UnAuthorizedPage
