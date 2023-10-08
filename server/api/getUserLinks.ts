import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

//@ts-ignore
export default defineEventHandler(async (e: any) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const userLinks = await prisma.eventUser.findMany({
    where: {
      userId: authData.userId,
    },
    include: {
      event: true,
    },
  })

  if (userLinks) {
    return userLinks
  }

  return null
})
