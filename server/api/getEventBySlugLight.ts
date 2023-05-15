import prisma from '~/server/prisma'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const slug: string = params.slug

  const event = await prisma.event.findFirst({
    where: {
      slug: slug,
    },
  })

  if (event) {
    return event
  }

  return null
})
