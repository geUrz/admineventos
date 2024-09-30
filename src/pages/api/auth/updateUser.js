import connection from '@/libs/db'; // Asegúrate de importar la configuración de la base de datos
import bcrypt from 'bcrypt';

export default async function updateUserHandler(req, res) {
  const { userId, newNombre, newUsuario, newEmail, newNivel, newPassword } = req.body;

  try {
    // Verificar si el nuevo email o el nuevo nombre de usuario ya están registrados por otro usuario
    const [existingUser] = await connection.query(
      'SELECT * FROM usuarios WHERE (email = ? OR usuario = ?) AND id != ?',
      [newEmail, newUsuario, userId]
    );

    if (existingUser.length > 0) {
      if (existingUser[0].email === newEmail) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }
      if (existingUser[0].usuario === newUsuario) {
        return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
      }
    }

    // Si se proporciona una nueva contraseña, hashearla
    let hashedPassword;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Obtener los datos actuales del usuario para no sobreescribirlos si no se pasan nuevos valores
    const [currentUser] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [userId])

    console.log("Usuario encontrado:", currentUser);

    if (currentUser.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updatedNombre = newNombre || currentUser[0].nombre;
    const updatedUsuario = newUsuario || currentUser[0].usuario;
    const updatedEmail = newEmail || currentUser[0].email;
    const updatedNivel = newNivel || currentUser[0].nivel;
    const updatedPassword = hashedPassword || currentUser[0].password;

    // Actualizar el usuario en la base de datos
    await connection.query(
      'UPDATE usuarios SET nombre = ?, usuario = ?, email = ?, nivel = ?, password = ? WHERE id = ?',
      [updatedNombre, updatedUsuario, updatedEmail, updatedNivel, updatedPassword, userId]
    );

    // Devolver una respuesta exitosa
    return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
