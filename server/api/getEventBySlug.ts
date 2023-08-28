import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const slug: string = params.slug
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const event = await prisma.event.findFirst({
    where: {
      slug: slug,
    },
    include: {
      userLinks: {
        select: {
          eventId: true,
          id: true,
          alias: true,
          position: true,
          isHidden: true,
          isValidated: true,
          isMotorized: true,
          isReserve: true,
          note: true,
          godfather: true,
          fideid: true,
          elo: true,
          club: true,
          phone: true,
          nationality: true,
          hasPaid: authorization.isOwner,
          paymentNote: authorization.isOwner,
          isPasswordSent: authorization.isOwner,
          isOwner: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
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

  if (event) {
    return event
  }

  return null
})
