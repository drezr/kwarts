import prisma from '~/server/prisma'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)

  const isAvailable: boolean = Boolean(params.isAvailable === 'true')
  const dateId: number = parseInt(params.dateId)
  const userId: number = parseInt(params.userId)

  const availability = await prisma.availability.create({
    data: {
      isAvailable: isAvailable,
      dateId: dateId,
      userId: userId,
    },
  })

  return availability
})
