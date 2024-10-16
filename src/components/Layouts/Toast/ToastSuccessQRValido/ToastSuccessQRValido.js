import { FaCheck } from 'react-icons/fa'
import styles from './ToastSuccessQRValido.module.css'
import { useEffect } from 'react';
import { IconClose } from '../../IconClose';

export function ToastSuccessQRValido(props) {

  const {onToastSuccessQRValido} = props

  return (

    <div className={styles.section}>
      <div className={styles.toast}>
        <IconClose onOpenClose={onToastSuccessQRValido} />
        <FaCheck />
        <h1>¡ Código valido !</h1>
        <h1>El visitante puede ingresar</h1>
      </div>
    </div>

  )
}
