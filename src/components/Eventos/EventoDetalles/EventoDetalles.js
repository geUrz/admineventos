import { Confirm, IconClose } from '@/components/Layouts'
import { useState } from 'react'
import axios from 'axios'
import { FaCheck, FaDownload, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { EventoEditForm } from '../EventoEditForm'
import { formatDate } from '@/helpers'
import styles from './EventoDetalles.module.css'

export function EventoDetalles(props) {

  const { reload, onReload, evento, onOpenCloseDetalles, onToastSuccessEventoMod, onToastSuccessEventoDel } = props

  const [showEditEvento, setShowEditEvento] = useState(false)
  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenEditEvento = () => setShowEditEvento((prevState) => !prevState)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteEvento = async () => {
    if (evento?.id) {
      try {
        await axios.delete(`/api/eventos/eventos?id=${evento.id}`)
        onReload()
        onToastSuccessEventoDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el evento:', error)
      }
    } else {
      console.error('Evento o ID no disponible')
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.main}>
        <div className={styles.section}>
          <div className={styles.column1}>
            <div>
              <h1>Evento</h1>
              <h2>{evento.tipo}</h2>
            </div>
            <div>
              <h1>Cliente</h1>
              <h2>{evento.cliente}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{evento.descripcion}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{evento.estado}</h2>
            </div>
          </div>
          <div className={styles.column2}>
            <div>
              <h1>Folio</h1>
              <h2>{evento.folio}</h2>
            </div>
            <div>
              <h1>Personas</h1>
              <h2>{evento.personas}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDate(evento.date)}</h2>
            </div>
          </div>
        </div>

        <div className={styles.iconEdit}>
          <FaEdit onClick={onOpenEditEvento} />
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

      <BasicModal title='modificar el evento' show={showEditEvento} onClose={onOpenEditEvento}>
        <EventoEditForm reload={reload} onReload={onReload} evento={evento} onOpenEditEvento={onOpenEditEvento} onToastSuccessEventoMod={onToastSuccessEventoMod} />
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
        onConfirm={handleDeleteEvento}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el evento ?'
      />

    </>

  )
}
