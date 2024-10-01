import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { EventosListSearch } from '../EventosListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchEventos.module.css';

export function SearchEventos(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessEventoMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setEventos([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await axios.get(`/api/eventos/eventos?search=${query}`)
        setEventos(response.data)
      } catch (err) {
        setError('No se encontraron eventos')
        setEventos([])
      } finally {
        setLoading(false)
      }
    };

    fetchData()
  }, [query])

  return (
    <div className={styles.main}>

      <div className={styles.input}>
        <Input
          type="text"
          placeholder="Buscar evento..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          loading={loading}
        />
        <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
          <FaTimesCircle />
        </div>
      </div>

      <div className={styles.visitaLista}>
        {error && <p>{error}</p>}
        {eventos.length > 0 && (
          <div className={styles.resultsContainer}>
            <EventosListSearch eventos={eventos} reload={reload} onReload={onReload} onToastSuccessEventoMod={onToastSuccessEventoMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
