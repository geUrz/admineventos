import { FaListAlt, FaNotEqual, FaNotesMedical, FaRegStickyNote, FaTimesCircle } from 'react-icons/fa'
import styles from './ListEmpty.module.css'

export function ListEmpty() {
  return (

    <div className={styles.section}>
      <div>
        <FaListAlt />
        <FaTimesCircle />
      </div>
    </div>

  )
}
