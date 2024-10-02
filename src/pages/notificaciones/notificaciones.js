import { ListEmpty, Loading, ProtectedRoute, Title } from '@/components/Layouts';
import { useAuth } from '@/contexts/AuthContext';
import { BasicLayout } from '@/layouts';
import axios from 'axios';
import { map, size } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useNotification } from '@/contexts/NotificationContext'
import styles from './notificaciones.module.css';

export default function Notificaciones() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState([]);
  const [userNotificaciones, setUserNotificaciones] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const { incrementUnreadCount, decrementUnreadCount } = useNotification()

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        // Obtener todas las notificaciones
        const allResponse = await axios.get('/api/notificaciones/notificaciones');
        setNotificaciones(allResponse.data);

        // Obtener notificaciones para el usuario específico
        if (user) {
          const userResponse = await axios.get('/api/notificaciones/notificaciones', {
            params: { usuario_id: user.id }
          });
          setUserNotificaciones(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificaciones();
  }, [user]);

  const markAsRead = async (notificacion_id) => {
    try {
      const response = await axios.put('/api/notificaciones/mark-as-read', { usuario_id: user.id, notificacion_id, is_read: 1 });
      if (response.status === 200) {
        setUserNotificaciones((prev) =>
          prev.map((notificacion) =>
            notificacion.id === notificacion_id ? { ...notificacion, is_read: 1 } : notificacion
          )
        );
        decrementUnreadCount(); // Llama a la función para decrementar el contador
    
      } else {
        console.error('Error al marcar la notificación como leída:', response.data);
      }
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };
  
  const markAsUnread = async (notificacion_id) => {
    try {
      const response = await axios.put('/api/notificaciones/mark-as-read', { usuario_id: user.id, notificacion_id, is_read: 0 });
      if (response.status === 200) {
        setUserNotificaciones((prev) =>
          prev.map((notificacion) =>
            notificacion.id === notificacion_id ? { ...notificacion, is_read: 0 } : notificacion
          )
        );
        incrementUnreadCount(); // Llama a la función para incrementar el contador
    
      } else {
        console.error('Error al marcar la notificación como no leída:', response.data);
      }
    } catch (error) {
      console.error('Error marcando como no leída:', error);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading size={45} loading={0} />;
  }

  const combinedNotificaciones = [...notificaciones, ...userNotificaciones];
  const uniqueNotificaciones = Array.from(
    new Map(combinedNotificaciones.map((item) => [item.id, item])).values()
  );

  return (
    <ProtectedRoute>
      <BasicLayout relative>
        <Title title='notificaciones' />
        {showLoading ? (
          <Loading size={45} loading={1} />
        ) : size(uniqueNotificaciones) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            <div className={styles.iconDel}>
              <FaTrash />
            </div>
            {map(uniqueNotificaciones, (notificacion) => (
              <div key={notificacion.id} className={styles.section}>
                <div onClick={() => router.push(notificacion.url)}>
                  <div className={styles.column1}>
                    <FaBell />
                  </div>
                  <div className={styles.column2}>
                    <div>
                      <h1>Notificación</h1>
                      <h2>{notificacion.header}</h2>
                    </div>
                    <div>
                      <h1>Mensaje</h1>
                      <h2>{notificacion.message}</h2>
                    </div>
                  </div>
                </div>
                <div className={styles.iconCheck}>
                  {notificacion.is_read === 1 ? (
                    <FaCheck className={styles.checkActive} onClick={() => markAsUnread(notificacion.id)} />
                  ) : (
                    <FaCheck onClick={() => markAsRead(notificacion.id)} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </BasicLayout>
    </ProtectedRoute>
  );
}
