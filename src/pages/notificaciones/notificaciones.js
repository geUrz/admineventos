import { ListEmpty, Loading, ProtectedRoute, Title } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout } from '@/layouts'
import axios from 'axios'
import { map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import styles from './notificaciones.module.css'
import { FaBell, FaCheck, FaReadme, FaTrash } from 'react-icons/fa'
import { useRouter } from 'next/router'

export default function Notificaciones() {

  const {user, loading} = useAuth()

  const router = useRouter()

  const [notificaciones, setNotificaciones] = useState([])
  const [userNotificaciones, setUserNotificaciones] = useState([])
  const [showLoading, setShowLoading] = useState(true)

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

        await axios.put('/api/notificaciones/mark-as-read', { usuario_id: user.id })

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificaciones();
  }, [user])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  const combinedNotificaciones = [...notificaciones, ...userNotificaciones];
  const uniqueNotificaciones = Array.from(
    new Map(combinedNotificaciones.map((item) => [item.id, item])).values()
  )

  return (
    
    <ProtectedRoute>

      <BasicLayout relative>

      <Title title='notificaciones' />

      {showLoading ? (
          <Loading size={45} loading={1} />
        ) : (
          size(uniqueNotificaciones) === 0 ? (
            <ListEmpty />
          ) : (
            <div className={styles.main}>
              <div className={styles.iconDel}>
                <FaTrash />
              </div>
              {map(uniqueNotificaciones, (notificacion) => (
                <div key={notificacion.id} className={styles.section} onClick={() => router.push(notificacion.url)}>
                  <div>
                    <div className={styles.column1}>
                      <FaBell />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Notificación</h1>
                        <h2>{notificacion.header}</h2>
                      </div>
                      <div >
                        <h1>Mensaje</h1>
                        <h2>{notificacion.message}</h2>
                      </div>
                      <div>
                        {notificacion.is_read === 1 ? (
                          <FaCheck className={styles.checkActive} />
                        ) : (
                          notificacion.is_read === 0 ? (
                            <FaCheck />
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </BasicLayout>

    </ProtectedRoute>

  )
}
