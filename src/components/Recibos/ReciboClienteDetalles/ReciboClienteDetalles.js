import { IconClose } from '@/components/Layouts'
import styles from './ReciboClienteDetalles.module.css'
import { formatClientId } from '@/helpers'

export function ReciboClienteDetalles(props) {

  const {cliente, onOpenClose} = props

  return (
    
    <>
    
      <IconClose onOpenClose={onOpenClose} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div>
            <h1>Código</h1>
            <h2>{formatClientId(cliente.id)}</h2>
          </div>
          <div>
            <h1>Cliente</h1>
            <h2>{cliente.cliente}</h2>
          </div>
        </div>
        <div className={styles.box2}>
          <div>
            <h1>Contacto</h1>
            <h2>{cliente.contacto}</h2>
          </div>
          <div>
            <h1>Celular</h1>
            <h2>{cliente.cel}</h2>
          </div>
        </div>
        <div className={styles.box3}>
          <div>
            <h1>Dirección</h1>
            <h2>{cliente.direccion}</h2>
          </div>
          <div>
            <h1>Email</h1>
            <h2>{cliente.email}</h2>
          </div>
        </div>
      </div>

    </>

  )
}
