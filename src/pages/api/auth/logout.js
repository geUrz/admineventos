import { serialize } from 'cookie';

export default function logoutHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { myToken } = req.cookies;

  if (!myToken) {
    return res.status(200).json({ message: 'Ya has cerrado sesión' });
  }

  // Serializar la cookie para eliminarla
  const serialized = serialize('myToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  res.setHeader('Set-Cookie', serialized);
  return res.status(200).json({ message: 'Cierre de sesión exitoso' });
}
