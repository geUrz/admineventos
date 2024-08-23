import { useEffect, useState } from 'react'
import { size, map } from 'lodash'
import styles from './UsuariosLista.module.css'
import axios from 'axios'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaInfoCircle } from 'react-icons/fa'
import { formatClientId } from '@/helpers'
import { BasicModal } from '@/layouts'
import { UsuarioDetalles } from '../UsuarioDetalles'

export function UsuariosLista(props) {

  const {reload, onReload} = props

  const [show, setShow] = useState(false)

  const [usuarios, setUsuarios] = useState()
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

  useEffect(() => {
  (async() => {
    try {
      const response = await axios.get('/api/usuarios')
      setUsuarios(response.data)
    } catch (error) {
        console.error('Error al obtener los clientes:', error)
    }
  })()
  }, [])

  const onOpenClose = async (usuario) => {
      try {
        const response = await axios.get(`/api/usuarios?id=${usuario.id}`)
        setUsuarioSeleccionado(response.data)
        setShow(true)
        onReload()
      } catch (error) {
          console.error('Error al obtener el usuario:', error)
          if (error.response) {
          console.error('Error response:', error.response.data)
          }
      }
  }

  const handleCloseModal = () => {
    setShow(false)
    setUsuarioSeleccionado(null)
  }

  return (
    
    <>
    
      {!usuarios ? (
        <Loading size={45} loading={1} />
      ) : (
        size(usuarios) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(usuarios, (usuario) => (
              <div key={usuario.id} className={styles.rowMap} onClick={() => onOpenClose(usuario)}>
                <h1>{formatClientId(usuario.id)}</h1>
                <h1>{usuario.usuario}</h1>
                <h1>{usuario.nivel}</h1>
                <h1><FaInfoCircle /></h1>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del usuario' show={show} onClose={onOpenClose}>
        <UsuarioDetalles reload={reload} onReload={onReload} usuario={usuarioSeleccionado} onOpenClose={handleCloseModal} />
      </BasicModal>
    
    </>

  )
}
