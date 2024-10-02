// api/notificaciones/mark-as-read.js
import connection from '@/libs/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { usuario_id, notificacion_id, is_read } = req.body;

    if (!usuario_id || !notificacion_id || is_read === undefined) {
      return res.status(400).json({ error: 'Usuario ID, Notificación ID, y is_read son obligatorios' });
    }

    try {
      const result = await connection.query(
        'UPDATE notificaciones SET is_read = ? WHERE usuario_id = ? AND id = ?',
        [is_read, usuario_id, notificacion_id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }

      res.status(200).json({ message: 'Notificación actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
