import prisma from '~/server/prisma'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)

  const eventId: number = parseInt(params.eventId)

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      userLinks: {
        select: {
          eventId: true,
          id: true,
          alias: true,
          position: true,
          user: true,
          userId: true,
        },
      },
      dates: {
        include: {
          availabilities: true,
        },
      },
    },
  })

  return event
})
