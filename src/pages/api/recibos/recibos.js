import connection from "@/libs/db"

import axios from "axios"

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY

// Función para enviar notificación
async function sendNotification(message) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
  };

  const data = {
    app_id: ONE_SIGNAL_APP_ID,
    included_segments: ['All'],
    contents: { en: message },
  };

  try {
    await axios.post('https://onesignal.com/api/v1/notifications', data, { headers })
  } catch (error) {
    console.error('Error sending notification:', error.message)
  }
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (id && req.query.firma) {
      try {
        // Obtener la firma del recibo específico
        const [rows] = await connection.query('SELECT firma FROM recibos WHERE id = ?', [id]);
        if (rows.length > 0) {
          res.status(200).json({ firma: rows[0].firma });
        } else {
          res.status(404).json({ message: 'Recibo no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      try {
        const query = `
          SELECT 
            recibos.id, 
            recibos.descripcion, 
            recibos.createdAt, 
            recibos.firma, 
            recibos.nota, 
            recibos.iva, 
            clientes.cliente AS cliente, 
            usuarios.usuario AS usuario
          FROM 
            recibos
          JOIN 
            clientes 
          ON 
            recibos.cliente_id = clientes.id
          JOIN
            usuarios
          ON
            recibos.createdId = usuarios.id
        `;
        const [rows] = await connection.query(query);
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  } else if (req.method === 'POST') {
    const { cliente_id, descripcion, createdId } = req.body

    try {
      const [result] = await connection.query(
        'INSERT INTO recibos (cliente_id, descripcion, createdId) VALUES (?, ?, ?)',
        [cliente_id, descripcion, createdId]
      )

      const message = `Se ha creado un nuevo recibo para el cliente ${cliente_id}.`
      await sendNotification(message)

      res.status(201).json({ id: result.insertId })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    const { nota, firma, iva } = req.body

    try {
      let query = 'UPDATE recibos SET'
      const params = []

      if (nota !== undefined) {
        query += ' nota = ?,'
        params.push(nota);
      }

      if (firma !== undefined) {
        query += ' firma = ?,'
        params.push(firma);
      }

      if (iva !== undefined) {
        query += ' iva = ?,'
        params.push(iva);
      }

      query = query.slice(0, -1) + ' WHERE id = ?'
      params.push(id)

      const [result] = await connection.query(query, params)

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Recibo actualizado correctamente' })
      } else {
        res.status(404).json({ message: 'Recibo no encontrado' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query

    try {
      const [result] = await connection.query(
        'DELETE FROM recibos WHERE id = ?',
        [id]
      )

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Recibo eliminado correctamente' })
      } else {
        res.status(404).json({ message: 'Recibo no encontrado' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
