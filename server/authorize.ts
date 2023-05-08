import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function authorize(authData: any) {
  const eventUser = await prisma.eventUser.findFirst({
    where: {
      userId: authData.loggedUserId,
      eventId: authData.eventId,
      token: authData.token,
    },
  })

  const event = await prisma.event.findUnique({
    where: {
      id: authData.eventId,
    },
  })

  if (eventUser && event) {
    return {
      eventUser: eventUser,
      event: event,
      isOwner: eventUser.userId == event.ownerId,
    }
  }

  return null
}

export default authorize
