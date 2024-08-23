import { FaChevronLeft } from 'react-icons/fa'
import { useRouter } from 'next/router'
import styles from './Title.module.css'

export function Title(props) {

  const {title, iconBack} = props

  const router = useRouter()

  return (

    <div className={styles.title}>
      
      {!iconBack ? (
        ''
      ) : (
        <FaChevronLeft onClick={() => router.back()} />
      )}

      <h1>{title}</h1>
    </div>

  )
}
