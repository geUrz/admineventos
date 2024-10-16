import { ProtectedRoute, Title } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout } from '@/layouts'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Misinvitados() {

  const {user, loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [misinvitados, setMisinvitados] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`api/misinvitados/misinvitados?id=${user.id}`)
        setMisinvitados(res.data)
      } catch (error) {
          console.error(error)
      }
    })()
  }, [reload])

  return (
    
    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        <Title title='mis invitados' />

      </BasicLayout>

    </ProtectedRoute>

  )
}
