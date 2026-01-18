import { IdeaForm } from '@/components/idea/IdeaForm';
import { Card, CardBody } from '@/components/ui/Card';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const dynamic = 'force-dynamic'

export default function SubmitPage() {
  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Enviar Sua Ideia de Startup</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compartilhe sua ideia inovadora com a comunidade. Preencha o formulário abaixo para começar.
          </p>
        </div>
        
        <Card>
          <CardBody>
            <IdeaForm />
          </CardBody>
        </Card>
      </div>
    </AuthGuard>
  );
}

