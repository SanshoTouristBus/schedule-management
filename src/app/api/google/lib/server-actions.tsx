'use server'
export const getClientConfig = async () => {
  const result = {clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET}
  return result
}
