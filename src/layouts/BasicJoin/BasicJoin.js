import classNames from 'classnames'
import styles from './BasicJoin.module.css'
import { Image } from 'semantic-ui-react'

export function BasicJoin(props) {

  const {
    children,
    relative=false
  } = props

  return (
    
    <>

      <div className={styles.logo}>
        <Image src='/img/admineventos_logo.webp' />
      </div>
    
      <div className={classNames({[styles.relative] : relative})}>
        {children}
      </div>
    
    </>

  )
}
