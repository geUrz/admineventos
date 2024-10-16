import { FaCheck } from 'react-icons/fa'
import styles from './ToastSuccessQR.module.css'
import { useEffect } from 'react';
import { IconClose } from '../../IconClose';

export function ToastSuccessQR(props) {

  const {onToastSuccessDownloadQR} = props

  return (

    <div className={styles.section}>
      <div className={styles.toast}>
        <IconClose onOpenClose={onToastSuccessDownloadQR} />
        <FaCheck />
        <h1>Código QR descargado</h1>
        <h1>¡ Envíalo a tu contacto para ingresar !</h1>
      </div>
    </div>

  )
}
