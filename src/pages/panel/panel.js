import { ProtectedRoute } from '@/components/Layouts'
import { BasicLayout } from '@/layouts'
import { Box } from '@/components/Panel'
import styles from './panel.module.css'
import { FaCalendarAlt, FaFileAlt, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaRegFileCode, FaUserFriends, FaUsers } from 'react-icons/fa'

export default function Panel() {

    

  return (
    
    <ProtectedRoute>
      <BasicLayout relative>

        <div className={styles.main}>
          <div className={styles.section}>
            <Box link='eventos' title='eventos'>
              <FaCalendarAlt />
            </Box>
            <Box link='contratos' title='contratos'>
              <FaFileContract />
            </Box>
            <Box link='cotizaciones' title='cotizaciones'>
              <FaFileAlt />
            </Box>
            <Box link='recibos' title='Recibos'>
              <FaFileInvoice />
            </Box>
            <Box link='facturas' title='facturas'>
              <FaRegFileCode />
            </Box>
            <Box link='cuentas' title='cuentas'>
              <FaFileInvoiceDollar />
            </Box>
            <Box link='clientes' title='clientes'>
              <FaUsers />
            </Box>
            <Box link='invitados' title='invitados'>
              <FaUserFriends />
            </Box>
          </div>
        </div>

      </BasicLayout>
    </ProtectedRoute>

  )
}
