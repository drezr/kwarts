import prisma from '~/server/prisma'
import authorize from '~/server/authorize'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const slug: string = params.slug
  const authData = JSON.parse(params.auth)

  const event = await prisma.event.findFirst({
    where: {
      slug: slug,
    },
    include: {
      userLinks: {
        select: {
          alias: true,
          fideid: true,
          elo: true,
          nationality: true,
          isValidated: true,
        },
      },
    },
  })

  if (event && event.isListingOpen) {
    return event
  }

  return null
})
