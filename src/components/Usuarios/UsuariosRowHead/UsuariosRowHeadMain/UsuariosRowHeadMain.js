import { FaCog } from 'react-icons/fa'
import styles from './UsuariosRowHeadMain.module.css'

export function UsuariosRowHeadMain(props) {

  const {rowMain=false} = props

  return (

    <>
    
    {rowMain ? (
      <div className={styles.main}>
        <h1>codigo</h1>
        <h1>usuario</h1>
        <h1>nivel</h1>
        <h1><FaCog /></h1>
      </div>
    ) : (
      <div className={styles.main}>
        <h1>folio</h1>
        <h1>cliente</h1>
        <h1>descripcion</h1>
        
      </div>
    )}
    
    </>  

  )
}
