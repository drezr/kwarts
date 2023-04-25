import prisma from '~/server/prisma'

export default defineEventHandler(async (e) => {
  await prisma.availability.deleteMany({})
  await prisma.eventUser.deleteMany({})
  await prisma.date.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Database cleared !')
})
