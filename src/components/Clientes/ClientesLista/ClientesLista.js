import { useEffect, useState } from 'react'
import axios from 'axios'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import styles from './ClientesLista.module.css'
import { formatClientId } from '@/helpers'
import { FaInfoCircle } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteDetalles } from '../ClienteDetalles'

export function ClientesLista(props) {

  const {reload, onReload} = props

  const [show, setShow] = useState(false)
  const [clientes, setClientes] = useState()
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/clientes')
        setClientes(response.data)
      } catch (error) {
          console.error('Error al obtener los clientes:', error)
      }
    })()
  }, [reload])

  const onOpenClose= async (cliente) => {
    try {
      const response = await axios.get(`/api/clientes?id=${cliente.id}`)
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

  return (
    
    <>
    
      {!clientes ? (
        <Loading size={45} loading={1} />
      ) : (
        size(clientes) === 0 ? (
          <ListEmpty />
        ) : (
        
        <div className={styles.main}>
          {map(clientes, (cliente) => (
            <div key={cliente.id} className={styles.rowMap} onClick={() => onOpenClose(cliente)}>
              <h1>{formatClientId(cliente.id)}</h1>
              <h1>{cliente.cliente}</h1>
              <h1>{cliente.contacto}</h1>
              <h1><FaInfoCircle /></h1>
            </div>
          ))}
        </div>

      ))}

      <BasicModal title='detalles del cliente' show={show} onClose={onOpenClose}>
        <ClienteDetalles reload={reload} onReload={onReload} cliente={clienteSeleccionado} onOpenClose={handleCloseModal} />
      </BasicModal>

    </>

  )
}
