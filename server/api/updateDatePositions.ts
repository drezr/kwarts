import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const datePositionsData = params.datePositionsData

  for (let datePositionData of datePositionsData) {
    datePositionData = JSON.parse(datePositionData)

    await prisma.date.update({
      where: {
        id: datePositionData.dateId,
      },
      data: {
        position: datePositionData.position,
      },
    })
  }

  return 'Success'
})
