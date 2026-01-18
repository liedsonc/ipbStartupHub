import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const { prisma } = await import('@/lib/db/prisma')
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true
    }
  })

  if (!dbUser) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <p className="text-gray-900">{dbUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{dbUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <p className="text-gray-900">{dbUser.role}</p>
              </div>
              {dbUser.affiliation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Afiliação</label>
                  <p className="text-gray-900">{dbUser.affiliation}</p>
                </div>
              )}
              {dbUser.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
                  <p className="text-gray-900">{dbUser.bio}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Estatísticas</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Ideias Criadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {await prisma.idea.count({ where: { userId: user.id } })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Interesses Expressos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {await prisma.interestSignal.count({ where: { userId: user.id } })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Membro desde</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(dbUser.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

