import { BasicLayout } from '@/layouts'
import { CreateBox, Loading, ProtectedRoute, Title } from '@/components/Layouts'
import styles from './invitados.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { InvitadosLista } from '@/components/Invitados'
import { CountBox } from '@/components/Layouts/CountBox'
import { FaQrcode, FaUsers } from 'react-icons/fa'
import { size } from 'lodash'
import { useRouter } from 'next/router'

export default function Invitados() {

  const {loading} = useAuth()

  const router = useRouter()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [invitados, setInvitados] = useState(null)

  const countAll = size(invitados)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/invitados/invitados')
        setInvitados(res.data)
      } catch (error) {
          console.error(error)
      }
    })()
  }, [reload])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    
    <ProtectedRoute>
      <BasicLayout relative onReload={onReload}>

        <Title title='clientes creando invitados' />

        <div className={styles.countBox}>
          <CountBox
            title='clientes'
            icon={<FaUsers />}
            count={{ countAll }}
          />
        </div>

        <InvitadosLista reload={reload} onReload={onReload} invitados={invitados} />

      </BasicLayout>
    </ProtectedRoute>

  )
}
