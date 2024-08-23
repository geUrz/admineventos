import connection from "@/libs/db"

export default async function handler(req, res) {
    const {id} = req.query

    if (req.method === 'GET') {
        if(id){
            try {
                const [rows] = await connection.query('SELECT id, usuario, nivel, cel, email FROM usuarios WHERE id = ?', [id])

                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                res.status(200).json(rows[0])
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        } else {
            try {
                const [rows] = await connection.query('SELECT id, usuario, nivel, cel, email FROM usuarios');
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
