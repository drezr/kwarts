import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const dateId = parseInt(params.dateId)

  await prisma.availability.deleteMany({
    where: {
      dateId: dateId,
    },
  })

  await prisma.date.delete({
    where: {
      id: dateId,
    },
  })

  return 'Success'
})
