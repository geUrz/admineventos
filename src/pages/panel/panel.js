import { ProtectedRoute } from '@/components/Layouts'
import { BasicLayout } from '@/layouts'
import { Box } from '@/components/Panel'
import styles from './panel.module.css'
import { FaCalendarAlt, FaFileAlt, FaFileArchive, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaFileMedical, FaFilePrescription, FaFileSignature, FaRegFile, FaRegFileAlt, FaRegFileArchive, FaRegFileCode, FaUserFriends, FaUsers } from 'react-icons/fa'

export default function Panel() {

    

  return (
    
    <ProtectedRoute>
      <BasicLayout relative>

        <div className={styles.main}>
          <div className={styles.section}>
            <Box link='eventos' title='Eventos'>
              <FaCalendarAlt />
            </Box>
            <Box link='contratos' title='Contratos'>
              <FaFileContract />
            </Box>
            <Box link='cotizaciones' title='Cotizaciones'>
              <FaFileInvoice />
            </Box>
            <Box link='recibos' title='Recibos'>
              <FaFileAlt />
            </Box>
            <Box link='facturas' title='Facturas'>
              <FaFileSignature />
            </Box>
            <Box link='cuentas' title='Cuentas'>
              <FaFileInvoiceDollar />
            </Box>
            <Box link='clientes' title='Clientes'>
              <FaUsers />
            </Box>
            <Box link='invitados' title='Invitados'>
              <FaUserFriends />
            </Box>
          </div>
        </div>

      </BasicLayout>
    </ProtectedRoute>

  )
}
