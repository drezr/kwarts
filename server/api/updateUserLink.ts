import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const userLinkId: number = parseInt(params.userLinkId)
  const data = JSON.parse(params.data)

  await prisma.eventUser.update({
    where: {
      id: userLinkId,
    },
    data: data,
  })

  return 'Success'
})
