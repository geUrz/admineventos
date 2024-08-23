import { FaPlus } from 'react-icons/fa'
import styles from './Add.module.css'

export function Add(props) {

  const {onOpenClose} = props

  return (

    <div className={styles.icon}>
      <div onClick={onOpenClose}>
        <FaPlus />
      </div>
    </div>

  )
}
