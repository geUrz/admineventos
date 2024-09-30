import { Image } from 'semantic-ui-react'
import { FaBars, FaBell, FaCalendarAlt, FaFileSignature, FaHome, FaTimes, FaUserCircle, FaUserFriends, FaFileAlt, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaUsers } from 'react-icons/fa'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import styles from './Menu.module.css'

export function Menu() {

  const {user} = useAuth()

  const router = useRouter()

  const [menu, setMenu] = useState(false)

  const onMenu = () => setMenu((prevState) => !prevState)

  return (

    <>
    
      <div className={styles.mainTop}>
        <div className={styles.iconBell} onClick={onMenu}>
          <FaBell />
        </div>
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

      <div className={styles.mainMenuSide} style={{left : menu ? '0' : '-100%'}} onClick={onMenu}>
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
