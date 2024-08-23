import { FaTimes } from 'react-icons/fa'
import styles from './IconClose.module.css'

export function IconClose(props) {

  const {onOpenClose} = props

  return (

    <div className={styles.icon} onClick={onOpenClose}>
      <div>
        <FaTimes />
      </div>
    </div>

  )
}
