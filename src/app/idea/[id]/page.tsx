import { notFound } from 'next/navigation';
import { fetchIdeaWithInterestsServer } from '@/lib/api/server-ideas';
import { IdeaDetail } from '@/components/idea/IdeaDetail';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic'

interface IdeaDetailPageProps {
  params: {
    id: string;
  };
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const idea = await fetchIdeaWithInterestsServer(params.id);
  const session = await getSession();
  
  if (!idea) {
    notFound();
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/browse">
        <Button variant="ghost" size="sm" className="mb-6">
          ← Voltar para Explorar
        </Button>
      </Link>
      
      <IdeaDetail idea={idea} currentUserId={session?.user?.id} />
    </div>
  );
}

