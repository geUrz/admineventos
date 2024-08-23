/* import connection from "@/libs/db"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { simple } = req.query

        try {
            let query = ''
            let params = []

            if (simple) {
                query = 'SELECT id, descripcion, createdAt, cliente_id, createdId FROM cotizaciones'
            } else {
                query = `
                    SELECT 
                        cotizaciones.id, 
                        cotizaciones.descripcion, 
                        cotizaciones.createdAt, 
                        cotizaciones.createdId, 
                        clientes.cliente AS cliente, 
                        usuarios.usuario AS usuario
                    FROM 
                        cotizaciones
                    JOIN 
                        clientes 
                    ON 
                        cotizaciones.cliente_id = clientes.id
                    JOIN
                        usuarios
                    ON
                        cotizaciones.createdId = usuarios.id
                `
            }

            const [rows] = await connection.query(query, params)
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        const { cliente_id, descripcion, createdId } = req.body

        try {
            const [result] = await connection.query(
                'INSERT INTO cotizaciones (cliente_id, descripcion, createdId) VALUES (?, ?, ?)',
                [cliente_id, descripcion, createdId]
            )
            res.status(201).json({ id: result.insertId })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const [result] = await connection.query(
                'DELETE FROM cotizaciones WHERE id = ?',
                [id]
            )

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Cotización eliminada correctamente' })
            } else {
                res.status(404).json({ message: 'Cotización no encontrada' })
            }
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}


 */

import connection from "@/libs/db";

export default async function handler(req, res) {
    const { method, query, body } = req;
    const { id } = query; // Obtén el ID de los parámetros de consulta

    if (method === 'GET') {
        // Maneja la solicitud GET
        const { simple } = query;

        try {
            let queryStr = '';
            let params = [];

            if (simple) {
                queryStr = 'SELECT id, descripcion, nota, createdAt, cliente_id, createdId FROM cotizaciones';
            } else {
                queryStr = `
                    SELECT 
                        cotizaciones.id, 
                        cotizaciones.descripcion, 
                        cotizaciones.nota, 
                        cotizaciones.createdAt, 
                        cotizaciones.createdId, 
                        clientes.cliente AS cliente, 
                        usuarios.usuario AS usuario
                    FROM 
                        cotizaciones
                    JOIN 
                        clientes 
                    ON 
                        cotizaciones.cliente_id = clientes.id
                    JOIN
                        usuarios
                    ON
                        cotizaciones.createdId = usuarios.id
                `;
            }

            const [rows] = await connection.query(queryStr, params);
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (method === 'POST') {
        // Maneja la solicitud POST
        const { cliente_id, descripcion, createdId } = body;

        try {
            const [result] = await connection.query(
                'INSERT INTO cotizaciones (cliente_id, descripcion, createdId) VALUES (?, ?, ?)',
                [cliente_id, descripcion, createdId]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (method === 'PUT') {

        const { nota } = body;

        if (!id || !nota) {
            return res.status(400).json({ error: 'Faltan parámetros o datos incorrectos' });
        }

        try {
            const [result] = await connection.query(
                'UPDATE cotizaciones SET nota = ? WHERE id = ?',
                [nota, id]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Nota actualizada correctamente' });
            } else {
                res.status(404).json({ message: 'Cotización no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (method === 'DELETE') {
        // Maneja la solicitud DELETE
        const { id } = query;

        try {
            const [result] = await connection.query(
                'DELETE FROM cotizaciones WHERE id = ?',
                [id]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Cotización eliminada correctamente' });
            } else {
                res.status(404).json({ message: 'Cotización no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}

