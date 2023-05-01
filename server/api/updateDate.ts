import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const dateId: number = parseInt(params.dateId)
  const newDate: string = params.date
  const newTitle: string = params.title

  const date = await prisma.date.update({
    where: {
      id: dateId,
    },
    data: {
      date: newDate,
      title: newTitle,
    },
  })

  return date
})
