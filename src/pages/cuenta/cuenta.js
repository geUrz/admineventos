import { BasicModal } from '@/layouts'
import { Loading, ProtectedRoute, Title } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { FaEdit, FaUser } from 'react-icons/fa'
import { Button } from 'semantic-ui-react'
import { ModCuentaForm } from '@/components/Cuenta'
import { useState } from 'react'
import styles from './cuenta.module.css'

export default function Cuenta() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const { user, logout, loading } = useAuth()

  if (loading) {
    <Loading size={45} loading={1} />
  }

  return (

    <ProtectedRoute>

      <Title title='Cuenta' iconBack />

        <div className={styles.main}>
          <div className={styles.section}>
            <FaUser />
            
            {!user ? (
              ''
            ) : (
              <>
              
                <h1>{user.usuario}</h1>
                <h2>{user.email}</h2>
              
              </>
            )}

            <div className={styles.iconEdit}>
              <div onClick={onOpenClose}>
                <FaEdit />
              </div>
            </div>

            <Button negative onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>

        <BasicModal title='modificar cuenta' show={show} onClose={onOpenClose}>
          <ModCuentaForm onOpenClose={onOpenClose} />
        </BasicModal>

    </ProtectedRoute>

  )
}
