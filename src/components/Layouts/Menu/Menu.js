import { Image } from 'semantic-ui-react'
import { FaBars, FaBell, FaCalendarAlt, FaFileSignature, FaHome, FaTimes, FaUserCircle, FaUserFriends, FaFileAlt, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaUsers } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import styles from './Menu.module.css'
import axios from 'axios'
import { useNotification } from '@/contexts/NotificationContext'

export function Menu() {

  const { user } = useAuth()

  const router = useRouter()

  const [menu, setMenu] = useState(false)

  const onMenu = () => setMenu((prevState) => !prevState);

  const { unreadCount, setUnreadCount } = useNotification(); // Obtiene el contador y la función para actualizarlo

  const fetchUnreadCount = async () => {
    if (user && user.id) {
      try {
        const response = await axios.get('/api/notificaciones/unread-count', {
          params: { usuario_id: user.id }
        });
        setUnreadCount(response.data.count); // Actualiza el contador en el contexto
      } catch (error) {
        console.error('Error fetching unread notifications count:', error);
      }
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchUnreadCount(); // Llama a la función para obtener el conteo al montar
    }
  }, [user])

  return (

    <>

      <div className={styles.mainTop}>
        <Link href='/notificaciones' className={styles.mainNoti}>
          <FaBell />
          {unreadCount > 0 && <span className={styles.notiCount}>{unreadCount}</span>}
        </Link>
        <Link href='/'>
          <Image src='img/admineventos_logo.webp' />
        </Link>
        <div className={styles.iconBar} onClick={onMenu}>
          {menu ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </div>
      </div>

      <div className={styles.mainMenuSide} style={{ left: menu ? '0' : '-100%' }} onClick={onMenu}>
        <div className={styles.menuTop} onClick={() => router.push('cuenta')}>
          <FaUserCircle />
          <h1>{user.usuario}</h1>
        </div>
        <div className={styles.menuList}>
          <Link href='/'>
            <FaHome />
            <h1>Panel</h1>
          </Link>
          <Link href='eventos'>
            <FaCalendarAlt />
            <h1>Eventos</h1>
          </Link>
          <Link href='contratos'>
            <FaFileContract />
            <h1>Contratos</h1>
          </Link>
          <Link href='cotizaciones'>
            <FaFileAlt />
            <h1>Cotizaciones</h1>
          </Link>
          <Link href='recibos'>
            <FaFileInvoice />
            <h1>Recibos</h1>
          </Link>
          <Link href='facturas'>
            <FaFileSignature />
            <h1>Facturas</h1>
          </Link>
          <Link href='cuentas'>
            <FaFileInvoiceDollar />
            <h1>Cuentas</h1>
          </Link>
          <Link href='clientes'>
            <FaUsers />
            <h1>Clientes</h1>
          </Link>
          <Link href='invitados'>
            <FaUserFriends />
            <h1>Invitados</h1>
          </Link>
        </div>
      </div>

    </>

  )
}
