export const formatDate = (fecha) => {
  const date = new Date(fecha)
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric',hour12: true }
  return date.toLocaleDateString('es-ES', options)
} 

