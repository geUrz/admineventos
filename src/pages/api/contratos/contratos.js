import connection from "@/libs/db";

export default async function handler(req, res) {
  const {id} = req.query

  if (req.method === 'GET') {
    if(id) {
      try {
        const [rows] = await connection.query('SELECT id, tipo, cliente, cel, email FROM contratos WHERE id = ?', [id])

        if (rows.length === 0) {
          return res.status(404).json({ error: 'Cliente no encontrado' });
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
    const { tipo, cliente, cel, email } = req.body;

    try {
      const query = 'INSERT INTO contratos (tipo, cliente, cel, email) VALUES (?, ?, ?, ?)';
      const values = [tipo, cliente, cel, email];

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
