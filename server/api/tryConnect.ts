import prisma from '~/server/prisma'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  const params: any = getQuery(event)

  const email: string = params.email
  const password: string = params.password
  const newToken: string = uuidv4().replaceAll('-', '')

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      eventLinks: true,
    },
  })

  if (user) {
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
        user: user,
        eventId: matchingEvent.eventId,
      }
    }
  }

  return null
})
