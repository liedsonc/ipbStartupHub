'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { verifyEmail } from '@/app/actions/verify'

function VerifyContent() {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError('Token faltando')
      return
    }

    verifyEmail(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError('Ocorreu um erro inesperado')
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Verificação de Email</h2>
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center space-y-4">
        {!success && !error && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        )}

        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md w-full text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md w-full text-center">
            {error}
          </div>
        )}

        <Link href="/login" className="text-primary hover:underline">
          Voltar para o login
        </Link>
      </CardBody>
    </Card>
  )
}

export default function VerifyPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Suspense fallback={<div>Carregando...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}
