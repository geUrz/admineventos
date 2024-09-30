import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { IconClose, Confirm } from '@/components/Layouts'
import { useState } from 'react'
import { BasicModal } from '@/layouts'
import { ClienteModForm } from '../ClienteModForm'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import styles from './ClienteDetalles.module.css'

export function ClienteDetalles(props) {

  const { reload, onReload, cliente, onOpenClose, onToastSuccessClienteMod, onToastSuccessClienteDel } = props

  const {user} = useAuth()

  const [showEdit, setShowEdit] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(cliente)

  const onOpenCloseEdit = (cliente = null) => {
    setClienteSeleccionado(cliente)
    setShowEdit(!showEdit)
  }

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteCliente = async () => {
    if (cliente?.id) {
      try {
        await axios.delete(`/api/clientes/clientes?id=${cliente.id}`)
        onReload()
        onToastSuccessClienteDel()
        onOpenClose()
      } catch (error) {
        console.error('Error al eliminar la cliente:', error)
      }
    } else {
      console.error('Incidencia o ID no disponible')
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      <div className={styles.main}>
      <div className={styles.section}>
        <div className={styles.box1}>
          <div>
            <h1>Nombre</h1>
            <h2>{cliente.nombre}</h2>
          </div>
          <div>
            <h1>Cel</h1>
            <h2>{cliente.cel}</h2>
          </div>
        </div>
        <div className={styles.box2}>
          <div>
            <h1>Codigo</h1>
            <h2>{cliente.folio}</h2>
          </div>
          <div>
            <h1>Correo</h1>
            <h2>{cliente.email}</h2>
          </div>
        </div>
      </div>

      {user.nivel === 'admin' || user.nivel === 'usuario' ? (
          <>

            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenCloseEdit} />
            </div>

            {user.nivel === 'admin' ? (
              <div className={styles.iconDel}>
                <FaTrash onClick={onOpenCloseConfirmDel} />
              </div>
            ) : (
              ''
            )}

          </>
        ) : (
          ''
        )}
      </div>

      <BasicModal title='modificar cliente' show={showEdit} onClose={() => onOpenCloseEdit(null)}>
        <ClienteModForm reload={reload} onReload={onReload} clienteId={clienteSeleccionado} onOpenCloseEdit={() => onOpenCloseEdit(null)} onToastSuccessClienteMod={onToastSuccessClienteMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDeleteCliente}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el cliente ?'
      />

    </>

  )
}
