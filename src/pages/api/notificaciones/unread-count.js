// api/notificaciones/unread-count.js
import connection from '@/libs/db';

export default async function handler(req, res) {
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ error: 'Usuario ID es obligatorio' });
  }

  try {
    const [rows] = await connection.query(
      'SELECT COUNT(*) AS count FROM notificaciones WHERE usuario_id = ? AND is_read = 0',
      [usuario_id]
    );
    res.status(200).json({ count: rows[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
