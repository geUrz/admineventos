import { ListEmpty, Loading } from '@/components/Layouts'
import { size, map } from 'lodash'
import styles from './ContratosLista.module.css'
import { FaFileContract, FaInfoCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { BasicModal } from '@/layouts'
import { ContratosDetalles } from '../ContratosDetalles'
import axios from 'axios'

export function ContratosLista(props) {

  const { reload, onReload, contratos, onToastSuccessContratoMod, onToastSuccessContratoDel } = props

  const [show, setShow] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  const [contratoSelec, setContratoSelec] = useState(null)

  const onOpenClose = async (contrato) => {
    try {
      const res = await axios.get(`/api/contratos/contratos?id=${contrato.id}`)
      setContratoSelec(res.data)
      setShow(true)
      onReload()  
    } catch (error) {
      console.error('Error al obtener el contrato:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
      }
    }
  }

  const handleCloseModal = () => {
    setShow(false)
    setContratoSelec(null)
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
        size(contratos) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.mainRow}>
            {map(contratos, (contrato) => (
              <div key={contrato.id} className={styles.mainRowMap}>
                <div className={styles.mainRowMap1}>
                  <FaFileContract />
                </div>
                <div className={styles.mainRowMap2}>
                  <div>
                    <h1>Contrato</h1>
                    <h2>{contrato.tipo}</h2>
                  </div>
                  <div>
                    <h1>Cliente</h1>
                    <h2>{contrato.cliente}</h2>
                  </div>
                  <div onClick={() => onOpenClose(contrato)}>
                    <FaInfoCircle />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del contrato' show={show} onClose={onOpenClose}>
        <ContratosDetalles reload={reload} onReload={onReload} contrato={contratoSelec} onOpenCloseDetalles={handleCloseModal} onToastSuccessContratoMod={onToastSuccessContratoMod} onToastSuccessContratoDel={onToastSuccessContratoDel} />
      </BasicModal>

    </>

  )
}
