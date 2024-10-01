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
  const {id} = req.query

  if (req.method === 'GET') {
    if(id) {
      try {
        const [rows] = await connection.query('SELECT id, usuario_id, folio, tipo, cliente, descripcion, estado, updatedAt, createdAt FROM contratos WHERE id = ?', [id])

        if (rows.length === 0) {
          return res.status(404).json({ error: 'Contrato no encontrado' });
        }

        res.status(200).json(rows[0])

      } catch (error) {
          res.status(500).json({ error: error.message })
      }
    }else {
      try {
        const [rows] = await connection.execute('SELECT * FROM contratos');
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ message: 'Error al obtener los contratos', error });
      }
    }
  } else if (req.method === 'POST') {
    const { usuario_id, folio, tipo, cliente, descripcion, estado } = req.body;

    try {
      const query = 'INSERT INTO contratos (usuario_id, folio, tipo, cliente, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [usuario_id, folio, tipo, cliente, descripcion, estado]

      const header = 'Contrato'
      const message = `${tipo}`
      const url = '/contratos'
      await sendNotification(usuario_id, header, message, url)

      await connection.execute(query, values);
      res.status(200).json({ message: 'Contrato añadido exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al añadir el contrato', error });
    }
  } else if (req.method === 'PUT') {
    if (!id) {
        return res.status(400).json({ error: 'ID del contrato es obligatorio' })
    }

    const { tipo, cliente, descripcion, estado } = req.body;

    if (tipo && cliente) {
        // Actualización completa del negocio
        try {

            const [result] = await connection.query(
                'UPDATE contratos SET tipo = ?, cliente = ?, descripcion = ?, estado = ?',
                [tipo, cliente, descripcion, estado]
            )

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Contrato no encontrado' })
            }

            res.status(200).json({ message: 'Contrato actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        return res.status(400).json({ error: 'Datos insuficientes para actualizar el contrato' })
    } 
  
  } else if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'ID de del contrato es obligatorio' });
    }

    else {
      // Eliminar el contrato por ID
      try {
        const [result] = await connection.query('DELETE FROM contratos WHERE id = ?', [id]);

        // Verificar si el contrato fue eliminado
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Contrato no encontrado' });
        }

        res.status(200).json({ message: 'Contrato eliminado correctamente' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } 
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
