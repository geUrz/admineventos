// pages/api/savePlayerId.js
import connection from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { playerId, userId } = req.body; // Ahora recibimos userId

    if (!playerId || !userId) {
      return res.status(400).json({ message: 'Player ID o User ID no proporcionados' });
    }

    try {
      await connection.execute(`
        UPDATE usuarios SET onesignal_player_id = ? WHERE id = ?
      `, [playerId, userId]);
      console.log('Player ID guardado:', playerId, 'para el usuario:', userId)
      return res.status(200).json({ message: 'Player ID guardado' });
    } catch (error) {
      console.error('Error al guardar el Player ID:', error.message);
      return res.status(500).json({ message: 'Error al guardar el Player ID' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
