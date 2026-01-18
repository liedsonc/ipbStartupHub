import { notFound, redirect } from 'next/navigation';
import { fetchIdeaWithInterestsServer } from '@/lib/api/server-ideas';
import { IdeaForm } from '@/components/idea/IdeaForm';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getSession } from '@/lib/auth/session';
import { Card, CardBody } from '@/components/ui/Card';

export const dynamic = 'force-dynamic'

interface IdeaEditPageProps {
  params: {
    id: string;
  };
}

export default async function IdeaEditPage({ params }: IdeaEditPageProps) {
  const idea = await fetchIdeaWithInterestsServer(params.id);
  const session = await getSession();
  
  if (!idea) {
    notFound();
  }
  
  if (!session?.user) {
    redirect('/login');
  }
  
  const isOwner = session.user.id === idea.authorId;
  
  if (!isOwner) {
    redirect(`/idea/${params.id}`);
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/idea/${params.id}`}>
        <Button variant="ghost" size="sm" className="mb-6">
          ← Voltar para a Ideia
        </Button>
      </Link>
      
      <Card>
        <CardBody>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Editar Ideia</h1>
          <IdeaForm
            ideaId={params.id}
            initialData={{
              title: idea.title,
              shortDescription: idea.shortDescription,
              description: idea.description,
              category: idea.category,
              stage: idea.stage,
              contactEmail: idea.contactEmail,
              tags: idea.tags,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}

