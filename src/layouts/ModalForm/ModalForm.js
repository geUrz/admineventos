import { Modal } from "semantic-ui-react"
import styles from './ModalForm.module.css'

export function ModalForm(props) {

  const {children, showForm, title} = props

  return (

    <>
      <Modal open={showForm} size="small" className={styles.modal}>
        <Modal.Header className={styles.header}>
          <h1>{title}</h1>
        </Modal.Header>
        <Modal.Content className={styles.content}>{children}</Modal.Content>
      </Modal>
    </>

  )
}