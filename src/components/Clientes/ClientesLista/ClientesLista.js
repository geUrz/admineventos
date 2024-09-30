import { useEffect, useState } from 'react'
import axios from 'axios'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import styles from './ClientesLista.module.css'
import { formatClientId } from '@/helpers'
import { FaInfoCircle, FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteDetalles } from '../ClienteDetalles'

export function ClientesLista(props) {

  const {reload, onReload, onToastSuccessClienteMod, onToastSuccessClienteDel} = props

  const [show, setShow] = useState(false)
  const [clientes, setClientes] = useState()
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/clientes/clientes')
        setClientes(response.data)
      } catch (error) {
          console.error('Error al obtener los clientes:', error)
      }
    })()
  }, [reload])

  const onOpenClose= async (cliente) => {
    try {
      const response = await axios.get(`/api/clientes/clientes?id=${cliente.id}`)
      setClienteSeleccionado(response.data)
      setShow(true)
      onReload()
    } catch (error) {
        console.error('Error al obtener el cliente:', error)
        if (error.response) {
          console.error('Error response:', error.response.data)
        }
    }
  } 

  const handleCloseModal = () => {
    setShow(false)
    setClienteSeleccionado(null)
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
        size(clientes) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.mainRow}>
            {map(clientes, (cliente) => (
              <div key={cliente.id} className={styles.mainRowMap}>
                <div className={styles.mainRowMap1}>
                  <FaUsers />
                </div>
                <div className={styles.mainRowMap2}>
                  <div>
                    <h1>Nombre</h1>
                    <h2>{cliente.nombre}</h2>
                  </div>
                  <div>
                    <h1>Celular</h1>
                    <h2>{cliente.cel}</h2>
                  </div>
                  <div onClick={() => onOpenClose(cliente)}>
                    <FaInfoCircle />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del cliente' show={show} onClose={onOpenClose}>
        <ClienteDetalles reload={reload} onReload={onReload} cliente={clienteSeleccionado} onOpenClose={handleCloseModal} onToastSuccessClienteMod={onToastSuccessClienteMod} onToastSuccessClienteDel={onToastSuccessClienteDel} />
      </BasicModal>

    </>

  )
}
