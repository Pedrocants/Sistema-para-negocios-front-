import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerDatos } from '../helper/traeDatos';
import { mostrarUnaOrden, eliminarUnaOrden, updateOrden } from '../helper/url';
import { Button, ButtonHiellow } from './ModalStyles';

const OrderDetail = ({ token }) => {
    const { id } = useParams();
    const [orden, setOrden] = useState(null);
    const [estado, setEstado] = useState(false);
    const isFirstRender = useRef(true);

    useEffect(() => {
        fetchOrden();
    }, [id]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        async function update() {
            orden.idOrden = id;
            orden.pagado = orden.total;
            const urlUpdate = updateOrden();
            const data = obtenerDatos(urlUpdate, 'PUT', token, orden);
            if (data) {
                fetchOrden();
            }
        }
        update();
    }, [estado]);

    async function fetchOrden() {
        const datos = await obtenerDatos(mostrarUnaOrden(id), 'GET', token);
        setOrden(datos);
    }

    if (!orden) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando detalle...</div>;

    const fechaCarga = new Date(orden.fecha_carga);
    const fechaEntrega = new Date(orden.fecha_entrega);

    const formatearHora = (fecha) => fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatearFecha = (fecha) => fecha.toLocaleDateString();
    const fechasIguales = fechaCarga.toDateString() === fechaEntrega.toDateString();

    const manufacturados = orden.detalle.filter(d => d.productos && d.productos.denominacion);
    const insumos = orden.detalle.filter(d => d.insumo && d.insumo.denominacion);

    const handlerEliminar = async () => {
        if (orden) {
            const data = await obtenerDatos(eliminarUnaOrden(id), 'DELETE', token);
            alert("Orden eliminada con exito.");
            window.location.href = '/';
        }
    }

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2rem',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ color: 'red', textAlign: 'center' }}>
                {orden.cliente != null ? orden.cliente.nombre + " " + orden.cliente.apellido : "Cliente local (caja)"}
            </h1>

            <div style={{ marginBottom: '1rem' }}>
                <p><strong>ID Orden:</strong> #{orden.idOrden}</p>
                <p><strong>Tipo Orden:</strong> {orden.tipoOrden}</p>
                <p><strong>Tipo de Pago:</strong> {orden.tipoPago}</p>
                <p><strong>Estado:</strong> {orden.estado}</p>
                {orden.estado == 'parcial_pendiente' && orden.tipoOrden != 'AGREGACION_DE_STOCK' && orden.tipoOrden != 'DEVOLUCION_O_ELIMINACION_DE_STOCK' && (
                    <ButtonHiellow onClick={() => setEstado(!estado)}>Actualizar a pagado ${(orden.total - orden.pagado).toLocaleString('es-AR')}</ButtonHiellow>
                )}
                <p><strong>Subtotal:</strong> ${orden.subTotal.toLocaleString('es-AR')}</p>
                <p><strong>Total:</strong> ${orden.total.toLocaleString('es-AR')}</p>
                <p><strong>Pagado:</strong> ${orden.pagado.toLocaleString('es-AR')}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h3>Contacto</h3>
                <p><strong>Teléfono:</strong> {orden.contacto != null ? orden.contacto.telefono : 'Sin contacto.'}</p>
                <p><strong>Email:</strong> {orden.contacto != null ? orden.contacto.email : 'Sin email'}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h3>Domicilio</h3>
                <p><strong>Dirección:</strong> {orden.domicilio ? orden.domicilio.direccion : 'Sin domicilio'}</p>
                <p><strong>Provincia:</strong> {orden.domicilio ? orden.domicilio.provincia : 'Ninguna'}</p>
            </div>

            <div style={{ marginBottom: '1rem', color: '#0066cc' }}>
                {fechasIguales ? (
                    <p><strong>Fecha de entrega y carga: </strong>{formatearFecha(fechaCarga)}</p>
                ) : (
                    <>
                        <p><strong>Fecha de carga:</strong> {formatearFecha(fechaCarga)} - {formatearHora(fechaCarga)}</p>
                        <p><strong>Fecha de entrega:</strong> {formatearFecha(fechaEntrega)} - {formatearHora(fechaEntrega)}</p>
                    </>
                )}
            </div>
            {manufacturados.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3>Productos Manufacturados</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead style={theadStyle}>
                                <tr>
                                    <th style={cellStyle}>Producto</th>
                                    <th style={cellStyle}>Descripción</th>
                                    <th style={cellStyle}>Cantidad</th>
                                    <th style={cellStyle}>Precio</th>
                                    <th style={cellStyle}>Descuento</th>
                                    <th style={cellStyle}>Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {manufacturados.map((item, index) => (
                                    <tr key={index} style={index % 2 === 0 ? rowEven : rowOdd}>
                                        <td style={cellStyle}>{item.productos.denominacion}</td>
                                        <td style={cellStyle}>{item.productos.descripcion || 'Sin descripción'}</td>
                                        <td style={cellStyle}>{item.cantidadProducto}</td>
                                        <td style={cellStyle}>${item.productos.precio.toFixed(2)}</td>
                                        <td style={cellStyle}>${item.descuentosPorProducto.toLocaleString('es-AR')}</td>
                                        <td style={cellStyle}>{item.observaciones}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {insumos.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3>Otros Productos (Insumos)</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead style={theadStyle}>
                                <tr>
                                    <th style={cellStyle}>Producto</th>
                                    <th style={cellStyle}>¿Para Elaborar?</th>
                                    <th style={cellStyle}>Cantidad</th>
                                    <th style={cellStyle}>Precio</th>
                                    <th style={cellStyle}>Descuento</th>
                                    <th style={cellStyle}>Observaciones</th>
                                    <th style={cellStyle}>Marca</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insumos.map((item, index) => (
                                    <tr key={index} style={index % 2 === 0 ? rowEven : rowOdd}>
                                        <td style={cellStyle}>{item?.insumo?.denominacion}</td>
                                        <td style={cellStyle}>{item?.insumo?.esParaElaborar ? 'Sí' : 'No'}</td>
                                        <td style={cellStyle}>{item?.cantidadInsumo}</td>
                                        <td style={cellStyle}>${item.insumo.precio.toLocaleString('es-AR')}</td>
                                        <td style={cellStyle}>${(!item.productos) ? item?.descuentosPorProducto.toLocaleString('es-AR') : 0}</td>
                                        <td style={cellStyle}>{(!item.productos) ? item?.observaciones : 'Sin observaciones'}</td>
                                        <td style={cellStyle}>{(item.insumo.marca) ? item.insumo.marca.nombre : 'sin marca'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Button onClick={handlerEliminar}>Eliminar orden</Button>
        </div>
    );
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    backgroundColor: '#ffffff',
    color: '#000000'
};

const theadStyle = {
    backgroundColor: '#333',
    color: '#fff'
};

const cellStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left'
};

const rowEven = { backgroundColor: '#f2f2f2' };
const rowOdd = { backgroundColor: '#ffffff' };

export default OrderDetail;