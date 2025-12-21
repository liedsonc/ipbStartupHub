'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Idea } from '@/types';

interface CollaborationRequest {
  id: string;
  ideaId: string;
  ideaTitle: string;
  requesterName: string;
  requesterRole: string;
  message?: string;
  createdAt: string;
  read: boolean;
}

interface InboxContextType {
  requests: CollaborationRequest[];
  unreadCount: number;
  addRequest: (idea: Idea, requesterName: string, requesterRole: string, message?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeRequest: (id: string) => void;
}

const InboxContext = createContext<InboxContextType | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);

  const addRequest = useCallback((
    idea: Idea,
    requesterName: string,
    requesterRole: string,
    message?: string
  ) => {
    const newRequest: CollaborationRequest = {
      id: Math.random().toString(36).substring(7),
      ideaId: idea.id,
      ideaTitle: idea.title,
      requesterName,
      requesterRole,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setRequests((prev) => [newRequest, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, read: true } : req))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setRequests((prev) => prev.map((req) => ({ ...req, read: true })));
  }, []);

  const removeRequest = useCallback((id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  }, []);

  const unreadCount = requests.filter((req) => !req.read).length;

  return (
    <InboxContext.Provider
      value={{
        requests,
        unreadCount,
        addRequest,
        markAsRead,
        markAllAsRead,
        removeRequest,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error('useInbox must be used within InboxProvider');
  }
  return context;
}

