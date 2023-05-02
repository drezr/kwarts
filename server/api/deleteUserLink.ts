import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const userLinkId = parseInt(params.userLinkId)
  const userId = parseInt(params.userId)
  const eventId = parseInt(params.eventId)

  const dates = await prisma.date.findMany({
    where: {
      eventId: eventId,
    },
  })

  for (const date of dates) {
    await prisma.availability.deleteMany({
      where: {
        dateId: date.id,
        userId: userId,
      },
    })
  }

  await prisma.eventUser.delete({
    where: {
      id: userLinkId,
    },
  })

  return 'Success'
})
