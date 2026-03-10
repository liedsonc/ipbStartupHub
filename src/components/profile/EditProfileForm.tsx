'use client';

import { useState } from 'react';
import { updateProfileAction } from '@/app/actions/user';
import { Button, Input, Avatar } from '@/components/ui';
import { useToast } from '@/lib/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
    affiliation?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
  };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [affiliation, setAffiliation] = useState(user.affiliation || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateProfileAction({
      name,
      affiliation,
      bio,
      avatarUrl,
    });

    setIsLoading(false);

    if (result.success) {
      await update({
        name,
        image: avatarUrl
      });
      showSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
      router.refresh();
    } else {
      showError(result.error || 'Erro ao atualizar perfil');
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <Avatar name={user.name} src={user.avatarUrl} size="xl" />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Afiliação</label>
            <p className="text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[40px]">
              {user.affiliation || <span className="text-gray-400 italic">Não informada</span>}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Biografia</label>
            <p className="text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[80px] whitespace-pre-wrap">
              {user.bio || <span className="text-gray-400 italic">Nenhuma biografia adicionada</span>}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Avatar name={name} src={avatarUrl} size="xl" />
        <p className="text-sm text-gray-500">Prévia do perfil</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="URL da Foto do Perfil"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://exemplo.com/sua-foto.jpg"
        />
        <Input
          label="Afiliação"
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          placeholder="Ex: IPB, Empresa X, etc."
        />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Biografia
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte-nos um pouco sobre você..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
