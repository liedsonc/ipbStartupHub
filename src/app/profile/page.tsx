import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { DeleteAccountSection } from '@/components/profile/DeleteAccountSection'

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

  const ideaCount = await prisma.idea.count({ 
    where: { 
      userId: user.id,
      deletedAt: null
    } 
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Meu Perfil</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Informações Pessoais</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                <p className="text-gray-900 dark:text-gray-100">{dbUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <p className="text-gray-900 dark:text-gray-100">{dbUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Perfil</label>
                <p className="text-gray-900 dark:text-gray-100">{dbUser.role}</p>
              </div>
              {dbUser.affiliation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Afiliação</label>
                  <p className="text-gray-900 dark:text-gray-100">{dbUser.affiliation}</p>
                </div>
              )}
              {dbUser.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Biografia</label>
                  <p className="text-gray-900 dark:text-gray-100">{dbUser.bio}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Estatísticas</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ideias Criadas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {await prisma.idea.count({ where: { userId: user.id } })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Interesses Expressos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {await prisma.interestSignal.count({ where: { userId: user.id } })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Membro desde</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {new Date(dbUser.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <DeleteAccountSection userId={user.id} ideaCount={ideaCount} />
      </div>
    </div>
  )
}

