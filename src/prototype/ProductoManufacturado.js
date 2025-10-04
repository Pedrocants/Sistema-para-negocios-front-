class ProductoManufacturado {
    constructor(denominacion, unidad, detalle, insumos, historial, precio, cantVendidas, descripcion, tiempoEstimado, eliminado) {
        this.denominacion = denominacion;
        this.unidad = unidad;
        this.detalle = detalle;
        this.insumos = insumos;
        this.historial = historial;
        this.precio = precio;
        this.cantVendidas = cantVendidas;
        this.descripcion = descripcion;
        this.tiempoEstimado = tiempoEstimado;
        this.eliminado = eliminado;
    }
}

export default ProductoManufacturado;