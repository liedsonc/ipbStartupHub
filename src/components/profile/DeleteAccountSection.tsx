'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Card, CardBody, CardHeader, Button, Modal } from '../ui';
import { useToast } from '@/lib/hooks/useToast';

interface DeleteAccountSectionProps {
  userId: string;
  ideaCount: number;
}

export function DeleteAccountSection({ userId, ideaCount }: DeleteAccountSectionProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'APAGAR') {
      showError('Por favor, digite "APAGAR" para confirmar');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao apagar conta');
      }

      showSuccess('Conta apagada com sucesso!');
      await signOut({ callbackUrl: '/' });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      showError(error.message || 'Falha ao apagar conta. Tente novamente.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Zona de Perigo
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Ao apagar sua conta, todas as suas informações serão permanentemente removidas.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Isso inclui:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                <li>Todas as suas ideias ({ideaCount} {ideaCount === 1 ? 'ideia' : 'ideias'})</li>
                <li>Seus interesses expressos</li>
                <li>Seu perfil e informações pessoais</li>
                <li>Todas as notificações relacionadas</li>
              </ul>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Apagar Minha Conta
            </Button>
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConfirmText('');
        }}
        title="Apagar Conta"
        onConfirm={handleDeleteAccount}
        confirmLabel={isDeleting ? 'Apagando...' : 'Sim, apagar minha conta'}
        showCancel={true}
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Tem certeza absoluta que deseja apagar sua conta? Esta ação é permanente e não pode ser desfeita.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-2">
              Todas as suas ideias serão apagadas:
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">
              {ideaCount} {ideaCount === 1 ? 'ideia será' : 'ideias serão'} permanentemente removida{ideaCount === 1 ? '' : 's'}.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Para confirmar, digite <span className="font-mono font-bold">APAGAR</span>:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Digite APAGAR"
              disabled={isDeleting}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

