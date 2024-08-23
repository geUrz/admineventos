import { FirmaDigital, IconClose, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import { RecibosRowHeadModal } from '../RecibosRowHead'
import { useEffect, useState } from 'react'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import { FaCheck, FaInfoCircle, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { ReciboConceptos } from '../ReciboConceptos'
import { BasicModal, ModalForm } from '@/layouts'
import { ReciboConceptosForm } from '../ReciboConceptosForm'
import { Button, Confirm, Form, FormField, FormGroup, Image, Label, TextArea } from 'semantic-ui-react'
import { ReciboPDF } from '../ReciboPDF'
import { ReciboClienteDetalles } from '../ReciboClienteDetalles'
import axios from 'axios'
import styles from './ReciboDetalles.module.css'

export function ReciboDetalles(props) {

  const { recibos, reciboId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onShowConfirm } = props

  const [showForm, setShowForm] = useState(false)
  const [showModalFirma, setShowModalFirma] = useState(false)
  const [showConfirmFirma, setShowConfirmFirma] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessNota, setToastSuccessNota] = useState(false)
  const [toastSuccessPDF, setToastSuccessPDF] = useState(false)
  const [toastSuccessFirma, setToastSuccessFirma] = useState(false)
  const [toastSuccessDelete, setToastSuccessDelete] = useState(false)
  const [infoCliente, setInfoCliente] = useState(false)
  const [cliente, setCliente] = useState(null)

  const [recibo, setRecibo] = useState(recibos.nota || '')
  const [firma, setFirma] = useState(null)
  const [reciboNota, setReciboNota] = useState('')
  const [editNota, setEditNota] = useState(!!recibos.nota)
  const onOpenCloseFirma = () => setShowModalFirma((prevState) => !prevState)
  const onOpenCloseConfirmFirma = () => setShowConfirmFirma((prevState) => !prevState)
  const [showFirma, setShowFirma] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || ''
    const mobile = /Mobile|Android|iP(hone|od|ad)|IEMobile|Opera Mini/i.test(userAgent)
    setIsMobile(mobile)
  }, [])

  const SWIPE_THRESHOLD = 150

  const [startCoords, setStartCoords] = useState(null)
  const [isSwiping, setIsSwiping] = useState(false)

  const [activate, setActivate] = useState(false)

  // Maneja el inicio del deslizamiento
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setStartCoords({ x: touch.clientX, y: touch.clientY })
    setIsSwiping(true)
  }

  // Maneja el movimiento del deslizamiento
  const handleTouchMove = (e) => {
    if (!isSwiping) return

    const touch = e.touches[0]
    const endCoords = { x: touch.clientX, y: touch.clientY }

    // Calcula la distancia del deslizamiento
    const deltaX = endCoords.x - startCoords.x
    const deltaY = endCoords.y - startCoords.y
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

    // Si el deslizamiento supera el umbral, activa la acción
    if (distance > SWIPE_THRESHOLD) {
      setActivate(true)
    }
  }

  const handleTouchClick = () => {
    setActivate(false)
  }

  useEffect(() => {
    setEditNota(!!recibos.nota)
  }, [recibos.nota])

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessNota = () => {
    setToastSuccessNota(true)
    setTimeout(() => {
      setToastSuccessNota(false)
    }, 3000)
  }

  const onToastSuccessFirma = () => {
    setToastSuccessFirma(true)
    setTimeout(() => {
      setToastSuccessFirma(false)
    }, 3000)
  }

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const response = await axios.get(`/api/clientes?cliente=${recibos.cliente}`)
        setCliente(response.data[0])
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }

    if (recibos && recibos.cliente) {
      obtenerCliente()
    }
  }, [recibos])

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
    const savedToggleIVA = localStorage.getItem('ontoggleIVA');
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA));
  }, [toggleIVA])

  const subtotal = recibos.conceptos.reduce((sum, concepto) => sum + concepto.precio * concepto.cantidad, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const onOpenCliente = () => {
    setInfoCliente((prevState) => !prevState)
  }

  const handleNotaChange = (e) => {
    setRecibo(e.target.value);
  }

  const handleAddNota = async () => {
    try {

      const response = await axios.put(`/api/recibos/recibos?id=${reciboId.id}`, { nota: recibo })

      if (response.status === 200) {
        setEditNota(!!recibo)

        const updateNota = { ...recibos, nota: recibo }
        setReciboNota(updateNota)
        onReload()
        onToastSuccessNota()
      }
    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message);
    }
  }

  useEffect(() => {
    if (recibos) {
      fetchFirma()
    }
  }, [recibos])



  const fetchFirma = async () => {
    try {
      const response = await axios.get(`/api/recibos/recibos?id=${reciboId.id}&firma=true`);
      if (response.status === 200) {
        setFirma(response.data.firma)

        setTimeout(() => {
          setShowFirma(true)
        }, 1000)
      }
    } catch (error) {
      console.error('Error al obtener la firma:', error)
    }
  }

  const removeSignature = async () => {
    try {
      const response = await axios.put(`/api/recibos/recibos?id=${reciboId.id}`, {
        firma: null
      })

      if (response.status === 200) {
        console.log('Firma eliminada exitosamente')
        onToasSuccesstDelete()
        fetchFirma()
        onReload()
        onOpenCloseConfirmFirma()
      }
    } catch (error) {
      console.error('Error al eliminar la firma:', error)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessNota && <ToastSuccess contain='Nota agregada exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessPDF && <ToastSuccess contain='PDF creado exitosamente' onClose={() => setToastSuccessPDF(false)} />}

      {toastSuccessFirma && <ToastSuccess contain='Firma creada exitosamente' onClose={() => setToastSuccessPDF(false)} />}

      {toastSuccessDelete && <ToastDelete contain='Firma eliminada exitosamente' onClose={() => setToastSuccessPDF(false)} />}

      <div className={styles.section} onClick={handleTouchClick}>

        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Cliente</h1>
              <h1 onClick={onOpenCliente}>{recibos.cliente} <FaInfoCircle /></h1>
            </div>
            <div>
              <h1>Folio</h1>
              <h1>{formatId(recibos.id)}</h1>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Descripcion</h1>
              <h1>{recibos.descripcion}</h1>
            </div>
            <div>
              <h1>Fecha</h1>
              <h1>{formatDate(recibos.createdAt)}</h1>
            </div>
          </div>
        </div>

        <RecibosRowHeadModal rowMain />

        <ReciboConceptos conceptos={recibos.conceptos} onOpenCloseConfirm={onOpenCloseConfirm} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseForm}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.boxMain}>
          <div className={styles.box3_0}>

            {firma ? (
              showFirma ? (
                <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
                  <Image src={firma} alt="Firma" />
                  {activate && (
                    <div className={styles.activateTrash} onClick={onOpenCloseConfirmFirma}>
                      <div>
                        <FaTrash />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Loading size={25} loading={4} />
              )
            ) : (
              <div className={styles.iconFirmaPlus} onClick={onOpenCloseFirma}>
                <FaPlus />
              </div>
            )}

            <div className={styles.linea}></div>
            <div className={styles.firmaIsMobile}>
              <h1>Firma</h1>
              {isMobile ? (
                ''
              ) : (
                recibos.firma ? (
                  <FaTrash onClick={onOpenCloseConfirmFirma} />
                ) : (
                  ''
                )
              )}
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
        </div>

        <div className={styles.formNota}>
          <Form>
            <FormGroup>
              <FormField>
                <Label>
                  Nota:
                </Label>
                <TextArea
                  value={recibo}
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

        <ReciboPDF cliente={cliente} recibos={recibos} conceptos={recibos.conceptos} reciboNota={reciboNota.nota} firma={firma} />

        <div className={styles.footerDetalles}>
          <div>
            <h1>creado por:
              {!recibos ? (
                <span> - no disponible -</span>
              ) : (
                <span> {recibos.usuario}</span>
              )}
            </h1>
          </div>
          <div onClick={onShowConfirm}>
            <FaTrash />
          </div>
        </div>

      </div>

      <BasicModal title='Detalles del cliente' show={infoCliente} onClose={onOpenCliente}>
        <ReciboClienteDetalles cliente={cliente} onOpenClose={onOpenCliente} />
      </BasicModal>

      <ModalForm title='Agregar concepto' showForm={showForm} onClose={onOpenCloseForm}>
        <ReciboConceptosForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onAddConcept={onAddConcept} reciboId={reciboId.id} onToastSuccess={onToastSuccess} />
      </ModalForm>

      <BasicModal title='Crear firma' show={showModalFirma} onClose={onOpenCloseFirma}>
        <FirmaDigital reload={reload} onReload={onReload} fetchFirma={fetchFirma} reciboId={reciboId.id} onToastSuccessFirma={onToastSuccessFirma} onOpenCloseFirma={onOpenCloseFirma} />
      </BasicModal>

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

      <Confirm
        open={showConfirmFirma}
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
        onConfirm={removeSignature}
        onCancel={onOpenCloseConfirmFirma}
        content='¿ Estas seguro de eliminar la firma ?'
      />

    </>

  )
}
