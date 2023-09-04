import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null
  const eventId: number = Number(params.eventId)
  const name: string = params.name

  let newGroups = []

  const dates = await prisma.date.findMany({
    where: {
      eventId: eventId,
    },
    include: {
      groups: true,
    },
  })

  for (const date of dates) {
    const newGroup = await prisma.group.create({
      data: {
        dateId: date.id,
        name: name,
        position: date.groups.length,
      },
      include: {
        groupUsers: true,
      },
    })

    newGroups.push(newGroup)
  }

  return JSON.stringify(newGroups)
})
