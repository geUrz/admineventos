import jwt from 'jsonwebtoken'
import connection from '@/libs/db'
import { parse } from 'cookie'

export default async function meHandler(req, res) {
  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.myToken;

    if (!token) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const decoded = jwt.verify(token, 'secret');

    const [rows] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];

    return res.json({ user: { id: user.id, nombre: user.nombre, usuario: user.usuario, email: user.email, nivel: user.nivel } });
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
