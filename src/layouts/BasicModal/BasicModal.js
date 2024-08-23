import { Modal } from 'semantic-ui-react'
import styles from './BasicModal.module.css'

export function BasicModal(props) {

  const {children, show, title} = props

  return (
    
    <>
      <Modal open={show} size="small" className={styles.modal}>
        <Modal.Header className={styles.header}>
          <h1>{title}</h1>
        </Modal.Header>
        <Modal.Content className={styles.content}>{children}</Modal.Content>
      </Modal>
    </>

  )
}
