import { generateCode } from "@/helpers/generateCode/generateCode"
import connection from "@/libs/db"
import QRCode from 'qrcode'

export default async function handler(req, res) {
    const { id, usuario_id, search } = req.query;

    if (req.method === 'GET') {

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`
            try {
                const [rows] = await connection.query(
                    `SELECT
                        visitas.id,
                        visitas.usuario_id,
                        usuarios.nombre AS usuario_nombre,
                        usuarios.usuario AS usuario_usuario,
                        usuarios.privada AS usuario_privada,
                        usuarios.calle AS usuario_calle,
                        usuarios.casa AS usuario_casa,
                        visitas.codigo,
                        visitas.visita,
                        visitas.tipovisita,
                        visitas.tipoacceso,
                        visitas.nota,
                        visitas.date,
                        visitas.fromDate,
                        visitas.toDate,
                        visitas.hora,
                        visitas.estado,
                        visitas.dias,
                        visitas.createdAt
                    FROM visitas
                    JOIN usuarios ON visitas.usuario_id = usuarios.id
                    WHERE LOWER(usuarios.nombre) LIKE ? 
                    OR LOWER(usuarios.privada) LIKE ? 
                    OR LOWER(usuarios.calle) LIKE ? 
                    OR LOWER(usuarios.casa) LIKE ? 
                    OR LOWER(visitas.visita) LIKE ? 
                    OR LOWER(visitas.codigo) LIKE ? 
                    OR LOWER(visitas.tipovisita) LIKE ? 
                    OR LOWER(visitas.tipoacceso) LIKE ? 
                    OR LOWER(visitas.fromDate) LIKE ? 
                    OR LOWER(visitas.toDate) LIKE ? 
                    OR LOWER(visitas.estado) LIKE ?
                    ORDER BY visitas.updatedAt DESC`, 
                    [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
                )

                if (rows.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron visitas' })
                }

                const visitas = await Promise.all(rows.map(async (visita) => {
                    const qrCode = await QRCode.toDataURL(visita.codigo)  // Genera el QR
                    return { ...visita, qrCode };  // Devuelve los datos de la visita junto con el QR
                }))

                res.status(200).json(visitas)
            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' })
            }
            return;
        }

        // Caso para obtener visitas por usuario_id
        if (usuario_id) {
            try {
                const [rows] = await connection.query(
                    `SELECT
                        visitas.id,
                        visitas.usuario_id,
                        usuarios.nombre AS usuario_nombre,
                        usuarios.usuario AS usuario_usuario,
                        usuarios.privada AS usuario_privada,
                        usuarios.calle AS usuario_calle,
                        usuarios.casa AS usuario_casa,
                        visitas.codigo,
                        visitas.visita,
                        visitas.tipovisita,
                        visitas.tipoacceso,
                        visitas.nota,
                        visitas.date,
                        visitas.fromDate,
                        visitas.toDate,
                        visitas.hora,
                        visitas.estado,
                        visitas.dias,
                        autorizo_usuario.nombre AS autorizo_nombre,
                        autorizo_usuario.usuario AS autorizo_usuario,
                        autorizo_usuario.isAdmin AS autorizo_isAdmin,
                        visitas.createdAt
                    FROM visitas
                    JOIN usuarios ON visitas.usuario_id = usuarios.id
                    LEFT JOIN usuarios AS autorizo_usuario ON visitas.autorizo = autorizo_usuario.id
                    WHERE visitas.usuario_id = ?
                    ORDER BY visitas.updatedAt DESC`, [usuario_id]
                )

                if (rows.length === 0) {
                    return res.status(404).json({ error: 'No se encontraron visitas para el usuario' })
                }

                const visitas = await Promise.all(rows.map(async (visita) => {
                    const qrCode = await QRCode.toDataURL(visita.codigo)  // Genera el QR
                    return { ...visita, qrCode };  // Devuelve los datos de la visita junto con el QR
                }))

                res.status(200).json(visitas)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return;
        }

        // Caso para obtener todas las visitas
        try {
            const [rows] = await connection.query(
                `SELECT
                    visitas.id,
                    visitas.usuario_id,
                    usuarios.nombre AS usuario_nombre,
                    usuarios.usuario AS usuario_usuario,
                    usuarios.privada AS usuario_privada,
                    usuarios.calle AS usuario_calle,
                    usuarios.casa AS usuario_casa,
                    visitas.codigo,
                    visitas.visita,
                    visitas.tipovisita,
                    visitas.tipoacceso,
                    visitas.nota,
                    visitas.date,
                    visitas.fromDate,
                    visitas.toDate,
                    visitas.hora,
                    visitas.estado,
                    visitas.dias,
                    autorizo_usuario.nombre AS autorizo_nombre,
                    autorizo_usuario.usuario AS autorizo_usuario,
                    autorizo_usuario.isAdmin AS autorizo_isAdmin,
                    visitas.createdAt
                FROM visitas
                JOIN usuarios ON visitas.usuario_id = usuarios.id
                LEFT JOIN usuarios AS autorizo_usuario ON visitas.autorizo = autorizo_usuario.id
                ORDER BY visitas.updatedAt DESC`
            )

            const visitas = await Promise.all(rows.map(async (visita) => {
                const qrCode = await QRCode.toDataURL(visita.codigo)  // Genera el QR
                return { ...visita, qrCode };  // Devuelve los datos de la visita junto con el QR
            }))

            res.status(200).json(visitas)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, visita, tipovisita, tipoacceso, nota, date, fromDate, toDate, estado, dias, autorizo } = req.body;
            if (!usuario_id || !visita || !tipovisita || !tipoacceso) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }
            
            const code = generateCode() // Genera el código
      
            const [result] = await connection.query(
                'INSERT INTO visitas (usuario_id, visita, tipovisita, tipoacceso, codigo, nota, date, fromDate, toDate, estado, dias, autorizo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, visita, tipovisita, tipoacceso, code, nota, date, fromDate, toDate, estado, tipoacceso === 'frecuente' ? dias : null, autorizo]
            )
      
            const qrCode = await QRCode.toDataURL(code)  // Genera el QR a partir del código

            res.status(201).json({ id: result.insertId, code, qrCode })  // Devuelve el código y el QR generado
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la visita es obligatorio' })
        }

        const { visita, tipovisita, tipoacceso, nota, date, fromDate, toDate, hora, estado, dias } = req.body;

        if (visita && tipovisita) {
            // Actualización completa del negocio
            try {
                const [result] = await connection.query(
                    'UPDATE visitas SET visita = ?, tipovisita = ?, tipoacceso = ?, nota = ?, date = ?, fromDate = ?, toDate = ?, hora = ?, estado = ?, dias = ? WHERE id = ?',
                    [visita, tipovisita, tipoacceso, nota, date, fromDate, toDate,hora, estado, tipoacceso === 'frecuente' ? dias : null, id]
                )

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Visita no encontrada' })
                }

                res.status(200).json({ message: 'Visita actualizada correctamente' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        } else {
            return res.status(400).json({ error: 'Datos insuficientes para actualizar la visita' })
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la visita es obligatorio' })
        }

        // Eliminar la visita por ID
        try {
            const [result] = await connection.query('DELETE FROM visitas WHERE id = ?', [id])

            // Verificar si la visita fue eliminada
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Visita no encontrada' })
            }

            res.status(200).json({ message: 'Visita eliminada correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
