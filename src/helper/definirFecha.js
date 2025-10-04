export function convertirFechaConZonaHoraria(fecha, offsetHoras = 0) {
    const fechaUTC = new Date(fecha.getTime() + offsetHoras * 60 * 60 * 1000);
    const year = fechaUTC.getFullYear();
    const month = String(fechaUTC.getMonth() + 1).padStart(2, '0');
    const day = String(fechaUTC.getDate()).padStart(2, '0');
    const hours = String(fechaUTC.getHours()).padStart(2, '0');
    const minutes = String(fechaUTC.getMinutes()).padStart(2, '0');
    const seconds = String(fechaUTC.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}