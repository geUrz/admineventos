import { IconClose, ToastSuccess } from '@/components/Layouts'
import styles from './UsuarioDetalles.module.css'
import { formatClientId } from '@/helpers'
import { FaEdit } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { UsuarioModForm } from '../UsuarioModForm'
import { useState } from 'react'

export function UsuarioDetalles(props) {

  const { usuario, onOpenClose } = props

  const [showEdit, setShowEdit] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(usuario)

  const[toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
      onOpenClose()
    }, 3000)
  }

  const onOpenCloseEdit = (usuario = null) => {
    setUsuarioSeleccionado(usuario)
    setShowEdit(!showEdit)
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Usuario modificado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.section}>
        <div className={styles.box1}>
          <div>
            <h1>Código</h1>
            <h2>{formatClientId(usuario.id)}</h2>
          </div>
          <div>
            <h1>Usuario</h1>
            <h2>{usuario.usuario}</h2>
          </div>
        </div>
        <div className={styles.box2}>
          <div>
            <h1>Nivel</h1>
            <h2>{usuario.nivel}</h2>
          </div>
          <div>
            <h1>Cel</h1>
            <h2>{usuario.cel}</h2>
          </div>
        </div>
        <div className={styles.box3}>
          <div>
            <h1>Correo</h1>
            <h2>{usuario.email}</h2>
          </div>
        </div>

        <div className={styles.iconEdit}>
          <div onClick={() => onOpenCloseEdit(usuario)}>
            <FaEdit />
          </div>
        </div>
      </div>

      <BasicModal show={showEdit} onClose={() => onOpenCloseEdit(null)}>
        <UsuarioModForm usuarioId={usuarioSeleccionado} onToastSuccess={onToastSuccess} onOpenCloseEdit={() => onOpenCloseEdit(null)} onOpenClose={onOpenClose} />
      </BasicModal>

    </>

  )
}
