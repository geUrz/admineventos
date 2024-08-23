import { FaCheck } from 'react-icons/fa'
import styles from './ToastDelete.module.css'
import { useEffect } from 'react';

export function ToastDelete(props) {

  const {onClose, contain} = props

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose]);

  return (

    <div className={styles.section}>
      <div className={styles.toast}>
        <FaCheck />
        <h1>¡ {contain} !</h1>
      </div>
    </div>

  )
}
