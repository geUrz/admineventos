import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField } from 'semantic-ui-react'
import { Confirm, IconClose } from '@/components/Layouts'
import { FaCheck, FaTimes } from 'react-icons/fa'
import styles from './ModCuentaForm.module.css'

export function ModCuentaForm(props) {

  const {onOpenClose} = props

  const [showConfirm, setShowConfirm] = useState(false)

  const onShowConfirm = () => setShowConfirm((prevState) => !prevState)

  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    newUsuario: user.usuario || '',
    newEmail: user.email || '',
    newPassword: '',
    confirmPassword: '' 
  })

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {};
  
    if (!formData.newUsuario) {
      newErrors.newUsuario = 'El campo es requerido';
    }
  
    if (!formData.newEmail) {
      newErrors.newEmail = 'El campo es requerido';
    }
    
    onShowConfirm()

    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormUser()) {
      return
    }

    setError(null)
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      onShowConfirm()
      return
    }

    try {
      await axios.put('/api/auth/updateUser', {
        userId: user.id,
        newUsuario: formData.newUsuario,
        newEmail: formData.newEmail,
        newPassword: formData.newPassword,
      })

      logout()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  };

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      <Form>
        <FormGroup>
          <FormField error={!!errors.newUsuario}>
            <Label>Nuevo Usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <span className={styles.error}>{errors.newUsuario}</span>}
          </FormField>
          <FormField error={!!errors.newEmail}>
            <Label>Nuevo Correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
            {errors.newEmail && <span className={styles.error}>{errors.newEmail}</span>}
          </FormField>
          <FormField>
            <Label>Nueva Contraseña</Label>
            <Input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Confirmar nueva contraseña</Label>
            <Input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary onClick={onShowConfirm}>Guardar</Button>
      </Form>

      <Confirm
        open={showConfirm}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleSubmit}
        onCancel={onShowConfirm}
        content='La sesión se cerrara, tendrás que iniciar sesión con el nuevo usuario. ¿ Estas seguro de modificar el usuario ?'
      />

    </>

  )
}
