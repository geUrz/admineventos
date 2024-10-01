import { CreateBox, EventosListSearch, Loading, ProtectedRoute, SearchEventos, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { size } from 'lodash'
import { CountBox } from '@/components/Layouts/CountBox'
import { FaCalendarAlt, FaPlus, FaSearch } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import { EventoForm, EventosLista } from '@/components/Eventos'
import styles from './eventos.module.css'

export default function Eventos() {

  const { loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [eventos, setEventos] = useState(null)

  const countAll = size(eventos)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
  
  const [resultados, setResultados] = useState([])

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessEventoMod, setToastSuccessEventoMod] = useState(false)
  const [toastSuccessEventoDel, setToastSuccessEventoDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessEventoMod = () => {
    setToastSuccessEventoMod(true)
    setTimeout(() => {
      setToastSuccessEventoMod(false)
    }, 3000)
  }

  const onToastSuccessEventoDel = () => {
    setToastSuccessEventoDel(true)
    setTimeout(() => {
      setToastSuccessEventoDel(false)
    }, 3000)
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/eventos/eventos')
        setEventos(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Evento creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessEventoMod && <ToastSuccess contain='Evento modificado exitosamente' onClose={() => setToastSuccessEventoMod(false)} />}

        {toastSuccessEventoDel && <ToastDelete contain='Evento eliminado exitosamente' onClose={() => setToastSuccessEventoDel(false)} />}

        <Title title='eventos' />

        <div className={styles.countBox}>
          <CountBox
            title='Eventos'
            icon={<FaCalendarAlt />}
            count={{ countAll }}
          />
          <CreateBox
            title='Crear'
            icon={<FaPlus />}
            click={onOpenClose}
          />
        </div>

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchEventos onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessEventoMod={onToastSuccessEventoMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <EventosListSearch eventos={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar evento</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <EventosLista reload={reload} onReload={onReload} eventos={eventos} onToastSuccessEventoMod={onToastSuccessEventoMod} onToastSuccessEventoDel={onToastSuccessEventoDel} />

      </BasicLayout>

      <BasicModal title='crear evento' show={show} onClose={onOpenClose}>
        <EventoForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
