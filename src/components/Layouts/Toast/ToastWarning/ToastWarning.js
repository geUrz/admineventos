import { FaInfoCircle, FaMobileAlt, FaTimes, FaWhatsapp } from 'react-icons/fa'
import styles from './ToastWarning.module.css'

export function ToastWarning(props) {

  const {onClose} = props

  return (

    <div className={styles.section}>
      <div className={styles.iconClose} onClick={onClose}>
        <FaTimes />
      </div>
      <div className={styles.toast}>
        <FaInfoCircle />
        <h1>¡ Alcanzaste el limite de notas !</h1>
      </div>
      <div className={styles.info}>
        <h1>Contacto para solicitar mas folios:</h1>
        <div>
          <FaMobileAlt />
          <FaWhatsapp />
        </div>
        <h2>(686) 1349399</h2>
      </div>
    </div>

  )
}
