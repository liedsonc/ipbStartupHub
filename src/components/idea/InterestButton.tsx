'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { InterestType, Idea } from '@/types';
import { Button } from '../ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { Modal } from '../ui/Modal';

interface InterestButtonProps {
  ideaId: string;
  idea: Idea;
  interestType: InterestType;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onInterestAdded?: () => void;
  hasInterested?: boolean;
}

export function InterestButton({
  ideaId,
  idea,
  interestType,
  label,
  variant = 'primary',
  onInterestAdded,
  hasInterested: initialHasInterested = false,
}: InterestButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasInterested, setHasInterested] = useState(initialHasInterested);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showSuccess, showError } = useToast();
  
  const handleClick = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    if (hasInterested || isLoading) return;
    setShowConfirm(true);
  };
  
  const handleConfirm = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setShowConfirm(false);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          interestType,
          message: null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao expressar interesse');
      }
      
      setHasInterested(true);
      
      if (interestType === InterestType.Collaborate || interestType === InterestType.Fund) {
        const actionText = interestType === InterestType.Collaborate ? 'colaboração' : 'financiamento';
        showSuccess(`Solicitação de ${actionText} enviada! O autor da ideia foi notificado.`);
      } else {
        showSuccess('Interesse expresso com sucesso!');
      }
      
      onInterestAdded?.();
      router.refresh();
    } catch (error: any) {
      console.error('Failed to add interest:', error);
      showError(error.message || 'Erro ao expressar interesse');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getConfirmationMessage = () => {
    switch (interestType) {
      case InterestType.Collaborate:
        return `Enviar uma solicitação de colaboração para "${idea.title}"? Isso notificará o autor da ideia.`;
      case InterestType.Fund:
        return `Expressar interesse em financiar "${idea.title}"?`;
      default:
        return `Expressar interesse em "${idea.title}"?`;
    }
  };
  
  return (
    <>
      <Button
        variant={hasInterested ? 'secondary' : variant}
        onClick={handleClick}
        disabled={isLoading || hasInterested}
        className="w-full sm:w-auto"
      >
        {isLoading ? 'Processando...' : hasInterested ? '✓ Interessado' : label}
      </Button>
      
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar Interesse"
        onConfirm={handleConfirm}
        confirmLabel="Sim, tenho interesse"
      >
        <p className="text-gray-700 dark:text-gray-300">{getConfirmationMessage()}</p>
      </Modal>
    </>
  );
}

