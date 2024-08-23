import { Confirm, IconClose } from '@/components/Layouts'
import styles from './CotForm.module.css'
import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import { CotRowHeadModal } from '../CotRowHead'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import { formatCurrency } from '@/helpers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { FaCheck, FaTimes } from 'react-icons/fa'
//import { FirmaDigital } from '@/components/Layouts/FirmaDigital'

export function CotForm(props) {

  const { reload, onReload, onOpenClose, onToastSuccess } = props

  const { user } = useAuth()

  const [showConfirm, setShowConfirm] = useState(false)

  const [cliente, setCliente] = useState('')
  const [clientes, setClientes] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({
    tipo: '',
    concepto: '',
    precio: '',
    cantidad: ''
  })
  const [toggleIVA, setToggleIVA] = useState(false)

  //const [firmaDigital, setFirmaDigital] = useState(null)

  const onShowConfirm = (index) => {
    setConceptoAEliminar(index)
    setShowConfirm(true)
  }

  const onHideConfirm = () => {
    setConceptoAEliminar(null)
    setShowConfirm(false)
  }

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const validarFormConceptos = () => {
    const newErrors = {}

    if (!nuevoConcepto.tipo) {
      newErrors.tipo = 'El campo es requerido'
    }

    if (!nuevoConcepto.concepto) {
      newErrors.concepto = 'El campo es requerido'
    }

    if (!nuevoConcepto.precio) {
      newErrors.precio = 'El campo es requerido'
    } else if (nuevoConcepto.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }

    if (!nuevoConcepto.cantidad) {
      newErrors.cantidad = 'El campo es requerido'
    } else if (nuevoConcepto.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/clientes')
        setClientes(response.data)
      } catch (error) {
        console.error('Error al obtener clientes:', error)
      }
    })()
  }, [])

  const crearRecibo = async (e) => {
    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      const response = await axios.post('/api/cotizaciones/cotizaciones', {
        cliente_id: cliente,
        descripcion,
        createdId: user.id,
        //firma: firmaDigital
      })
      const cotizacionId = response.data.id
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/cotizaciones/conceptos', { cotizacion_id: cotizacionId, ...concepto })
      ))
      onToastSuccess()
      setCliente('')
      setDescripcion('')
      setConceptos([])
      //setFirmaDigital(null)
      onOpenClose()
      onReload()
    } catch (error) {
      console.error('Error al crear el recibo:', error)

    }
  }

  const añadirConcepto = () => {
    if (!validarFormConceptos()) {
      return
    }
    setConceptos([...conceptos, nuevoConcepto])
    setNuevoConcepto({ tipo: '', concepto: '', precio: '', cantidad: '' })
  }

  const [conceptoAEliminar, setConceptoAEliminar] = useState(null)

  const eliminarConcepto = () => {
    const nuevosConceptos = conceptos.filter((_, i) => i !== conceptoAEliminar);
    setConceptos(nuevosConceptos);
    onHideConfirm();
  }

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    return { subtotal, iva, total }
  };

  const { subtotal, iva, total } = calcularTotales()

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const onIVA = () => {
    setToggleIVA(prevState => (!prevState))
  } 

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.cliente}>
              <Label>Cliente</Label>
              <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
                <option value=""></option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.cliente}
                  </option>
                ))}
              </select>
              {errors.cliente && <span className={styles.error}>{errors.cliente}</span>}
            </FormField>
            <FormField error={!!errors.descripcion}>
              <Label>Descripción</Label>
              <TextArea
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              {errors.descripcion && <span className={styles.error}>{errors.descripcion}</span>}
            </FormField>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.tipo}>
              <Label>Tipo</Label>
              <select
                value={nuevoConcepto.tipo}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, tipo: e.target.value })}
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
                value={nuevoConcepto.concepto}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, concepto: e.target.value })}
              />
              {errors.concepto && <span className={styles.error}>{errors.concepto}</span>}
            </FormField>
            <FormField error={!!errors.precio}>
              <Label>Precio</Label>
              <Input
                type="number"
                value={nuevoConcepto.precio}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, precio: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              />
              {errors.precio && <span className={styles.error}>{errors.precio}</span>}
            </FormField>
            <FormField error={!!errors.cantidad}>
              <Label>Qty</Label>
              <Input
                type="number"
                value={nuevoConcepto.cantidad}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, cantidad: e.target.value === '' ? '' : parseInt(e.target.value) })}
              />
              {errors.cantidad && <span className={styles.error}>{errors.cantidad}</span>}
            </FormField>
          </FormGroup>
          <Button secondary onClick={añadirConcepto}>Añadir Concepto</Button>
        </Form>

        <div className={styles.section}>

          <CotRowHeadModal rowMain />

          {conceptos.map((concepto, index) => (
            <div key={index} className={styles.rowMapConcept} onClick={() => onShowConfirm(index)}>
              <h1>{concepto.tipo}</h1>
              <h1>{concepto.concepto}</h1>
              <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
            </div>
          ))}

          <div className={styles.box3}>
            <div className={styles.box3_1}>
              <h1>Subtotal:</h1>

              {!toggleIVA ? (

                <div className={styles.toggleOFF} onClick={onIVA}>
                  <BiToggleLeft />
                  <h1>IVA:</h1>
                </div>

              ) : (

                <div className={styles.toggleON} onClick={onIVA}>
                  <BiToggleRight />
                  <h1>IVA:</h1>
                </div>

              )}

              <h1>Total:</h1>
            </div>

            <div className={styles.box3_2}>

              {!toggleIVA ? (
                <>

                  <h1>-</h1>
                  <h1>-</h1>

                </>
              ) : (
                <>

                  <h1>${formatCurrency(subtotal)}</h1>
                  <h1>${formatCurrency(iva)}</h1>

                </>
              )}

              {!toggleIVA ? (
                <h1>${formatCurrency(subtotal)}</h1>
              ) : (
                <h1>${formatCurrency(total)}</h1>
              )}

            </div>
          </div>

        </div>

        {/* <FirmaDigital onSave={setFirmaDigital} /> */}

        <Button primary onClick={crearRecibo}>Crear</Button>

      </div>

      <Confirm
        open={showConfirm}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={eliminarConcepto}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el concepto?'
      />

    </>

  )
}
