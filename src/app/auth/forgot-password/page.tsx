'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { resetPasswordRequest } from '@/app/actions/reset'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setSuccess(undefined)
    setIsLoading(true)

    try {
      const data = await resetPasswordRequest(email)
      setError(data.error)
      setSuccess(data.success)
    } catch (err) {
      setError('Ocorreu um erro ao processar seu pedido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Recuperar Senha</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
            Insira seu email para receber um link de recuperação
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Email de Recuperação'}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                Voltar para o login
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
