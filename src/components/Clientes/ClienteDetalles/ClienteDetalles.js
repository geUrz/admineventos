import { FaEdit } from 'react-icons/fa'
import { ToastSuccess } from '@/components/Layouts'
import { IconClose } from '@/components/Layouts'
import styles from './ClienteDetalles.module.css'
import { useState } from 'react'
import { formatClientId } from '@/helpers'
import { BasicModal } from '@/layouts'
import { ClienteModForm } from '../ClienteModForm'

export function ClienteDetalles(props) {

  const { reload, onReload, cliente, onOpenClose } = props

  const [showEdit, setShowEdit] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(cliente)

  const[toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
      onOpenClose()
    }, 3000)
  }

  const onOpenCloseEdit = (cliente = null) => {
    setClienteSeleccionado(cliente)
    setShowEdit(!showEdit)
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Cliente actualizado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.section}>
        <div className={styles.box1}>
          <div>
            <h1>Código</h1>
            <h2>{formatClientId(cliente.id)}</h2>
          </div>
          <div>
            <h1>Cliente</h1>
            <h2>{cliente.cliente}</h2>
          </div>
        </div>
        <div className={styles.box2}>
          <div>
            <h1>Contacto</h1>
            <h2>{cliente.contacto}</h2>
          </div>
          <div>
            <h1>Cel</h1>
            <h2>{cliente.cel}</h2>
          </div>
        </div>
        <div className={styles.box3}>
          <div>
            <h1>Dirección</h1>
            <h2>{cliente.direccion}</h2>
          </div>
          <div>
            <h1>Email</h1>
            <h2>{cliente.email}</h2>
          </div>
        </div>

        <div className={styles.iconEdit}>
          <div onClick={() => onOpenCloseEdit(cliente)}>
            <FaEdit />
          </div>
        </div>

      </div>

      <BasicModal title='modificar cliente' show={showEdit} onClose={() => onOpenCloseEdit(null)}>
        <ClienteModForm reload={reload} onReload={onReload} clienteId={clienteSeleccionado} onOpenCloseEdit={() => onOpenCloseEdit(null)} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </>

  )
}
