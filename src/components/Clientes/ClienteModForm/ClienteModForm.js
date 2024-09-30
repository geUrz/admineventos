import { IconClose } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import styles from './ClienteModForm.module.css'

export function ClienteModForm(props) {

  const { reload, onReload, clienteId, onOpenCloseEdit, onToastSuccessClienteMod } = props

  const [cliente, setCliente] = useState('')
  const [contacto, setContacto] = useState('')
  const [direccion, setDireccion] = useState('')
  const [cel, setCel] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (clienteId) {
      setCliente(clienteId.cliente)
      setContacto(clienteId.contacto)
      setDireccion(clienteId.direccion)
      setCel(clienteId.cel)
      setEmail(clienteId.email)
    }
  }, [clienteId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/clientes?id=${clienteId.id}`, { cliente, contacto, cel, direccion, email })
      onOpenCloseEdit()
      onToastSuccessClienteMod()
      onReload()
    } catch (error) {
      console.error('Error al actualizar el cliente:', error)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseEdit} />

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
            <FormField>
              <Label>
                Cliente
              </Label>
              <Input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
              <Label>
                Contacto
              </Label>
              <Input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
              />
              <Label>
                Dirección
              </Label>
              <Input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
              <Label>
                Celular
              </Label>
              <Input
                type="number"
                value={cel}
                onChange={(e) => setCel(e.target.value)}
              />
              <Label>
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
          </FormGroup>
        <Button primary onClick={handleSubmit}>Guardar</Button>
        </Form>
      </div>

    </>

  )
}
