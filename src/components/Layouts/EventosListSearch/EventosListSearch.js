import { map, size } from 'lodash'
import { ListEmpty } from '../ListEmpty'
import { Loading } from '../Loading'
import { FaCalendarAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import { EventoDetalles } from '@/components/Eventos'
import styles from './EventosListSearch.module.css'

export function EventosListSearch(props) {

  const { reload, onReload, eventos, onToastSuccessEventoMod, onToastSuccessEventoDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [eventoSeleccionada, setVisitaSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (evento) => {
    setVisitaSeleccionada(evento)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitaSeleccionada(null)
    setShowDetalles(false)
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

      <BasicModal title='detalles de la evento' show={showDetalles} onClose={onCloseDetalles}>
        {eventoSeleccionada && (
          <EventoDetalles
            reload={reload}
            onReload={onReload}
            evento={eventoSeleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessEventoMod={onToastSuccessEventoMod}
            onToastSuccessEventoDel={onToastSuccessEventoDel}
          />
        )}
      </BasicModal>

    </>

  )
}
