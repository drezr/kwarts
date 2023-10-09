import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function authorize(authData: any) {
  if (authData.eventId) {
    const eventUser = await prisma.eventUser.findFirst({
      where: {
        AND: {
          userId: authData.userId,
          eventId: authData.eventId,
          token: authData.token,
        },
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
  } else {
    if (authData.userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: authData.userId,
        },
      })

      if (user && user.token == authData.token) {
        return {
          userLogged: true,
        }
      }
    }
  }

  return null
}

export default authorize
