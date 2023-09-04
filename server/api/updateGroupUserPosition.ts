import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const updates = JSON.parse(params.updates)

  if (!authorization || !authorization.isOwner) return null

  for (let update of updates) {
    await prisma.groupUser.update({
      where: {
        id: parseInt(update.groupUserId),
      },
      data: {
        position: parseInt(update.position),
      },
    })
  }

  return 'Success'
})
