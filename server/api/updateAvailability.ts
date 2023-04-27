import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const isAvailable: boolean = Boolean(params.isAvailable === 'true')
  const availabilityId: number = parseInt(params.availabilityId)
  const userId: number = parseInt(params.userId)

  if (userId != authorization.eventUser.userId && !authorization.isOwner) {
    return null
  }

  const availability = await prisma.availability.update({
    where: {
      id: availabilityId,
    },
    data: {
      isAvailable: isAvailable,
    },
  })

  return availability
})
