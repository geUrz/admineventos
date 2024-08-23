import { CreateBox, ProtectedRoute, Title, ToastSuccess } from '@/components/Layouts'
import styles from './contratos.module.css'
import { BasicLayout, BasicModal } from '@/layouts'
import { CountBox } from '@/components/Layouts/CountBox'
import { size } from 'lodash'
import { useEffect, useState } from 'react'
import { FaFileContract, FaPlus } from 'react-icons/fa'
import axios from 'axios'
import { ContratosForm, ContratosLista } from '@/components/Contratos'

export default function contratos() {

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
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

  return (

    <ProtectedRoute>
      <BasicLayout relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Contrato creado exitosamente' onClose={() => setToastSuccess(false)} />}

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

        <ContratosLista reload={reload} onReload={onReload} contratos={contratos} />

      </BasicLayout>

      <BasicModal title='crear contrato' show={show} onClose={onOpenClose}>
        <ContratosForm contratos={contratos} reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
