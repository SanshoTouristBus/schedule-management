import Redirector from '@cm/components/utils/Redirector'
import LogoutForm from '@app/logout/LogoutForm'
import {initServerComopnent} from 'src/non-common/serverSideFunction'

const LogoutPage = async props => {
  const query = await props.searchParams
  const {session} = await initServerComopnent({query})
  const {rootPath} = query

  if (!session?.id) {
    return <Redirector {...{redirectPath: `/login?rootPath=${rootPath}`}} />
  }

  return <LogoutForm />
}

export default LogoutPage
