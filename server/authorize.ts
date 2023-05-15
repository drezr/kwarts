import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function authorize(authData: any) {
  const eventUser = await prisma.eventUser.findFirst({
    where: {
      userId: authData.userId,
      eventId: authData.eventId,
      token: authData.token,
    },
  })

  if (eventUser) {
    const event = await prisma.event.findUnique({
      where: {
        id: authData.eventId,
      },
    })

    if (eventUser && event) {
      return {
        eventUser: eventUser,
        event: event,
        isAdmin: eventUser.isAdmin,
        isOwner: eventUser.isOwner,
      }
    }
  }

  return null
}

export default authorize
