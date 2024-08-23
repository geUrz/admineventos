import connection from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await connection.execute('SELECT * FROM eventos');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los eventos', error });
    }
  } else if (req.method === 'POST') {
    const { titulo, inicio, final } = req.body;

    try {
      const query = 'INSERT INTO eventos (titulo, inicio, final) VALUES (?, ?, ?)';
      const values = [titulo, new Date(inicio), new Date(final)];

      await connection.execute(query, values);
      res.status(200).json({ message: 'Evento añadido exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al añadir el evento', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
