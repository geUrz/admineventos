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
    const { id } = req.query;

    if (req.method === 'GET') {
        if (id) {
            // Obtener un cliente por ID
            try {
                const [rows] = await connection.query('SELECT id, folio, nombre, cel, email, createdAt FROM clientes WHERE id = ?', [id])

                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Cliente no encontrado' });
                }

                res.status(200).json(rows[0])
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        } else {
            // Obtener todos los clientes
            try {
                const [rows] = await connection.query('SELECT id, folio, nombre, cel, email, createdAt FROM clientes');
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    } else if (req.method === 'POST') {
        try {
            const { folio, nombre, cel, email } = req.body
            if (!nombre || !cel || !email) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query('INSERT INTO clientes (folio, nombre, cel, email) VALUES (?, ?, ?, ?)', [folio, nombre, cel, email])

            const header = 'Cliente'
            const message = `${nombre}`
            const url = '/clientes'
            await sendNotification(usuario_id, header, message, url)

            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID del cliente es obligatorio' })
        }

        const { nombre, cel, email } = req.body

        if (!nombre || !cel || !email) {
            return res.status(400).json({ error: 'Todos los datos son obligatorios' })
        }

        try {
            const [result] = await connection.query('UPDATE clientes SET nombre = ?, cel = ?, email = ? WHERE id = ?', [nombre, cel, email, id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' })
            }

            res.status(200).json({ message: 'Cliente actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID de del cliente es obligatorio' });
        }

        else {
            // Eliminar el cliente por ID
            try {
                const [result] = await connection.query('DELETE FROM clientes WHERE id = ?', [id]);

                // Verificar si el cliente fue eliminado
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Cliente no encontrado' });
                }

                res.status(200).json({ message: 'Cliente eliminado correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
