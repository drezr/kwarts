import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null
  const dateId: number = Number(params.dateId)

  const date = await prisma.date.findFirst({
    where: {
      id: dateId,
    },
    include: {
      groups: true,
    },
  })

  if (date) {
    const newGroup = await prisma.group.create({
      data: {
        dateId: dateId,
        position: date.groups.length,
      },
      include: {
        userLinks: true,
      },
    })

    return newGroup
  }

  return null
})
