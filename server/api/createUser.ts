import prisma from '~/server/prisma'
import authorize from '~/server/authorize'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const email: string = params.email
  const alias: string = params.alias
  const eventId: number = parseInt(params.eventId)

  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email,
        chosenLanguage: 'fr',
        password: uuidv4().replaceAll('-', ''),
      },
    })
  } else {
    const userLinkExist = await prisma.eventUser.findMany({
      where: {
        userId: user.id,
        eventId: eventId,
      },
    })

    if (userLinkExist.length != 0) {
      return null
    }
  }

  const eventUserCount = await prisma.eventUser.findMany({
    where: {
      eventId: eventId,
    },
  })

  const userLink = await prisma.eventUser.create({
    data: {
      alias: alias,
      userId: user.id,
      eventId: eventId,
      password: uuidv4().replaceAll('-', ''),
      position: eventUserCount.length,
    },
    select: {
      eventId: true,
      id: true,
      alias: true,
      position: true,
      user: true,
      userId: true,
    },
  })

  return userLink
})
