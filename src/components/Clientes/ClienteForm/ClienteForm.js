import { IconClose } from '@/components/Layouts'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useState } from 'react'
import { genCLId } from '@/helpers'
import axios from 'axios'
import styles from './ClienteForm.module.css'

export function ClienteForm(props) {

  const { reload, onReload, onToastSuccess, onOpenClose } = props

  const [nombre, setNombre] = useState('')
  const [cel, setCel] = useState('')
  const [email, setEmail] = useState('')

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!nombre) {
      newErrors.nombre = 'El campo es requerido'
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

  const crearCliente = async (e) => {
    e.preventDefault()

    if(!validarForm()){
      return
    }

    const folio = genCLId(4)

    try {
      await axios.post ('/api/clientes/clientes', {
        folio,
        nombre, 
        cel, 
        email
      })

      setNombre('')
      setCel('')
      setEmail('')

      onReload()
      onOpenClose()
      onToastSuccess()

    } catch (error) {
        console.error('Error al crear el cliente:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.nombre}>
            <Label>Nombre</Label>
            <Input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errors.nombre && <Message negative>{errors.nombre}</Message>}
          </FormField>
          <FormField error={!!errors.cel}>
            <Label>Celular</Label>
            <Input
              type="number"
              value={cel}
              onChange={(e) => setCel(e.target.value)}
            />
            {errors.cel && <Message negative>{errors.cel}</Message>}
          </FormField>
          <FormField error={!!errors.email}>
            <Label>Correo</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <Message negative>{errors.email}</Message>}
          </FormField>
        </FormGroup>
        <Button secondary onClick={crearCliente}>Crear</Button>
      </Form>

    </>

  )
}
