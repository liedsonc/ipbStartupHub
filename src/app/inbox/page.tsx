'use client';

import { useInbox } from '@/lib/hooks/useInbox';
import { Card, CardBody, Badge, Button } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils/format';

export default function InboxPage() {
  const { requests, unreadCount, loading, markAsRead, markAllAsRead, removeRequest } = useInbox();
  
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };
  
  const handleRemove = (id: string) => {
    removeRequest(id);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Caixa de Entrada</h1>
          <p className="text-gray-600">
            Gerencie solicitações de colaboração e financiamento para suas ideias.
          </p>
        </div>
        {requests.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Marcar todas como lidas
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando notificações...</p>
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="Nenhuma notificação"
          description="Quando alguém expressar interesse em colaborar ou financiar suas ideias, as notificações aparecerão aqui."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className={request.read ? 'opacity-75' : 'border-violet-300'}
            >
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {request.requesterId ? (
                        <Link
                          href={`/user/${request.requesterId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-violet-600"
                        >
                          {request.requesterName}
                        </Link>
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.requesterName}
                        </h3>
                      )}
                      {!request.read && (
                        <Badge variant="primary" className="text-xs">
                          Novo
                        </Badge>
                      )}
                      <Badge variant="default" className="text-xs">
                        {request.requesterRole === 'Estudante' ? 'Estudante' : 
                         request.requesterRole === 'Professor' ? 'Professor' :
                         request.requesterRole === 'Investidor' ? 'Investidor' :
                         request.requesterRole === 'Mentor' ? 'Mentor' :
                         request.requesterRole === 'Ex-aluno' ? 'Ex-aluno' :
                         request.requesterRole === 'Externo' ? 'Externo' : request.requesterRole}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {request.type === 'collaboration' ? 'Quer colaborar em:' : 'Quer financiar:'}{' '}
                      <Link
                        href={`/idea/${request.ideaId}`}
                        className="text-violet-600 hover:underline font-medium"
                      >
                        {request.ideaTitle}
                      </Link>
                    </p>
                    
                    {request.message && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mt-2">
                        {request.message}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-3">
                      {formatRelativeTime(request.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {request.requesterId && (
                      <Link href={`/user/${request.requesterId}`}>
                        <Button variant="primary" size="sm" className="w-full">
                          Ver Perfil
                        </Button>
                      </Link>
                    )}
                    {!request.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(request.id)}
                      >
                        Marcar como lida
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(request.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

