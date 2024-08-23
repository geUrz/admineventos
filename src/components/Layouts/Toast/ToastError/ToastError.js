import { FaCheck, FaTimes } from 'react-icons/fa'
import styles from './ToastError.module.css'
import { useEffect } from 'react';

export function ToastError(props) {

  const {onClose} = props

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose]);

  return (

    <div className={styles.section}>
      <div className={styles.toast}>
        <FaTimes />
        <h1>¡ Error al actualizar cliente !</h1>
      </div>
    </div>

  )
}
