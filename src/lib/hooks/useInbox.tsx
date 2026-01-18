'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface CollaborationRequest {
  id: string;
  ideaId: string;
  ideaTitle: string;
  requesterId: string | null;
  requesterName: string;
  requesterRole: string;
  requesterEmail?: string;
  message?: string;
  createdAt: string;
  read: boolean;
  type: 'collaboration' | 'funding';
}

interface InboxContextType {
  requests: CollaborationRequest[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeRequest: (id: string) => void;
  refresh: () => void;
}

const InboxContext = createContext<InboxContextType | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Erro ao buscar notificações');
      }

      const notifications = await response.json();
      
      const collaborationNotifications = notifications.filter(
        (n: any) => n.type === 'collaboration' || n.type === 'funding'
      );

      const requestsWithDetails: CollaborationRequest[] = notifications
        .filter((n: any) => n.ideaId)
        .map((notification: any) => ({
          id: notification.id,
          ideaId: notification.ideaId,
          ideaTitle: notification.ideaTitle || 'Ideia',
          requesterId: notification.requesterId || null,
          requesterName: notification.requesterName || 'Usuário',
          requesterRole: notification.requesterRole || 'Usuário',
          message: notification.interestMessage || null,
          createdAt: notification.createdAt,
          read: notification.read,
          type: notification.type
        }));

      setRequests(requestsWithDetails);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true })
      });

      if (response.ok) {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, read: true } : req))
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = requests.filter(req => !req.read).map(req => req.id);
      await Promise.all(unreadIds.map(id => 
        fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, read: true })
        })
      ));
      
      setRequests((prev) => prev.map((req) => ({ ...req, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [requests]);

  const removeRequest = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
      }
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  }, []);

  const unreadCount = requests.filter((req) => !req.read).length;

  return (
    <InboxContext.Provider
      value={{
        requests,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        removeRequest,
        refresh: fetchNotifications,
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

