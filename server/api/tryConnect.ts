import prisma from '~/server/prisma'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const params: any = getQuery(event)

  const email: string = params.email
  const password: string = params.password
  const newToken: string = uuidv4().replaceAll('-', '')

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      eventLinks: {
        include: {
          event: true,
        },
      },
    },
  })

  if (user) {
    if (user.salt) {
      const newHash = crypto
        .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
        .toString('hex')

      if (newHash == user.password) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            token: newToken,
          },
        })

        return {
          token: newToken,
          userId: user.id,
          email: user.email,
          userLogged: true,
        }
      }
    }

    const matchingEvent = user.eventLinks.find((el) => el.password === password)

    if (matchingEvent) {
      await prisma.eventUser.update({
        where: {
          id: matchingEvent.id,
        },
        data: {
          token: newToken,
        },
      })

      return {
        token: newToken,
        userId: user.id,
        email: user.email,
        eventId: matchingEvent.eventId,
        eventSlug: matchingEvent.event.slug,
      }
    }
  }

  return null
})
