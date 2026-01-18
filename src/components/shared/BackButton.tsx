'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className = '' }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => router.back()}
    >
      ← Voltar
    </Button>
  );
}

