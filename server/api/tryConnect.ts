import prisma from '~/server/prisma'

export default defineEventHandler(async (event) => {
  const params: any = getQuery(event)

  const email: string = params.email
  const password: string = params.password

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
      return matchingEvent.eventId
    }
  }

  return null
})
