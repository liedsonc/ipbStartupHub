'use client';

import { useState } from 'react';
import { InterestType, Idea } from '@/types';
import { Button } from '../ui/Button';
import { createInterest } from '@/lib/api/ideas';
import { useToast } from '@/lib/hooks/useToast';
import { useInbox } from '@/lib/hooks/useInbox';
import { Modal } from '../ui/Modal';

interface InterestButtonProps {
  ideaId: string;
  idea: Idea;
  interestType: InterestType;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onInterestAdded?: () => void;
}

const simulatedPersonId = 'person-001';
const simulatedPersonName = 'Você';
const simulatedPersonRole = 'Estudante';

export function InterestButton({
  ideaId,
  idea,
  interestType,
  label,
  variant = 'primary',
  onInterestAdded,
}: InterestButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasInterested, setHasInterested] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showSuccess } = useToast();
  const { addRequest } = useInbox();
  
  const handleClick = () => {
    if (hasInterested || isLoading) return;
    setShowConfirm(true);
  };
  
  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    
    try {
      await createInterest(ideaId, simulatedPersonId, interestType);
      
      setHasInterested(true);
      
      if (interestType === InterestType.Collaborate) {
        addRequest(idea, simulatedPersonName, simulatedPersonRole);
        showSuccess('Solicitação de colaboração enviada! Verifique sua caixa de entrada.');
      } else {
        showSuccess('Interesse expresso com sucesso!');
      }
      
      onInterestAdded?.();
    } catch (error) {
      console.error('Failed to add interest:', error);
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
        <p className="text-gray-700">{getConfirmationMessage()}</p>
      </Modal>
    </>
  );
}

