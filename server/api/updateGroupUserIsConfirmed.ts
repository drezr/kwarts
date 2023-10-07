import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const groupUserId = parseInt(params.groupUserId)
  const isConfirmed: boolean = Boolean(params.isConfirmed === 'true')

  if (!authorization || !authorization.isOwner) return null

  await prisma.groupUser.update({
    where: {
      id: groupUserId,
    },
    data: {
      isConfirmed: isConfirmed,
    },
  })

  return 'Success'
})
