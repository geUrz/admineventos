/* export const formatDate = (fecha) => {
  const date = new Date(fecha)
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric',hour12: true }
  return date.toLocaleDateString('es-ES', options)
}  */

  import { format } from "date-fns";

  export const getDateOnly = (date) => {
    return new Date(date).toLocaleDateString('es-MX'); // Cambia 'en-US' según tu formato
  }
  
  export const formatDateInc = (fecha) => {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 1 a 12
    const day = String(date.getDate()).padStart(2, '0'); // Días de 1 a 31
  
    return `${year}-${month}-${day}`;
  }
  
  export const formatDateIncDet = (fecha) => {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 1 a 12
    const day = String(date.getDate()).padStart(2, '0'); // Días de 1 a 31
  
    return `${day}/${month}/${year}`;
  }
  
  export const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  
  export const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(1970, 0, 1, hours, minutes);
    return format(date, 'hh:mm a');
  }
  
  export const convertTo24HourFormat = (time12h) => {
    if (!time12h) return '';
    
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (modifier === 'PM' && +hours < 12) {
      hours = (+hours + 12).toString();
    } else if (modifier === 'AM' && +hours === 12) {
      hours = '00';
    }
    
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }
  
  
  
  export const convertTo12HourFormat = (time24h) => {
    if (!time24h) return '';
    
    let [hours, minutes] = time24h.split(':');
    const modifier = +hours >= 12 ? 'PM' : 'AM';
    hours = +hours % 12 || 12; // Ajustar las horas en formato 12 horas
    return `${String(hours).padStart(2, '0')}:${minutes} ${modifier}`;
  }
  
  export function formatDateVT(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }