import { size, map } from 'lodash'
import styles from './CotConceptos.module.css'
import { ListEmpty, Loading } from '@/components/Layouts'
import { formatCurrency } from '@/helpers'

export function CotConceptos(props) {

  const {conceptos, onOpenCloseConfirm} = props

  return (

    <>

      {!conceptos ? (
        <Loading size={30} loading={2} />
      ) : (
        size(conceptos) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(conceptos, (concepto) => (
              <div key={concepto.id} className={styles.rowMap} onClick={() => onOpenCloseConfirm(concepto)}>
                <h1>{concepto.tipo}</h1>
                <h1>{concepto.concepto}</h1>
                <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
              </div>
            ))}
          </div>
      )
    )
}
    
    </>

  )
}
