import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const groupId: number = parseInt(params.groupId)
  const name: string = params.name

  if (!authorization || !authorization.isOwner) return null

  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      name: name,
    },
  })

  return 'Success'
})
