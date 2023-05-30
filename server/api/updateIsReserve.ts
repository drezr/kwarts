import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const userLinkId = parseInt(params.userLinkId)
  const isReserve: boolean = Boolean(params.isReserve === 'true')
  const userId: number = parseInt(params.userId)

  if (userId != authorization.eventUser.userId && !authorization.isOwner) {
    return null
  }

  await prisma.eventUser.update({
    where: {
      id: userLinkId,
    },
    data: {
      isReserve: isReserve,
    },
  })

  return 'Success'
})
