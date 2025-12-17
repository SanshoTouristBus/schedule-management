import {google} from 'googleapis'
import {NextRequest, NextResponse} from 'next/server'
import {serialize} from 'cookie'
import {basePath} from 'src/cm/lib/methods/common'

import {getOauthClient} from '@app/api/auth/google/getAuth'
import {doStandardPrisma} from '@cm/lib/server-actions/common-server-actions/doStandardPrisma/doStandardPrisma'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code') ?? ``
  const oAuth2Client = await getOauthClient()

  try {
    const {tokens} = await oAuth2Client.getToken(code)
    const {access_token, refresh_token, scope, token_type, expiry_date, id_token} = tokens

    oAuth2Client.setCredentials(tokens)

    const googleUser = await google
      .oauth2(`v2`)
      .userinfo.get({auth: oAuth2Client})
      .then(res => res.data)

    if (googleUser?.email) {
      const data = {
        email: googleUser.email,
        access_token: access_token ?? '',
        refresh_token: refresh_token ?? '',
        scope: scope ?? '',
        token_type: token_type ?? '',
        id_token: id_token ?? '',
        expiry_date: new Date(Number(tokens.expiry_date)),
        tokenJSON: JSON.stringify(tokens),
      }

      const {result} = await doStandardPrisma(`googleAccessToken`, `upsert`, {
        where: {email: googleUser.email},
        create: data,
        update: data,
      })

      console.info({
        email: result.email,
        expiry_date: result.expiry_date,
      })
    }

    const response = NextResponse.redirect(basePath)
    response.headers.set(
      'Set-Cookie',
      serialize('googleAuthToken', JSON.stringify(tokens), {path: `/${process.env.NEXT_PUBLIC_ROOTPATH}`})
    )
    return response
  } catch (error) {
    console.error(error.message)
    return NextResponse.json({error, msg: 'Failed to retrieve tokens'}, {status: 500})
  }
}
