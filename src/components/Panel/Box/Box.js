import Link from 'next/link'
import styles from './Box.module.css'

export function Box(props) {

  const {link, children, title} = props

  return (

    <div className={styles.box}>
      <Link href={`${link}`}>
          {children}
          <h1>{title}</h1>
      </Link>
    </div>

  )
}
