import connection from "@/libs/db"

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        if (id) {
            // Obtener un cliente por ID
            try {
                const [rows] = await connection.query('SELECT id, cliente, contacto, direccion, cel, email FROM clientes WHERE id = ?', [id])

                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Cliente no encontrado' });
                }

                res.status(200).json(rows[0])
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        } else {
            // Obtener todos los clientes
            try {
                const [rows] = await connection.query('SELECT id, cliente, contacto, direccion, cel, email FROM clientes');
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    } else if (req.method === 'POST') {
        try {
            const { cliente, contacto, cel, direccion, email } = req.body
            if (!cliente || !contacto || !cel || !direccion || !email) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query('INSERT INTO clientes (cliente, contacto, cel, direccion, email) VALUES (?, ?, ?, ?, ?)', [cliente, contacto, cel, direccion, email])
            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID del cliente es obligatorio' })
        }

        const { cliente, contacto, cel, direccion, email } = req.body

        if (!cliente || !contacto || !cel || !direccion || !email) {
            return res.status(400).json({ error: 'Todos los datos son obligatorios' })
        }

        try {
            const [result] = await connection.query('UPDATE clientes SET cliente = ?, contacto = ?, cel = ?, direccion = ?, email = ? WHERE id = ?', [cliente, contacto, cel, direccion, email, id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' })
            }

            res.status(200).json({ message: 'Cliente actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID del cliente es obligatorio' })
        }

        try {
            // Actualizar la columna client_id en la tabla notas a NULL para el cliente que se va a eliminar
            await connection.query('UPDATE notas SET cliente_id = NULL WHERE cliente_id = ?', [id])

            // Ahora eliminar el cliente
            const [result] = await connection.query('DELETE FROM clientes WHERE id = ?', [id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' })
            }

            res.status(200).json({ message: 'Cliente eliminado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
