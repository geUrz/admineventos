import { IconClose } from '@/components/Layouts'
import styles from './ContratosDetalles.module.css'

export function ContratosDetalles(props) {

  const {contrato, onOpenClose} = props
  
  return (
    
    <>
    
      <IconClose onOpenClose={onOpenClose} />    

      <div className={styles.main}>
        <div>
          <div>
            <h1>Tipo</h1>
            <h2>{contrato.tipo}</h2>
          </div>
          <div>
            <h1>Cliente</h1>
            <h2>{contrato.cliente}</h2>
          </div>
        </div>
        <div>
          <div>
            <h1>Celular</h1>
            <h2>{contrato.cel}</h2>
          </div>
          <div>
            <h1>Correo</h1>
            <h2>{contrato.email}</h2>
          </div>
        </div>
      </div>
    
    </>

  )
}
