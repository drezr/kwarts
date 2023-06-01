// import prisma from '~/server/prisma'
// import authorize from '~/server/authorize'

// export default defineEventHandler(async (e) => {
//   const params: any = getQuery(e)
//   const authData = JSON.parse(params.auth)
//   const authorization = await authorize(authData)

//   if (!authorization || !authorization.isOwner) return null

//   const userLinkId = parseInt(params.userLinkId)
//   const hasPaid: boolean = Boolean(params.hasPaid === 'true')

//   await prisma.eventUser.update({
//     where: {
//       id: userLinkId,
//     },
//     data: {
//       hasPaid: hasPaid,
//     },
//   })

//   return 'Success'
// })
