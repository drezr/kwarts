import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const userLinkId: number = parseInt(params.userLinkId)
  const oldGroupId: number = parseInt(params.oldGroupId)
  const newGroupId: number = parseInt(params.newGroupId)

  if (!authorization || !authorization.isOwner) return null

  if (oldGroupId == 0 && newGroupId != 0) {
    const groupUser = await prisma.groupUser.create({
      data: {
        position: 0,
        groupId: newGroupId,
        userLinkId: userLinkId,
      },
    })

    return groupUser
  }

  if (newGroupId == 0 && oldGroupId != 0) {
    await prisma.groupUser.deleteMany({
      where: {
        groupId: oldGroupId,
        userLinkId: userLinkId,
      },
    })
  }

  if (newGroupId != 0 && oldGroupId != 0) {
    const groupUser = await prisma.groupUser.findFirst({
      where: {
        groupId: oldGroupId,
        userLinkId: userLinkId,
      },
    })

    if (groupUser) {
      await prisma.groupUser.update({
        where: {
          id: groupUser.id,
        },
        data: {
          groupId: newGroupId,
          userLinkId: userLinkId,
        },
      })
    }
  }

  return 'Success'
})
