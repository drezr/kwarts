
import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const eventId: number = parseInt(params.eventId)
  const userId: number = parseInt(params.userId)
  const userLinkId: number = parseInt(params.userLinkId)
  const email: string = params.email


  // Check if email is already used in this event
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      userLinks: {
        include: {
          user: true
        }
      },
    }
  })
  
  if (event) {
    for (const userLink of event.userLinks) {
      if (userLink.user.email == email) {
        return null
      }
    }
    
  }
  
  // Check if email exists in the database
  const emailExists = await prisma.user.findFirst({
    where: {
      email: email,
    }
  })

  // If not, simply update the users email
  if (!emailExists) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: email,
      }
    })
  }

  // Else, update EventUsers userId and all availabilies userId - keep the old user - check if user was owner
  else {
    const dates = await prisma.date.findMany({
      where: {
        eventId: eventId,
      }
    })

    for (const date of dates) {
      await prisma.availability.updateMany({
        where: {
          userId: userId,
          dateId: date.id,
        },
        data: {
          userId: emailExists.id
        }
      })
    }

    await prisma.eventUser.update({
      where: {
        id: userLinkId,
      },
      data: {
        userId: emailExists.id,
        isPasswordSent: false,
      }
    })

    if (event && event.ownerId == userId) {
      await prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          ownerId: emailExists.id,
        }
      })
    }
  }

  return 'Success'
})
