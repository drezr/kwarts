import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const groupId: number = parseInt(params.groupId)
  const name: string = params.name
  const address: string = params.address
  const versus: string = params.versus
  const isAtHome: boolean = Boolean(params.isAtHome === 'true')
  const isValidated: boolean = Boolean(params.isValidated === 'true')

  if (!authorization || !authorization.isOwner) return null

  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      name: name,
      address: address,
      versus: versus,
      isAtHome: isAtHome,
      isValidated: isValidated,
    },
  })

  return 'Success'
})
