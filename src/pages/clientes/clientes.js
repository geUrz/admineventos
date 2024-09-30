import { CreateBox, Loading, ProtectedRoute, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { BasicLayout, BasicModal } from '@/layouts'
import { ClienteForm, ClientesLista } from '@/components/Clientes'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { size } from 'lodash'
import { CountBox } from '@/components/Layouts/CountBox'
import { FaPlus, FaUsers } from 'react-icons/fa'
import styles from './clientes.module.css'

export default function Clientes() {

  const { loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessClienteMod, setToastSuccessClienteMod] = useState(false)
  const [toastSuccessClienteDel, setToastSuccessClienteDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessClienteMod = () => {
    setToastSuccessClienteMod(true)
    setTimeout(() => {
      setToastSuccessClienteMod(false)
    }, 3000)
  }

  const onToastSuccessClienteDel = () => {
    setToastSuccessClienteDel(true)
    setTimeout(() => {
      setToastSuccessClienteDel(false)
    }, 3000)
  }

  const [clientes, setClientes] = useState(null)

  const countAll = size(clientes)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/clientes/clientes')
        setClientes(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='Clientes' relative>

        {toastSuccess && <ToastSuccess contain='Cliente creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessClienteMod && <ToastSuccess contain='Cliente modificado exitosamente' onClose={() => setToastSuccessClienteMod(false)} />}

        {toastSuccessClienteDel && <ToastDelete contain='Cliente eliminado exitosamente' onClose={() => setToastSuccessClienteDel(false)} />}

        <Title title='clientes' />

        <div className={styles.countBox}>
          <CountBox
            title='Clientes'
            icon={<FaUsers />}
            count={{ countAll }}
          />
          <CreateBox
            title='Crear'
            icon={<FaPlus />}
            click={onOpenClose}
          />
        </div>

        <ClientesLista reload={reload} onReload={onReload} clientes={clientes} onToastSuccessClienteMod={onToastSuccessClienteMod} onToastSuccessClienteDel={onToastSuccessClienteDel} />

      </BasicLayout>

      <BasicModal title='crear cliente' show={show} onClose={onOpenClose}>
        <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
