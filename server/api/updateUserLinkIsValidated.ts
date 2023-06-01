// import prisma from '~/server/prisma'
// import authorize from '~/server/authorize'

// export default defineEventHandler(async (e) => {
//   const params: any = getQuery(e)
//   const authData = JSON.parse(params.auth)
//   const authorization = await authorize(authData)

//   if (!authorization || !authorization.isOwner) return null

//   const userLinkId = parseInt(params.userLinkId)
//   const isValidated: boolean = Boolean(params.isValidated === 'true')

//   await prisma.eventUser.update({
//     where: {
//       id: userLinkId,
//     },
//     data: {
//       isValidated: isValidated,
//     },
//   })

//   return 'Success'
// })
