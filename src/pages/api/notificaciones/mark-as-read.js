// api/notificaciones/mark-as-read.js
import connection from '@/libs/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { usuario_id } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ error: 'Usuario ID es obligatorio' });
    }

    try {
      await connection.query('UPDATE notificaciones SET is_read = 1 WHERE usuario_id = ?', [usuario_id]);
      res.status(200).json({ message: 'Notificaciones marcadas como leídas' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
