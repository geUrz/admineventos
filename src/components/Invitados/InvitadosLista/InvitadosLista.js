import { ListEmpty, Loading } from '@/components/Layouts'
import { size, map } from 'lodash'
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { BasicModal } from '@/layouts'
import { InvitadoDetalles } from '../InvitadoDetalles'
import axios from 'axios'
import styles from './InvitadosLista.module.css'

export function InvitadosLista(props) {

  const { reload, onReload, invitados, onToastSuccessInvitadoMod, onToastSuccessInvitadoDel } = props

  const [show, setShow] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  const [invitadoSelec, setInvitadoSelec] = useState(null)

  const onOpenClose = async (invitado) => {
    try {
      const res = await axios.get(`/api/invitados/invitados?id=${invitado.id}`)
      setInvitadoSelec(res.data)
      setShow(true)
      onReload()  
    } catch (error) {
      console.error('Error al obtener el invitado:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
      }
    }
  }

  const handleCloseModal = () => {
    setShow(false)
    setInvitadoSelec(null)
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
        size(invitados) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.mainRow}>
            {map(invitados, (invitado) => (
              <div key={invitado.id} className={styles.mainRowMap}>
                <div className={styles.mainRowMap1}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.mainRowMap2}>
                  <div>
                    <h1>Evento</h1>
                    <h2>{invitado.tipo}</h2>
                  </div>
                  <div>
                    <h1>Cliente</h1>
                    <h2>{invitado.cliente}</h2>
                  </div>
                  <div onClick={() => onOpenClose(invitado)}>
                    <FaInfoCircle />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del invitado' show={show} onClose={onOpenClose}>
        <InvitadoDetalles reload={reload} onReload={onReload} invitado={invitadoSelec} onOpenCloseDetalles={handleCloseModal} onToastSuccessInvitadoMod={onToastSuccessInvitadoMod} onToastSuccessInvitadoDel={onToastSuccessInvitadoDel} />
      </BasicModal>

    </>

  )
}
