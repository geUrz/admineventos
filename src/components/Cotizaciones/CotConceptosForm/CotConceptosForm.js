import { useState } from 'react'
import { IconClose } from '@/components/Layouts'
import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import axios from 'axios'
import styles from './CotConceptosForm.module.css'

export function CotConceptosForm(props) {

  const { reload, onReload, cotizacionId, onAddConcept, onOpenCloseForm, onToastSuccess } = props

  const [newConcept, setNewConcept] = useState({ tipo: '', concepto: '', precio: '', cantidad: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewConcept((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!newConcept.tipo) {
      newErrors.tipo = 'El campo es requerido'
    }
    if (!newConcept.concepto) {
      newErrors.concepto = 'El campo es requerido'
    }
    if (!newConcept.cantidad || newConcept.cantidad <= 0) {
      newErrors.cantidad = 'El campo es requerido'
    }
    if (!newConcept.precio || newConcept.precio <= 0) {
      newErrors.precio = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleAddConcept = async () => {

    if (!validateForm()) {
      return
    }

    if (newConcept.tipo && newConcept.concepto && newConcept.precio && newConcept.cantidad) {
      try {
        const response = await axios.post(`/api/cotizaciones/conceptos`, {
          cotizacion_id: cotizacionId,
          ...newConcept,
        })

        if ((response.status === 200 || response.status === 201) && response.data) {
          const { id } = response.data
          if (id) {
            const newConceptWithId = { ...newConcept, id }
            onAddConcept(newConceptWithId)
            setNewConcept({ tipo: '', concepto: '', precio: '', cantidad: '' })

            onReload()
            onToastSuccess()
            onOpenCloseForm()

          } else {
            console.error('Error al agregar el concepto: El ID no se encuentra en la respuesta del servidor', response);
          }
        } else {
          console.error('Error al agregar el concepto: Respuesta del servidor no fue exitosa', response)
        }
      } catch (error) {
        //console.error('Error al agregar el concepto:', error.response?.data || error.message || error)
      }
    } else {
      console.warn('Datos incompletos o inválidos para agregar concepto', newConcept)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.addConceptForm}>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.tipo}>
              <Label>Tipo</Label>
              <select
                name="tipo"
                value={newConcept.tipo}
                onChange={handleChange}
              >
                <option value=''></option>
                <option value='Servicio'>Servicio</option>
                <option value='Producto'>Producto</option>
              </select>
              {errors.tipo && <span className={styles.error}>{errors.tipo}</span>}
            </FormField>
            <FormField error={!!errors.concepto}>
              <Label>Concepto</Label>
              <Input
                type="text"
                name="concepto"
                value={newConcept.concepto}
                onChange={handleChange}
              />
              {errors.concepto && <span className={styles.error}>{errors.concepto}</span>}
            </FormField>
            <FormField error={!!errors.precio}>
              <Label>Precio</Label>
              <Input
                type="number"
                name="precio"
                value={newConcept.precio}
                onChange={handleChange}
              />
              {errors.precio && <span className={styles.error}>{errors.precio}</span>}
            </FormField>
            <FormField error={!!errors.cantidad}>
              <Label>Qty</Label>
              <Input
                type="number"
                name="cantidad"
                value={newConcept.cantidad}
                onChange={handleChange}
              />
              {errors.cantidad && <span className={styles.error}>{errors.cantidad}</span>}
            </FormField>
          </FormGroup>
        </Form>

        <Button primary onClick={handleAddConcept}>
          Agregar concepto
        </Button>

      </div>

    </>

  )
}
