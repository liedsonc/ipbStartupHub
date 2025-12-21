import { notFound } from 'next/navigation';
import { fetchIdeaWithInterests } from '@/lib/api/ideas';
import { IdeaDetail } from '@/components/idea/IdeaDetail';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface IdeaDetailPageProps {
  params: {
    id: string;
  };
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const idea = await fetchIdeaWithInterests(params.id);
  
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
      
      <IdeaDetail idea={idea} />
    </div>
  );
}

