import { IconClose, ToastSuccess } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { genCONId } from '@/helpers'
import { FaPlus } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteForm } from '@/components/Clientes'
import styles from './ContratoForm.module.css'

export function ContratoForm(props) {

  const { reload, onReload, onOpenClose, onToastSuccess } = props

  const [show, setShow] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

  const [clientes, setClientes] = useState([])

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/api/clientes/clientes') 
        setClientes(response.data) 
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }

    fetchClientes()
  }, [reload])

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!tipo) {
      newErrors.tipo = 'El campo es requerido'
    }

    if (!cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const [tipo, setTipo] = useState('')
  const [cliente, setCliente] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const crearContrato = async (e) => {
    e.preventDefault()

    if(!validarForm()){
      return
    }

    const folio = genCONId(4)
    const estado = 'Pendiente'

    console.log('Datos a enviar:', {
      folio,
      tipo, 
      cliente, 
      descripcion, 
      estado
    })

    try {
      await axios.post ('/api/contratos/contratos', {
        folio,
        tipo, 
        cliente, 
        descripcion, 
        estado
      })

      setTipo('')
      setCliente('')
      setDescripcion('')

      onReload()
      onOpenClose()
      onToastSuccess()

    } catch (error) {
        console.error('Error al crear el contrato:', error)
    }

  }

  const [toastSuccessCliente, setToastSuccessCCliente] = useState(false)

  const onToastSuccessCliente = () => {
    setToastSuccessCCliente(true)
    setTimeout(() => {
      setToastSuccessCCliente(false)
    }, 3000)
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccessCliente && <ToastSuccess contain='Cliente creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

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
              {errors.tipo && <Message negative>{errors.tipo}</Message>}
            </FormField>
            <FormField error={!!errors.cliente}>
              <Label>Cliente</Label>
              <Dropdown
                placeholder='Selecciona un cliente'
                fluid
                selection
                options={clientes.map(cliente => ({
                  key: cliente.id, 
                  text: cliente.nombre, 
                  value: cliente.nombre
                }))}
                value={cliente}
                onChange={(e, { value }) => setCliente(value)}
              />
              <div className={styles.addCliente} onClick={onOpenCloseClienteForm}>
                <h1>Crear cliente</h1>
                <FaPlus />
              </div>
              {errors.cliente && <Message negative>{errors.cliente}</Message>}
            </FormField>
            <FormField error={!!errors.descripcion}>
              <Label>Descripción</Label>
              <TextArea
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              {errors.descripcion && <Message negative>{errors.descripcion}</Message>}
            </FormField>
          </FormGroup>
          <Button secondary onClick={crearContrato}>Crear</Button>
        </Form>

      </div>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

    </>

  )
}
