import prisma from '~/server/prisma'
import authorize from '~/server/authorize'
import crypto from 'crypto'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const userId: number = parseInt(params.userId)
  const oldPassword: string = params.oldPassword
  const newPassword: string = params.newPassword

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (user) {
    const oldHash = crypto
      //@ts-ignore
      .pbkdf2Sync(oldPassword, user.salt, 1000, 64, 'sha512')
      .toString('hex')

    if (user.password == oldHash) {
      const salt = crypto.randomBytes(16).toString('hex')
      const hash = crypto
        .pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512')
        .toString('hex')

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hash,
          salt: salt,
        },
      })

      return true
    }
  }

  return false
})
