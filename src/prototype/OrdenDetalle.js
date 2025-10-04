function OrdenDetalle({
    idOrdenDetalle = null,
    productos = { idProductoManufacturado: null },
    descuentosPorProducto = 0.0,
    observaciones = "",
    cantidadProducto = 0,
} = {}) {
    this.idOrdenDetalle = idOrdenDetalle;
    this.productos = productos;
    this.descuentosPorProducto = descuentosPorProducto;
    this.observaciones = observaciones;
    this.cantidadProducto = cantidadProducto;
}

export default OrdenDetalle;