import styles from './CreateBox.module.css'

export function CreateBox(props) {

  const {icon, title, click} = props

  return (
    
    <div className={styles.main} onClick={click}>
      {icon}
      <h1>{title}</h1>
    </div>

  )
}
