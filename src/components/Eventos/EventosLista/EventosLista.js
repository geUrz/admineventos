import { ListEmpty, Loading } from '@/components/Layouts'
import { size, map } from 'lodash'
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { BasicModal } from '@/layouts'
import { EventoDetalles } from '../EventoDetalles'
import axios from 'axios'
import styles from './EventosLista.module.css'

export function EventosLista(props) {

  const { reload, onReload, eventos, onToastSuccessEventoMod, onToastSuccessEventoDel } = props

  const [show, setShow] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  const [eventoSelec, setEventoSelec] = useState(null)

  const onOpenClose = async (evento) => {
    try {
      const res = await axios.get(`/api/eventos/eventos?id=${evento.id}`)
      setEventoSelec(res.data)
      setShow(true)
      onReload()  
    } catch (error) {
      console.error('Error al obtener el evento:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
      }
    }
  }

  const handleCloseModal = () => {
    setShow(false)
    setEventoSelec(null)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  return (

    <>

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(eventos) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.mainRow}>
            {map(eventos, (evento) => (
              <div key={evento.id} className={styles.mainRowMap}>
                <div className={styles.mainRowMap1}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.mainRowMap2}>
                  <div>
                    <h1>Evento</h1>
                    <h2>{evento.tipo}</h2>
                  </div>
                  <div>
                    <h1>Cliente</h1>
                    <h2>{evento.cliente}</h2>
                  </div>
                  <div onClick={() => onOpenClose(evento)}>
                    <FaInfoCircle />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del evento' show={show} onClose={onOpenClose}>
        <EventoDetalles reload={reload} onReload={onReload} evento={eventoSelec} onOpenCloseDetalles={handleCloseModal} onToastSuccessEventoMod={onToastSuccessEventoMod} onToastSuccessEventoDel={onToastSuccessEventoDel} />
      </BasicModal>

    </>

  )
}
