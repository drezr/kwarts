import prisma from '~/server/prisma'
import authorize from '~/server/authorize'
// @ts-ignore
import nodemailer from 'nodemailer'

import { getLocal as _local } from '~/composables/tools/local'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)
  const authData = JSON.parse(params.auth)
  const authorization = await authorize(authData)

  if (!authorization) return null

  const eventId: number = parseInt(params.eventId)
  const userId: number = parseInt(params.userId)

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  })

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  const eventUser = await prisma.eventUser.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
    },
  })

  const emailContent = `
    ${_local(['email_text', 'send_password_hello'])} ${
    eventUser?.alias
  },<br><br>
    ${_local(['email_text', 'send_password_content'])} <b>
    ${event?.name}</b>:<br><br>
    ${_local(['common', 'email'])}: ${user?.email}<br>
    ${_local(['common', 'password'])}: ${eventUser?.password}<br><br>
    <a href="${process.env.WEBSITE_HOST}" title="${event?.name}">
    ${_local(['email_text', 'send_password_clickhere'])}
    </a><br><br>
    ${_local(['email_text', 'send_password_seeyousoon'])} !
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

  await transporter.sendMail({
    from: `"Contact" <${process.env.EMAIL_USER}>`,
    to: user?.email,
    subject: _local(['email_text', 'send_password_title']),
    html: emailContent,
  })

  await prisma.eventUser.update({
    where: {
      id: eventUser?.id,
    },
    data: {
      isPasswordSent: true,
    }
  })

  return 'Success'
})
