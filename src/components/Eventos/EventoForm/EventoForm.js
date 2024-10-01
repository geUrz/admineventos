import { IconClose, ToastSuccess } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { genEVId } from '@/helpers'
import { FaPlus } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteForm } from '@/components/Clientes'
import { useAuth } from '@/contexts/AuthContext'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './EventoForm.module.css'

registerLocale('es', es)

export function EventoForm(props) {

  const { reload, onReload, onOpenClose, onToastSuccess } = props
  const { user } = useAuth()

  const [show, setShow] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

  const [tipo, setTipo] = useState('')
  const [cliente, setCliente] = useState('')
  const [personas, setPersonas] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [date, setDate] = useState(null)
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

    if (!personas) {
      newErrors.personas = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!date) {
      newErrors.date = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const crearEvento = async (e) => {
    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genEVId(4)
    const estado = 'Pendiente'
  
    const formattedDate = date ? date.toISOString().split('T')[0] : null

    try {
      await axios.post('/api/eventos/eventos', {
        usuario_id: user.id,
        folio,
        tipo,
        cliente,
        personas,
        descripcion,
        date: formattedDate,
        estado
      })

      setTipo('')
      setCliente('')
      setPersonas('')
      setDescripcion('')
      setDate(null)

      onReload()
      onOpenClose()
      onToastSuccess()

    } catch (error) {
      console.error('Error al crear el evento:', error)
    }

  }

  const [toastSuccessCliente, setToastSuccessCliente] = useState(false)

  const onToastSuccessCliente = () => {
    setToastSuccessCliente(true)
    setTimeout(() => {
      setToastSuccessCliente(false)
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
            <FormField error={!!errors.personas}>
              <Label>Personas</Label>
              <Input
                type="number"
                value={personas}
                onChange={(e) => setPersonas(e.target.value)}
              />
              {errors.personas && <Message negative>{errors.personas}</Message>}
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
            <FormField error={!!errors.date}>
              <Label>
                Fecha
              </Label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/aaaa"
                locale="es"
                isClearable
                showPopperArrow={false}
                popperPlacement="top"
              />
              {errors.date && <Message negative>{errors.date}</Message>}
            </FormField>
          </FormGroup>
          <Button secondary onClick={crearEvento}>Crear</Button>
        </Form>

      </div>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

    </>

  )
}
