import { useEffect, useState } from 'react'
import { map, size } from 'lodash'
import styles from './CotLista.module.css'
import axios from 'axios'
import { Confirm, ListEmpty, Loading, ToastSuccess } from '@/components/Layouts'
import { FaCheck, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { formatClientId, formatId } from '@/helpers'
import { BasicModal } from '@/layouts'
import { CotDetalles } from '../CotDetalles'

export function CotLista(props) {

  const { reload, onReload } = props

  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [cotizaciones, setCotizaciones] = useState()
  const [cotizacionSeleccionado, setCotizacionSeleccionado] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessConfirm, setToastSuccessConfirm] = useState(false)
  const [toastSuccessDelete, setToastSuccessDelete] = useState(false)
  
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

  useEffect(() => {
    fetchRecibos()
  }, [reload])

  const fetchRecibos = async () => {
    try {
      const response = await axios.get('/api/cotizaciones/cotizaciones')
      setCotizaciones(response.data);
    } catch (error) {
      console.error('Error al obtener los cotizaciones:', error)
    }
  }


  const onOpenClose = async (cotizacion) => {
    try {
      const response = await axios.get(`/api/cotizaciones/conceptos?cotizacion_id=${cotizacion.id}`)
      cotizacion.conceptos = response.data
      setCotizacionSeleccionado(cotizacion)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  const onDeleteCotizacion = async (cotizacionId) => {
    try {
      const response = await axios.delete(`/api/cotizaciones/cotizaciones`, {
        params: { id: cotizacionId },
      })
      if (response.status === 200) {
        setCotizaciones((prevState) => prevState.filter((cotizacion) => cotizacion.id !== cotizacionId))
        setShow(false)
        onShowConfirm()
        onToastSuccessConfirm()
      } else {
        console.error('Error al eliminar la cotización: Respuesta del servidor no fue exitosa', response)
      }
    } catch (error) {
      console.error('Error al eliminar la cotización:', error.response || error.message || error)
    }
  }

  const onDeleteConcept = async (conceptoId) => {
    try {
      const response = await axios.delete(`/api/cotizaciones/conceptos`, {
        params: { concepto_id: conceptoId },
      })
      if (response.status === 200) {
        setCotizacionSeleccionado((prevState) => ({
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
    setCotizacionSeleccionado((prevState) => ({
      ...prevState,
      conceptos: [...prevState.conceptos, concept],
    }))
    onReload()
  }

  return (

    <>

      {toastSuccess && <ToastSuccess contain='Concepto creado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessConfirm && <ToastSuccess contain='Cotización eliminada exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {toastSuccessDelete && <ToastSuccess contain='Concepto eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {!cotizaciones ? (
        <Loading size={45} loading={1} />
      ) : (
        size(cotizaciones) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(cotizaciones, (cotizacion) => (
              <div key={cotizacion.id} className={styles.rowMap} onClick={() => onOpenClose(cotizacion)}>
                <h1>{formatId(cotizacion.id)}</h1>
                <h1>{cotizacion.cliente}</h1>
                <h1>{cotizacion.descripcion}</h1>
                <h1><FaInfoCircle /></h1>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles de la cotización' show={show} onClose={onOpenClose}>
        <CotDetalles cotizaciones={cotizacionSeleccionado} cotizacionId={cotizacionSeleccionado} reload={reload} onReload={onReload} onShowConfirm={onShowConfirm} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} onAddConcept={onAddConcept} onDeleteCotizacion={onDeleteCotizacion} onDeleteConcept={onDeleteConcept} />
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
        onConfirm={() => onDeleteCotizacion(cotizacionSeleccionado.id)}
        onCancel={onShowConfirm}
        content='¿ Estas seguro de eliminar la cotización ?'
      />

    </>

  )
}
