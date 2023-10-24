import prisma from '~/server/prisma'
import authorize from '~/server/authorize'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
// @ts-ignore
import nodemailer from 'nodemailer'

import { getLocal as _local } from '~/composables/tools/local'

export default defineEventHandler(async (e) => {
  const params: any = getQuery(e)

  const email: string = params.email

  if (email) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    if (user) {
      const salt = crypto.randomBytes(16).toString('hex')
      const newPassword = uuidv4().replaceAll('-', '')
      const newPasswordHash = crypto
        .pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512')
        .toString('hex')

      const emailContent = `
        ${_local(['emailText', 'sendPasswordHello'])} <b>${
        user.email
      }</b>,<br><br>
        ${_local([
          'emailText',
          'sendNewPasswordContent',
        ])}: <b>${newPassword}</b><br><br>
        ${_local(['emailText', 'sendNewPasswordCanUpdate'])}.<br><br>
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

      await transporter.sendMail({
        from: `${process.env.EMAIL_AUTHOR} <${process.env.EMAIL_USER}>`,
        to: user?.email,
        subject: _local(['emailText', 'sendPasswordTitle']),
        html: emailContent,
      })

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: newPasswordHash,
          salt: salt,
        },
      })

      return true
    }
  }

  return false
})
