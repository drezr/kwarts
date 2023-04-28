import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const eventId: number = parseInt(params.eventId)
  const newEventName: string = params.newEventName

  const event = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      name: newEventName,
    },
  })

  return event
})
