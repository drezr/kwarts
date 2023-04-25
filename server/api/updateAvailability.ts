import prisma from '~/server/prisma'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)

  const isAvailable: boolean = Boolean(params.isAvailable === 'true')
  const availabilityId: number = parseInt(params.availabilityId)

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
