// context/NotificationContext.tsx → hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { fetchNotifications, fetchUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/api';
import { useAuth } from './useAuth';

interface Notification {
  id: number;
  id_patient: number;
  message: string;
  type: string;
  statut: number;
  date_creation: string;
  date_lu: string | null;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [notifsData, countData] = await Promise.all([
        fetchNotifications(user.id),
        fetchUnreadNotificationsCount(user.id)
      ]);
      
      setNotifications(notifsData);
      setUnreadCount(countData.count_non_lu);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      // Mettre à jour localement
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, statut: 1, date_lu: new Date().toISOString() } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur marquage comme lu:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      // Mettre à jour localement
      setNotifications(prev => prev.map(notif => ({
        ...notif,
        statut: 1,
        date_lu: notif.statut === 0 ? new Date().toISOString() : notif.date_lu
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur marquage tous comme lus:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      
      // Recharger toutes les 30 secondes (optionnel)
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    markAsRead,
    markAllAsRead
  };
};