import connection from "@/libs/db"; // Asegúrate de que la ruta sea correcta

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { usuario_id } = req.query;

        try {
            let query;
            let params = [];

            if (usuario_id) {
                query = 'SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY createdAt DESC';
                params = [usuario_id];
            } else {
                query = 'SELECT * FROM notificaciones ORDER BY createdAt DESC';
            }

            const [rows] = await connection.query(query, params);
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
