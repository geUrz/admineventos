import { Button, Form, FormField, FormGroup, Image, Input, Label } from 'semantic-ui-react'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { FaUser, FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'
import { useRedirectIfAuthenticated } from '@/hooks'
import styles from './signin.module.css'

export default function Signin() {

  const [errors, setErrors] = useState({})

  const [credentials, setCredentials] = useState({
    emailOrUsuario: '',
    password: ''
  })

  useRedirectIfAuthenticated()

  const [activate, setActivate] = useState(false)

  const timer = useRef(null)

  const handleTouchStart = () => {
    timer.current = setTimeout(() => {
      setActivate(prev => !prev)
    }, 3000)
  }

  const handleTouchEnd = () => {
    clearTimeout(timer.current)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === '0') {
      e.preventDefault()
      setActivate((prevState) => !prevState)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const { login } = useAuth()
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const validarFormSignIn = () => {
    const newErrors = {}

    if (!credentials.emailOrUsuario) {
      newErrors.emailOrUsuario = 'El campo es requerido'
    }

    if (!credentials.password) {
      newErrors.password = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validarFormSignIn()) {
      return
    }
    setError(null)

    try {
      await login(credentials.emailOrUsuario, credentials.password)
    } catch (error) {
      console.error('Error capturado:', error);

      if (error?.status === 401) {
        setError(error.data.error || '¡ Correo o contraseña no existe !');
      } else {
        setError(error?.data?.error || '¡ Ocurrió un error inesperado !');
      }
    }
  }

  return (

      <div className={styles.main}>
        <div className={styles.logo}>
          <Image src='/img/admineventos_join.webp' />
        </div>
        <div className={styles.boxForm}>
          <div className={styles.user}>
            <FaUserCircle onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
            <h1>Iniciar sesión</h1>
          </div>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormField error={!!errors.emailOrUsuario}>
                <Label>Usuario / Correo</Label>
                <Input
                  name='emailOrUsuario'
                  type='text'
                  value={credentials.emailOrUsuario}
                  onChange={handleChange}
                />
                {errors.emailOrUsuario && <span className={styles.error}>{errors.emailOrUsuario}</span>}
              </FormField>
              <FormField error={!!errors.password}>
                <Label>Contraseña</Label>
                <Input
                  name='password'
                  type='password'
                  value={credentials.password}
                  onChange={handleChange}
                />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </FormField>
            </FormGroup>
            {error && <p className={styles.error}>{error}</p>}
            <Button secondary type='submit'>Iniciar sesión</Button>
          </Form>

          {activate ? (
            <div className={styles.link}>
              <Link href='/join/signup'>
                ¿No tienes un usuario?, Crea uno aquí
              </Link>
            </div>
          ) : (
            ''
          )}

        </div>

      </div>

   

  )
}
