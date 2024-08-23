import { IconClose } from '@/components/Layouts'
import styles from './ContratosForm.module.css'
import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'

export function ContratosForm(props) {

  const { reload, onReload, contratos, onOpenClose, onToastSuccess } = props

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!tipo) {
      newErrors.tipo = 'El campo es requerido'
    }

    if (!cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    if (!cel) {
      newErrors.cel = 'El campo es requerido'
    }

    if (!email) {
      newErrors.email = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const [tipo, setTipo] = useState('')
  const [cliente, setCliente] = useState('')
  const [cel, setCel] = useState('')
  const [email, setEmail] = useState('')

  const crearContrato = async (e) => {
    e.preventDefault()

    if(!validarForm()){
      return
    }

    try {
      await axios.post ('/api/contratos/contratos', {tipo, cliente, cel, email})

      setTipo('')
      setCliente('')
      setCel('')
      setEmail('')

      onReload()
      onOpenClose()
      onToastSuccess()

    } catch (error) {
        console.error('Error al crear el contrato:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.tipo}>
              <Label>Evento</Label>
              <Input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />
              {errors.tipo && <span className={styles.error}>{errors.tipo}</span>}
            </FormField>
            <FormField error={!!errors.cliente}>
              <Label>Cliente</Label>
              <Input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
              {errors.cliente && <span className={styles.error}>{errors.cliente}</span>}
            </FormField>
            <FormField error={!!errors.cel}>
              <Label>Celular</Label>
              <Input
                type="number"
                value={cel}
                onChange={(e) => setCel(e.target.value)}
              />
              {errors.cel && <span className={styles.error}>{errors.cel}</span>}
            </FormField>
            <FormField error={!!errors.email}>
              <Label>Correo</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </FormField>
          </FormGroup>
          <Button primary onClick={crearContrato}>Crear</Button>
        </Form>

      </div>

    </>

  )
}
