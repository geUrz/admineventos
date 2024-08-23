import classNames from 'classnames'
import styles from './BasicLayout.module.css'
import { Menu } from '@/components/Layouts'

export function BasicLayout(props) {

  const {
    children,
    relative=false,
  } = props

  return (
    
    <>
    
      <Menu />

      <div className={classNames({[styles.relative] : relative})}>
        {children}
      </div>

    </>

  )
}
