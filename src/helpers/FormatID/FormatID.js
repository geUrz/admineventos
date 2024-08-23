export function formatId(id) {
  if (typeof id !== 'number') {
    return '00000'
  }
  return id.toString().padStart(5, '0')
}

export function formatClientId(id) {
  if (typeof id !== 'number') {
    return '000'
  }
  return id.toString().padStart(3, '0')
}