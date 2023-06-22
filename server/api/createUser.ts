import prisma from '~/server/prisma'
import authorize from '~/server/authorize'
import { v4 as uuidv4 } from 'uuid'
// @ts-ignore
import nodemailer from 'nodemailer'

import { getLocal as _local } from '~/composables/tools/local'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)

  const email: string = params.email
  const alias: string = params.alias
  const godfather: string = params.godfather
  const fideid: string = params.fideid
  const eventId: number = parseInt(params.eventId)
  const isRegister: boolean = Boolean(params.isRegister === 'true')

  let dates: any = params.dates
  let isMotorized: any
  let isReserve: any

  if (params.isMotorized === 'true') isMotorized = true
  else if (params.isMotorized === 'false') isMotorized = false
  else isMotorized = null

  if (params.isReserve === 'true') isReserve = true
  else if (params.isReserve === 'false') isReserve = false
  else isMotorized = null

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      userLinks: {
        select: {
          isOwner: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  })

  if (event && !event.isOpen) {
    const authData = JSON.parse(params.auth)
    const authorization = await authorize(authData)

    if (!authorization || !authorization.isOwner) return null
  }

  if (!event) return null

  let user = null

  if (email) {
    user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email,
        chosenLanguage: 'fr',
        password: uuidv4().replaceAll('-', ''),
      },
    })
  } else {
    const userLinkExist = await prisma.eventUser.findMany({
      where: {
        userId: user.id,
        eventId: eventId,
      },
    })

    if (userLinkExist.length != 0) {
      return 'linkExist'
    }
  }

  const eventUserCount = await prisma.eventUser.findMany({
    where: {
      eventId: eventId,
    },
  })

  const userLink = await prisma.eventUser.create({
    data: {
      alias: alias,
      godfather: godfather,
      fideid: fideid,
      isMotorized: isMotorized,
      isReserve: isReserve,
      userId: user.id,
      eventId: eventId,
      password: uuidv4().replaceAll('-', ''),
      position: eventUserCount.length,
    },
    select: {
      eventId: true,
      id: true,
      alias: true,
      position: true,
      isHidden: true,
      isPasswordSent: true,
      user: true,
      userId: true,
    },
  })

  if (dates) {
    for (let date of dates) {
      date = JSON.parse(date)

      await prisma.availability.create({
        data: {
          isAvailable: date.isAvailable,
          dateId: date.id,
          userId: user.id,
        },
      })
    }
  }

  if (isRegister) {
    const emailContent = `
    ${_local(['emailText', 'sendPasswordHello'])},<br><br>
    ${_local(['emailText', 'newRegisterInfo'])} : <b>${alias}</b><br><br>
    <a href="${process.env.WEBSITE_HOST}/event/${event.slug}" title="${
      event.name
    }">
    ${_local(['emailText', 'sendPasswordClickhere'])}
    </a><br><br>
    ${_local(['emailText', 'sendPasswordSeeyousoon'])} !
  `

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    for (const ul of event.userLinks) {
      if (ul.isOwner) {
        transporter.sendMail({
          from: `${process.env.EMAIL_AUTHOR} <${process.env.EMAIL_USER}>`,
          to: ul.user.email,
          subject:
            event.name + ' : ' + _local(['emailText', 'newRegisterInfo']),
          html: emailContent,
        })
      }
    }
  }

  return userLink
})
