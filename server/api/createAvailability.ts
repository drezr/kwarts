import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const isAvailable: boolean = Boolean(params.isAvailable === 'true')
  const dateId: number = parseInt(params.dateId)
  const userId: number = parseInt(params.userId)

  if (userId != authorization.eventUser.userId && !authorization.isOwner) {
    return null
  }

  const availability = await prisma.availability.create({
    data: {
      isAvailable: isAvailable,
      dateId: dateId,
      userId: userId,
    },
  })

  return availability
})
