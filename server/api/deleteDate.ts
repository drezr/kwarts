import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const dateID = parseInt(params.dateID)

  await prisma.date.delete({
    where: {
      id: dateID,
    },
  })

  return 'Success'
})
