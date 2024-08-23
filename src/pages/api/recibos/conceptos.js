import connection from "@/libs/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { recibo_id, tipo, concepto, precio, cantidad } = req.body

        try {
            const [result] = await connection.query(
                'INSERT INTO conceptosrec (recibo_id, tipo, concepto, precio, cantidad ) VALUES (?, ?, ?, ?, ?)',
                [recibo_id, tipo, concepto, precio, cantidad ]
            );
            res.status(201).json({ id: result.insertId })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'GET') {
        const { recibo_id } = req.query

        try {
            let query = 'SELECT * FROM conceptosrec'
            let params = []

            if (recibo_id) {
                query += ' WHERE recibo_id = ?'
                params.push(recibo_id);
            }

            const [rows] = await connection.query(query, params)
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { concepto_id } = req.query

        try {
            const [result] = await connection.query('DELETE FROM conceptosrec WHERE id = ?', [concepto_id])
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Concepto no encontrado' })
            }
            res.status(200).json({ message: 'Concepto eliminado exitosamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        const { id } = req.query
        const { tipo, concepto, precio, cantidad } = req.body

        try {
            const [result] = await connection.query(
                'UPDATE conceptosrec SET tipo = ?, concepto = ?, precio = ?, cantidad = ? WHERE id = ?',
                [tipo, concepto, precio, cantidad, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Concepto no encontrado' })
            }
            res.status(200).json({ message: 'Concepto actualizado exitosamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
