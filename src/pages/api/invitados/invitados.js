import connection from "@/libs/db"
import axios from "axios";

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY;

// Función para enviar notificación
async function sendNotification(usuario_id, header, message, url) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
  };

  const data = {
    app_id: ONE_SIGNAL_APP_ID,
    included_segments: ['All'],
    headings: { en: header }, 
    contents: { en: message },
    url: url
  };

  try {
    await axios.post('https://onesignal.com/api/v1/notifications', data, { headers })

    await connection.query(
      'INSERT INTO notificaciones (usuario_id, header, message, url) VALUES (?, ?, ?, ?)',
      [usuario_id, header, message, url]
  )

  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
}

export default async function handler(req, res) {
  const {id, search} = req.query

  if (req.method === 'GET') {
    
    if (search) {
      const searchQuery = `%${search.toLowerCase()}%`
      try {
          const [rows] = await connection.query(
              `SELECT
                  id,
                  folio,
                  tipo,
                  cliente,
                  descripcion,
                  personas,
                  date,
                  estado
              FROM eventos
              WHERE LOWER(folio) LIKE ? 
              OR LOWER(tipo) LIKE ?  
              OR LOWER(cliente) LIKE ? 
              OR LOWER(descripcion) LIKE ? 
              OR LOWER(personas) LIKE ? 
              OR LOWER(date) LIKE ? 
              OR LOWER(estado) LIKE ?
              ORDER BY updatedAt DESC`, 
              [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
          )

          if (rows.length === 0) {
              return res.status(404).json({ message: 'No se encontraron eventos' })
          }

          res.status(200).json(visitas)
      } catch (error) {
          res.status(500).json({ error: 'Error al realizar la búsqueda' })
      }
      return;
  }

    if(id) {
      try {
        const [rows] = await connection.query('SELECT id, usuario_id, folio, tipo, cliente, personas, descripcion, date, estado, updatedAt, createdAt FROM eventos WHERE id = ?', [id])

        if (rows.length === 0) {
          return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.status(200).json(rows[0])

      } catch (error) {
          res.status(500).json({ error: error.message })
      }
    }else {
      try {
        const [rows] = await connection.execute('SELECT * FROM eventos');
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ message: 'Error al obtener los eventos', error });
      }
    }
  } else if (req.method === 'POST') {
    const { usuario_id, folio, tipo, cliente, personas, descripcion, date, estado } = req.body;

    try {
      const query = 'INSERT INTO eventos (usuario_id, folio, tipo, cliente, personas, descripcion, date, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [usuario_id, folio, tipo, cliente, personas, descripcion, date, estado]

      const header = 'Evento'
      const message = `${tipo}`
      const url = '/eventos'
      await sendNotification(usuario_id, header, message, url)

      await connection.execute(query, values);
      res.status(200).json({ message: 'Evento añadido exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al añadir el evento', error });
    }
  } else if (req.method === 'PUT') {
    if (!id) {
        return res.status(400).json({ error: 'ID del evento es obligatorio' })
    }

    const { tipo, cliente, personas, descripcion, date, estado } = req.body;

    if (tipo && cliente) {
        // Actualización completa del negocio
        try {

            const [result] = await connection.query(
                'UPDATE eventos SET tipo = ?, cliente = ?, personas = ?, descripcion = ?, date = ?, estado = ?',
                [tipo, cliente, personas, descripcion, date, estado]
            )

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Evento no encontrado' })
            }

            res.status(200).json({ message: 'Evento actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        return res.status(400).json({ error: 'Datos insuficientes para actualizar el evento' })
    } 
  
  } else if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'ID de del evento es obligatorio' });
    }

    else {
      // Eliminar el evento por ID
      try {
        const [result] = await connection.query('DELETE FROM eventos WHERE id = ?', [id]);

        // Verificar si el evento fue eliminado
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.status(200).json({ message: 'Evento eliminado correctamente' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } 
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
