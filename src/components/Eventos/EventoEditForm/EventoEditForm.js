import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { BasicModal } from '@/layouts'
import { ClienteForm } from '@/components/Clientes'
import { FaPlus } from 'react-icons/fa'
import { ToastSuccess } from '@/components/Layouts'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './EventoEditForm.module.css'

registerLocale('es', es)

export function EventoEditForm(props) {

  const { reload, onReload, evento, onOpenEditEvento, onToastSuccessEventoMod } = props

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

  const [formData, setFormData] = useState({
    tipo: evento.tipo,
    cliente: evento.cliente,
    personas: evento.personas,
    descripcion: evento.descripcion,
    date: evento.date ? new Date(evento.date + 'T00:00:00') : null,
    estado: evento.estado
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.tipo) {
      newErrors.tipo = 'El campo es requerido'
    }

    if (!formData.cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!formData.estado) {
      newErrors.estado = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDropdownChange = (e, { value }) => {
    setFormData({ ...formData, cliente: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/eventos/eventos?id=${evento.id}`, {
        ...formData,
        date: formData.date ? formData.date.toISOString().split('T')[0] : null,
      })
      onReload()
      onOpenEditEvento()
      onToastSuccessEventoMod()
    } catch (error) {
      console.error('Error actualizando el evento:', error)
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

      <IconClose onOpenClose={onOpenEditEvento} />

      {toastSuccessCliente && <ToastSuccess contain='Cliente creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.tipo}>
            <Label>
              Evento
            </Label>
            <Input
              type="text"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
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
              value={formData.cliente}
              onChange={handleDropdownChange}
            />
            <div className={styles.addCliente} onClick={onOpenCloseClienteForm}>
              <h1>Crear cliente</h1>
              <FaPlus />
            </div>
            {errors.cliente && <Message negative>{errors.cliente}</Message>}
          </FormField>
          <FormField error={!!errors.personas}>
            <Label>
              Personas
            </Label>
            <Input
              type="number"
              name="personas"
              value={formData.personas}
              onChange={handleChange}
            />
            {errors.personas && <Message negative>{errors.personas}</Message>}
          </FormField>
          <FormField error={!!errors.descripcion}>
            <Label>
              Descripción
            </Label>
            <TextArea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && <Message negative>{errors.descripcion}</Message>}
          </FormField>
          <FormField error={!!errors.date}>
            <Label>
              Fecha
            </Label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              locale="es"
              isClearable
              showPopperArrow={false}
              popperPlacement="top"
            />
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </FormField>
          <FormField error={!!errors.estado}>
            <Label>
              Estatus
            </Label>
            <FormField
              name='estado'
              type="text"
              control='select'
              value={formData.estado}
              onChange={handleChange}
            >
              <option value=''></option>
              <option value='Pendiente'>Pendiente</option>
              <option value='En proceso'>En proceso</option>
              <option value='Terminada'>Realizada</option>
            </FormField>
            {errors.estado && <Message negative>{errors.estado}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

    </>

  )
}
