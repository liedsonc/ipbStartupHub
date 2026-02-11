import { generateVerificationToken, generatePasswordResetToken } from '@/lib/tokens'
import { prisma } from '@/lib/db/prisma'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    verificationToken: {
      findFirst: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
    passwordResetToken: {
      findFirst: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe('Tokens', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('generates verification token', async () => {
    ;(prisma.verificationToken.findFirst as jest.Mock).mockResolvedValue(null)
    ;(prisma.verificationToken.create as jest.Mock).mockResolvedValue({ token: 'test-token' })

    const token = await generateVerificationToken('test@example.com')
    expect(token).toBeDefined()
    expect(prisma.verificationToken.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        email: 'test@example.com'
      })
    }))
  })

  it('generates password reset token', async () => {
    ;(prisma.passwordResetToken.findFirst as jest.Mock).mockResolvedValue(null)
    ;(prisma.passwordResetToken.create as jest.Mock).mockResolvedValue({ token: 'test-token' })

    const token = await generatePasswordResetToken('test@example.com')
    expect(token).toBeDefined()
    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        email: 'test@example.com'
      })
    }))
  })
})
