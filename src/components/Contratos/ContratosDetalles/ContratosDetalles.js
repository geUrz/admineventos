import { Confirm, IconClose } from '@/components/Layouts'
import styles from './ContratosDetalles.module.css'
import { useState } from 'react'
import axios from 'axios'
import { FaCheck, FaDownload, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ContratoEditForm } from '../ContratoEditForm'

export function ContratosDetalles(props) {

  const { reload, onReload, contrato, onOpenCloseDetalles, onToastSuccessContratoMod, onToastSuccessContratoDel } = props

  const [showEditContrato, setShowEditContrato] = useState(false)
  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenEditContrato = () => setShowEditContrato((prevState) => !prevState)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteVisita = async () => {
    if (contrato?.id) {
      try {
        await axios.delete(`/api/contratos/contratos?id=${contrato.id}`)
        onReload()
        onToastSuccessContratoDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el contrato:', error)
      }
    } else {
      console.error('Contrato o ID no disponible')
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.main}>
        <div className={styles.section}>
          <div className={styles.column1}>
            <div>
              <h1>Tipo</h1>
              <h2>{contrato.tipo}</h2>
            </div>
            <div>
              <h1>Cliente</h1>
              <h2>{contrato.cliente}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{contrato.descripcion}</h2>
            </div>
          </div>
          <div className={styles.column2}>
            <div>
              <h1>Folio</h1>
              <h2>{contrato.folio}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{contrato.estado}</h2>
            </div>
          </div>
        </div>

        <div className={styles.iconEdit}>
          <FaEdit onClick={onOpenEditContrato} />
        </div>

        <div className={styles.actionsBottom}>
          <div className={styles.iconDown}>
            <FaDownload />
          </div>
          <div className={styles.iconDel}>
            <FaTrash onClick={onOpenCloseConfirmDel} />
          </div>
        </div>

      </div>

      <BasicModal title='modificar el contrato' show={showEditContrato} onClose={onOpenEditContrato}>
        <ContratoEditForm reload={reload} onReload={onReload} contrato={contrato} onOpenEditContrato={onOpenEditContrato} onToastSuccessContratoMod={onToastSuccessContratoMod} />
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
        onConfirm={handleDeleteVisita}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el contrato ?'
      />

    </>

  )
}
