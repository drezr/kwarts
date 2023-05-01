import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const userLinkPositionsData = params.userLinkPositionsData

  for (let userLinkPositionData of userLinkPositionsData) {
    userLinkPositionData = JSON.parse(userLinkPositionData)

    await prisma.eventUser.update({
      where: {
        id: userLinkPositionData.userLinkId,
      },
      data: {
        position: userLinkPositionData.position,
      },
    })
  }

  return 'Success'
})
