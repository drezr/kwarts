// import prisma from '~/server/prisma'
// import authorize from '~/server/authorize'

// export default defineEventHandler(async (e) => {
//   const params: any = getQuery(e)
//   const eventId: number = parseInt(params.eventId)
//   const authData = JSON.parse(params.auth)
//   const authorization = await authorize(authData)

//   if (!authorization) return null

//   const event = await prisma.event.findUnique({
//     where: {
//       id: eventId,
//     },
//     include: {
//       userLinks: {
//         select: {
//           eventId: true,
//           id: true,
//           alias: true,
//           position: true,
//           isHidden: true,
//           isPasswordSent: authorization.isOwner,
//           isOwner: true,
//           user: {
//             select: {
//               id: true,
//               email: true,
//             },
//           },
//           userId: true,
//         },
//       },
//       dates: {
//         include: {
//           availabilities: true,
//         },
//       },
//     },
//   })

//   if (event) {
//     return event
//   }

//   return null
// })
