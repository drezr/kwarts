import prisma from '~/server/prisma'

export default defineEventHandler(async (e) => {
  // const user1 = await prisma.user.create({
  //   data: {
  //     email: 'ultimove@gmail.com',
  //     chosenLanguage: 'fr',
  //   },
  // })
  // const user2 = await prisma.user.create({
  //   data: {
  //     email: 'cb@gmail.com',
  //     chosenLanguage: 'fr',
  //   },
  // })
  // const user3 = await prisma.user.create({
  //   data: {
  //     email: 'md@gmail.com',
  //     chosenLanguage: 'fr',
  //   },
  // })
  // const user4 = await prisma.user.create({
  //   data: {
  //     email: 'jmg@gmail.com',
  //     chosenLanguage: 'fr',
  //   },
  // })
  // const event1 = await prisma.event.create({
  //   data: {
  //     name: 'EM Open Printemps 2023',
  //     ownerId: user1.id,
  //   },
  // })
  // const eventUser1 = await prisma.eventUser.create({
  //   data: {
  //     position: 0,
  //     alias: 'Ronan Dumont',
  //     password: 'aaa',
  //     eventId: event1.id,
  //     userId: user1.id,
  //   },
  // })
  // const eventUser2 = await prisma.eventUser.create({
  //   data: {
  //     position: 1,
  //     alias: 'Claude Bikady',
  //     password: 'aaa',
  //     eventId: event1.id,
  //     userId: user2.id,
  //   },
  // })
  // const eventUser3 = await prisma.eventUser.create({
  //   data: {
  //     position: 2,
  //     alias: 'Marc Dambiermont',
  //     password: 'aaa',
  //     eventId: event1.id,
  //     userId: user3.id,
  //   },
  // })
  // const eventUser4 = await prisma.eventUser.create({
  //   data: {
  //     position: 3,
  //     alias: 'Jean-Marie Gheury',
  //     password: 'aaa',
  //     eventId: event1.id,
  //     userId: user4.id,
  //   },
  // })
  // const date1 = await prisma.date.create({
  //   data: {
  //     date: new Date('2023-04-28').toISOString(),
  //     title: 'Ronde 1',
  //     isLocked: false,
  //     eventId: event1.id,
  //     position: 0,
  //   },
  // })
  // const date2 = await prisma.date.create({
  //   data: {
  //     date: new Date('2023-05-12').toISOString(),
  //     title: 'Ronde 2',
  //     isLocked: false,
  //     eventId: event1.id,
  //     position: 1,
  //   },
  // })
  // const date3 = await prisma.date.create({
  //   data: {
  //     date: new Date('2023-05-19').toISOString(),
  //     title: 'Ronde 3',
  //     isLocked: false,
  //     eventId: event1.id,
  //     position: 2,
  //   },
  // })
  // const date4 = await prisma.date.create({
  //   data: {
  //     date: new Date('2023-06-02').toISOString(),
  //     title: 'Ronde 4',
  //     isLocked: false,
  //     eventId: event1.id,
  //     position: 3,
  //   },
  // })
  // const date5 = await prisma.date.create({
  //   data: {
  //     date: new Date('2023-06-16').toISOString(),
  //     title: 'Ronde 5',
  //     isLocked: false,
  //     eventId: event1.id,
  //     position: 4,
  //   },
  // })
  // const date6 = await prisma.date.create({
  //   data: {
  //     date: new Date('2023-06-23').toISOString(),
  //     title: 'Ronde 6',
  //     isLocked: false,
  //     eventId: event1.id,
  //     position: 5,
  //   },
  // })
  // const date7 = await prisma.date.create({
  //   data: {
  //     date: new Date('2023-06-30').toISOString(),
  //     title: 'Ronde 7',
  //     isLocked: false,
  //     eventId: event1.id,
  //     position: 6,
  //   },
  // })
  // const availability1 = await prisma.availability.create({
  //   data: {
  //     isAvailable: true,
  //     dateId: date1.id,
  //     userId: user1.id,
  //   },
  // })
  // console.log('Database initiated !')
})
