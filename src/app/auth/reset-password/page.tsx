'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { newPassword } from '@/app/actions/reset'
import Link from 'next/link'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setError(undefined)
    setSuccess(undefined)
    setIsLoading(true)

    try {
      const data = await newPassword(password, token)
      setError(data.error)
      setSuccess(data.success)
    } catch (err) {
      setError('Ocorreu um erro ao processar seu pedido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Nova Senha</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Insira sua nova senha
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nova Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmar Nova Senha
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Voltar para o login
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Suspense fallback={<div>Carregando...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  )
}
