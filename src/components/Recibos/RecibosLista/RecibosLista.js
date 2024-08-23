import { useEffect, useState } from 'react'
import axios from 'axios'
import { map, size } from 'lodash'
import { FaCheck, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { formatId } from '@/helpers'
import { Loading, ListEmpty, ToastSuccess } from '@/components/Layouts'
import { BasicModal } from '@/layouts'
import { ReciboDetalles } from '../ReciboDetalles'
import { Confirm } from 'semantic-ui-react'
import styles from './RecibosLista.module.css'

export function RecibosLista(props) {

  const{reload, onReload, recibos} = props

  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null)
  const[toastSuccess, setToastSuccess] = useState(false)
  const[toastSuccessConfirm, setToastSuccessConfirm] = useState(false)
  const[toastSuccessDelete, setToastSuccessDelete] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessConfirm = () => {
    setToastSuccessConfirm(true)
    setTimeout(() => {
      setToastSuccessConfirm(false)
    }, 3000)
  }

  const onToastSuccessDelete = () => {
    setToastSuccessDelete(true)
    setTimeout(() => {
      setToastSuccessDelete(false)
    }, 3000)
  }

  const onShowConfirm = () => setShowConfirm((prevState) => !prevState)
 
  const onOpenClose = async (recibo) => {
    try {
      const response = await axios.get(`/api/recibos/conceptos?recibo_id=${recibo.id}`)
      recibo.conceptos = response.data
      setReciboSeleccionado(recibo)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  const onDeleteRecibo = async (reciboId) => {
    try {
      const response = await axios.delete(`/api/recibos/recibos`, {
        params: { id: reciboId },
      })
      if (response.status === 200) {
        setRecibos((prevState) => prevState.filter((recibo) => recibo.id !== reciboId))
        setShow(false)
        onShowConfirm()
        onToastSuccessConfirm()
      } else {
        console.error('Error al eliminar el recibo: Respuesta del servidor no fue exitosa', response)
      }
    } catch (error) {
      console.error('Error al eliminar el recibo:', error.response || error.message || error)
    }
  }

  const onDeleteConcept = async (conceptoId) => {
    try {
      const response = await axios.delete(`/api/recibos/conceptos`, {
        params: { concepto_id: conceptoId },
      })
      if (response.status === 200) {
        setReciboSeleccionado((prevState) => ({
          ...prevState,
          conceptos: prevState.conceptos.filter((concepto) => concepto.id !== conceptoId),
        }))
        onToastSuccessDelete()
      } else {
        console.error('Error al eliminar el concepto: Respuesta del servidor no fue exitosa', response);
      }
    } catch (error) {
      console.error('Error al eliminar el concepto:', error.response || error.message || error);
    }
  }

  const onAddConcept = (concept) => {
    setReciboSeleccionado((prevState) => ({
      ...prevState,
      conceptos: [...prevState.conceptos, concept],
    }))
    onReload()
  }

  return (

    <>

      {toastSuccess && <ToastSuccess contain='Concepto creado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessConfirm && <ToastSuccess contain='Recibo eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {toastSuccessDelete && <ToastSuccess contain='Concepto eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {!recibos ? (
        <Loading size={45} loading={1} />
      ) : (
        size(recibos) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(recibos, (recibo) => (
              <div key={recibo.id} className={styles.rowMap} onClick={() => onOpenClose(recibo)}>
                <h1>{formatId(recibo.id)}</h1>
                <h1>{recibo.cliente}</h1>
                <h1>{recibo.descripcion}</h1>
                <h1><FaInfoCircle /></h1>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del recibo' show={show} onClose={onOpenClose}>
        <ReciboDetalles recibos={reciboSeleccionado} reciboId={reciboSeleccionado} reload={reload} onReload={onReload} onShowConfirm={onShowConfirm} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} onAddConcept={onAddConcept} onDeleteRecibo={onDeleteRecibo} onDeleteConcept={onDeleteConcept} />
      </BasicModal>

      <Confirm
        open={showConfirm}
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
        onConfirm={() => onDeleteRecibo(reciboSeleccionado.id)}
        onCancel={onShowConfirm}
        content='¿ Estas seguro de eliminar el recibo ?'
      />

    </>

  )
}
