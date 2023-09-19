import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const dateId: number = parseInt(params.dateId)

  const date = await prisma.date.findUnique({
    where: {
      id: dateId,
    },
    include: {
      event: {
        include: {
          userLinks: {
            select: {
              id: true,
              alias: true,
              position: true,
              isHidden: true,
              isMotorized: true,
              userId: true,
            },
          },
        },
      },
      availabilities: true,
      groups: {
        include: {
          groupUsers: {
            select: {
              id: true,
              position: true,
              userLink: {
                select: {
                  id: true,
                  alias: true,
                  elo: true,
                  fideid: true,
                  phone: true,
                  user: {
                    select: {
                      id: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  return date
})
