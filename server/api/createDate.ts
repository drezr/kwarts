import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const title: string = params.title
  const date: string = params.date
  const eventId: number = parseInt(params.eventId)

  const eventDates = await prisma.date.findMany({
    where: {
      eventId: eventId,
    },
  })

  const newDate = await prisma.date.create({
    data: {
      date: date,
      title: title,
      eventId: eventId,
      position: eventDates.length,
    },
    include: {
      availabilities: true,
    },
  })

  return newDate
})
