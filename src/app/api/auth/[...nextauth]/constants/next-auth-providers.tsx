import CredentialsProvider from 'next-auth/providers/credentials'

import {CheckLogin} from '@app/api/prisma/login/checkLogin'

export const normalCredentialsProvider = CredentialsProvider({
  id: 'credentials',
  name: 'Normal Login',
  credentials: {
    loginKeyField: {label: 'メールアドレス', type: 'text', placeholder: 'test@test.com'},
    password: {label: 'パスワード', type: 'password', placeholder: 'password123'},
  },
  authorize: async (credentials: {loginKeyField: string; password: string}, req) => {
    const {loginKeyField, password} = credentials

    const user = await CheckLogin({
      authId: loginKeyField,
      authPw: password,
    })

    return user
  },
})
