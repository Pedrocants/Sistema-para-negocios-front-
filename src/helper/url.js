export function obtenerUrl() {
    const url = process.env.RACT_APP_API_URL;

    return (url != null || url != undefined) ? url : "http://localhost:8080/";
}
export function mostrarOrdenes(page = 0, size = 10) {
    let urlOrdenes = obtenerUrl() + "orden/mostrarTodas?page=" + page + "&size=" + size;
    return urlOrdenes;
}
export function mostrarProductos() {
    let urlProductos = obtenerUrl() + "productos";
    return urlProductos;
}
export function manufacturadoFiindById(id) {
    const urlProductos = obtenerUrl() + "buscar/" + id;
    return urlProductos;
}
export function obtenerIdUsuario(userName) {
    let urlId = obtenerUrl() + "user/getUserId?userName=" + userName;
    return urlId;
}
export function guardarProducto(esManufacturado) {
    if (esManufacturado) {
        return obtenerUrl() + "guardarProducto"
    }
    return obtenerUrl() + "insumo/guardar"
}

export const mostrarUnaOrden = (id) => obtenerUrl() + `orden/buscarPorId?idOrden=${id}`;

export function obtenerUnidades() {
    return obtenerUrl() + "unidad/obtenerUnidades";
}
export function getInsumos(esParaElaborar = false) {
    const url = (esParaElaborar) ? obtenerUrl() + "insumo/retornarTodosParaElaborar" : obtenerUrl() + "insumo/retornarTodos";
    return url;
}
export function insumoFindById(id) {
    return obtenerUrl() + "insumo/buscarPorId/" + id;
}
export function getMarcas() {
    return obtenerUrl() + "marca/getMarcas";
}
export function guardarMarca() {
    return obtenerUrl() + "marca/save";
}
export function buscarMarca(id) {
    return obtenerUrl() + "marca/buscar/" + id;
}
export function getClientes() {
    return obtenerUrl() + "clientes";
}
export function guardarOrden() {
    return obtenerUrl() + "orden/guardar";
}
export function updateOrden() {
    return obtenerUrl() + "orden/update";
}
export function obtenerHistorial(id) {
    return obtenerUrl() + "generarHistorial?idProducto=" + id;
}
export function excelPorFecha(fecha) {
    if (!fecha) {
        return obtenerUrl() + "reportes/excel";
    }
    return obtenerUrl() + "reportes/excelPorFecha?fecha_carga=" + fecha;
}
export function reportes_ventasProducto(desde, hasta) {
    return obtenerUrl() + "reportes/reporte-ventas?desde=" + desde + "&hasta=" + hasta;
}
export function eliminarUnaOrden(id) {
    return obtenerUrl() + "orden/eliminar/" + id;
}
export function getProvincias() {
    return "https://apis.datos.gob.ar/georef/api/provincias";
}
export function actualizarProducto(manufacturado = false) {
    if (manufacturado) {
        return obtenerUrl() + "actualizarProducto";
    }
    return obtenerUrl() + "insumo/actualizar";
}
export function traerDatosCliente(idCliente) {
    return obtenerUrl() + "orden/cliente/" + idCliente;
}