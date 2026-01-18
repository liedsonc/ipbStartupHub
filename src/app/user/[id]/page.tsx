import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { Card, CardBody, CardHeader, Badge, Button } from '@/components/ui';
import { BackButton } from '@/components/shared/BackButton';

export const dynamic = 'force-dynamic'

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

const roleLabels: Record<string, string> = {
  Student: 'Estudante',
  Alumni: 'Ex-aluno',
  Professor: 'Professor',
  Mentor: 'Mentor',
  Investor: 'Investidor',
  External: 'Externo',
  Admin: 'Administrador'
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { prisma } = await import('@/lib/db/prisma')
  const session = await getSession()
  
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: true
    }
  })

  if (!user || user.deletedAt) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton className="mb-6" />

      <Card className="mb-6">
        <CardBody>
          <div className="flex items-start gap-6">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-violet-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <Badge variant="default">
                  {roleLabels[user.role] || user.role}
                </Badge>
              </div>
              
              {user.affiliation && (
                <p className="text-gray-600 mb-2">{user.affiliation}</p>
              )}
              
              {user.bio && (
                <p className="text-gray-700 mt-4">{user.bio}</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Informações de Contato</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">{user.email}</p>
                  {!isOwnProfile && (
                    <a
                      href={`mailto:${user.email}?subject=Interesse em colaborar`}
                      className="text-violet-600 hover:text-violet-700 font-medium"
                    >
                      <Button variant="outline" size="sm">
                        Enviar Email
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              
              {user.profile?.socialLinks && typeof user.profile.socialLinks === 'object' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Links Sociais</label>
                  <div className="space-y-2">
                    {Object.entries(user.profile.socialLinks as Record<string, string>).map(([key, value]) => (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-600 hover:text-violet-700 block"
                      >
                        {key}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {user.profile && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Habilidades</h2>
            </CardHeader>
            <CardBody>
              {user.profile.skills && user.profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.profile.skills.map((skill, index) => (
                    <Badge key={index} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma habilidade listada</p>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

