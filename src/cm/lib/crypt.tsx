// utils/hashPassword.js

import bcrypt from 'bcrypt'

export async function hashPassword(password) {
  const SALT_ROUNDS = 10
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  return hashedPassword
}

export async function verifyPassword(inputPassword, hashedPassword) {
  if (!inputPassword || !hashedPassword) {
    return false
  }
  const isMatch = await bcrypt.compare(inputPassword ?? '', hashedPassword ?? '')

  return isMatch
}
