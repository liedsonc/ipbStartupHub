import { IdeaForm } from '@/components/idea/IdeaForm';
import { Card, CardBody } from '@/components/ui/Card';

export default function SubmitPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enviar Sua Ideia de Startup</h1>
        <p className="text-gray-600">
          Compartilhe sua ideia inovadora com a comunidade. Preencha o formulário abaixo para começar.
        </p>
      </div>
      
      <Card>
        <CardBody>
          <IdeaForm />
        </CardBody>
      </Card>
    </div>
  );
}

