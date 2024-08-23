import { Confirm, IconClose, ToastSuccess } from '@/components/Layouts'
import { FaCheck, FaInfoCircle, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { BasicModal, ModalForm } from '@/layouts'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import { CotRowHeadModal } from '../CotRowHead'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { CotConceptos } from '../CotConceptos'
import { CotPDF } from '../CotPDF'
import { CotClienteDetalles } from '../CotClienteDetalles'
import { CotConceptosForm } from '../CotConceptosForm'
import axios from 'axios'
import styles from './CotDetalles.module.css'
import { Button, Form, FormField, FormGroup, Label, TextArea } from 'semantic-ui-react'

export function CotDetalles(props) {

  const { cotizaciones, cotizacionId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onShowConfirm } = props
  
  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [infoCliente, setInfoCliente] = useState(false)
  const [cliente, setCliente] = useState(null)
  const [editNota, setEditNota] = useState(!!notas.nota)

  useEffect(() => {
    setEditNota(!!notas.nota)
  }, [notas.nota])

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const response = await axios.get(`/api/clientes?cliente=${cotizaciones.cliente}`)
        setCliente(response.data[0])
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }

    if (cotizaciones && cotizaciones.cliente) {
      obtenerCliente()
    }
  }, [cotizaciones])

  const onOpenCloseConfirm = (concepto) => {
    setShowConfirm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseForm = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShowConfirm(false)
  }

  const [toggleIVA, setToggleIVA] = useState(false)

  const onIVA = () => {
    setToggleIVA((prevState) => !prevState)
  }

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA));
  }, [toggleIVA])

  const subtotal = cotizaciones.conceptos.reduce((sum, concepto) => sum + concepto.precio * concepto.cantidad, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const onOpenCliente = () => {
    setInfoCliente((prevState) => !prevState)
  }

  const [nota, setNota] = useState(cotizaciones.nota || '')
  const [cotizacionNota, setCotizacionNota] = useState('')
  
  const handleNotaChange = (e) => {
    setNota(e.target.value);
  }

  const handleAddNota = async () => {
    try {
      const response = await axios.put(`/api/cotizaciones/cotizaciones?id=${cotizacionId.id}`, { nota });
  
      if (response.status === 200) {

        setEditNota(!!nota)

        const updateNota = {...cotizaciones , nota}
        setCotizacionNota(updateNota)

        onReload()
        onToastSuccess()
      }

    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message);
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.section}>

        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Cliente</h1>
              <h1 onClick={onOpenCliente}>{cotizaciones.cliente}<FaInfoCircle /></h1>
            </div>
            <div>
              <h1>Folio</h1>
              <h1>{formatId(cotizaciones.id)}</h1>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Descripcion</h1>
              <h1>{cotizaciones.descripcion}</h1>
            </div>
            <div>
              <h1>Fecha</h1>
              <h1>{formatDate(cotizaciones.createdAt)}</h1>
            </div>
          </div>
        </div>

        <CotRowHeadModal rowMain />

        <CotConceptos conceptos={cotizaciones.conceptos} onOpenCloseConfirm={onOpenCloseConfirm} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseForm}>
            <FaPlus />
          </div>
        </div>

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

        <div className={styles.formNota}>
          <Form>
            <FormGroup>
              <FormField>
                <Label>
                  Nota:
                </Label>
                <TextArea
                  value={nota}
                  onChange={handleNotaChange}
                  placeholder="Escribe una nota aquí..."
                />
              </FormField>
            </FormGroup>
            <Button secondary onClick={handleAddNota}>
              {editNota ? 'Modificar nota' : 'Añadir nota'}
            </Button>
          </Form>
        </div>

        <CotPDF cliente={cliente} cotizaciones={cotizaciones} conceptos={cotizaciones.conceptos} cotizacionNota={cotizacionNota.nota} />

        <div className={styles.footerDetalles}>
          <div>
            <h1>creado por:
              {!cotizaciones ? (
                <span> - no disponible -</span>
              ) : (
                <span> {cotizaciones.usuario}</span>
              )}
            </h1>
          </div>
          <div onClick={onShowConfirm}>
            <FaTrash />
          </div>
        </div>

      </div>

      <BasicModal title='Detalles del cliente' show={infoCliente} onClose={onOpenCliente}>
        <CotClienteDetalles cliente={cliente} onOpenClose={onOpenCliente} />
      </BasicModal>

      <ModalForm title='Agregar concepto' showForm={showForm} onClose={onOpenCloseForm}>
        <CotConceptosForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onAddConcept={onAddConcept} cotizacionId={cotizacionId.id} onToastSuccess={onToastSuccess} />
      </ModalForm>

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
        onConfirm={handleDeleteConcept}
        onCancel={onOpenCloseConfirm}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

    </>

  )
}
