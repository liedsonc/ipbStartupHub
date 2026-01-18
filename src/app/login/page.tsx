import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Startup Hub IPB</h1>
          <p className="mt-2 text-gray-600">Hub de Startups Universitário</p>
        </div>
        <LoginForm />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-violet-600 hover:text-violet-700 font-medium">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

