import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization || !authorization.isOwner) return null

  const slug: string = params.slug

  const slugExist = await prisma.event.findFirst({
    where: {
      slug: slug,
    },
  })

  if (slugExist) return true

  return false
})
