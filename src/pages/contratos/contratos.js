import { CreateBox, Loading, ProtectedRoute, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import styles from './contratos.module.css'
import { BasicLayout, BasicModal } from '@/layouts'
import { CountBox } from '@/components/Layouts/CountBox'
import { size } from 'lodash'
import { useEffect, useState } from 'react'
import { FaFileContract, FaPlus } from 'react-icons/fa'
import axios from 'axios'
import { ContratoForm, ContratosLista } from '@/components/Contratos'
import { useAuth } from '@/contexts/AuthContext'

export default function contratos() {

  const {loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessContratoMod, setToastSuccessContratoMod] = useState(false)
  const [toastSuccessContratoDel, setToastSuccessContratoDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessContratoMod = () => {
    setToastSuccessContratoMod(true)
    setTimeout(() => {
      setToastSuccessContratoMod(false)
    }, 3000)
  }

  const onToastSuccessContratoDel = () => {
    setToastSuccessContratoDel(true)
    setTimeout(() => {
      setToastSuccessContratoDel(false)
    }, 3000)
  }

  const [contratos, setContratos] = useState([])

  const countAll = size(contratos)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/contratos/contratos')
        setContratos(res.data)
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

        {toastSuccess && <ToastSuccess contain='Contrato creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessContratoMod && <ToastSuccess contain='Contrato modificado exitosamente' onClose={() => setToastSuccessContratoMod(false)} />}

        {toastSuccessContratoDel && <ToastDelete contain='Contrato eliminado exitosamente' onClose={() => setToastSuccessContratoDel(false)} />}

        <Title title='contratos' />

        <div className={styles.countBox}>
          <CountBox
            title='Contratos'
            icon={<FaFileContract />}
            count={{ countAll }}
          />
          <CreateBox
            title='Crear'
            icon={<FaPlus />}
            click={onOpenClose}
          />
        </div>

        <ContratosLista reload={reload} onReload={onReload} contratos={contratos} onToastSuccessContratoMod={onToastSuccessContratoMod} onToastSuccessContratoDel={onToastSuccessContratoDel} />

      </BasicLayout>

      <BasicModal title='crear contrato' show={show} onClose={onOpenClose}>
        <ContratoForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
