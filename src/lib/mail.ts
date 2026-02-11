import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const domain = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verify?token=${token}`

  if (!resend) {
    console.log(`Verification email to ${email}: ${confirmLink}`)
    return
  }

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirme seu email',
    html: `<p>Clique <a href="${confirmLink}">aqui</a> para confirmar seu email.</p>`
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`

  if (!resend) {
    console.log(`Password reset email to ${email}: ${resetLink}`)
    return
  }

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Recuperação de senha',
    html: `<p>Clique <a href="${resetLink}">aqui</a> para resetar sua senha.</p>`
  })
}
