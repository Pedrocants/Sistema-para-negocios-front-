import Cliente from './Cliente';
import Contacto from './Contacto';
import Usuario from './Usuario';
import { convertirFechaConZonaHoraria } from '../helper/definirFecha';

function Orden({
    idOrden = null,
    cliente = new Cliente(),
    contacto = new Contacto(),
    domicilio = { idDomicilio: null, direccion: "", provincia: "" },
    usuario = new Usuario(),
    detalle = [],
    fecha_carga = convertirFechaConZonaHoraria(new Date()),
    fecha_entrega = null,
    subTotal = 0.0,
    total = 0.0,
    estado = "parcial_pendiente",
    pagado = 0.0,
    tipoOrden = "VENTA",
    tipoPago = "EFECTIVO",
}) {
    this.idOrden = idOrden;
    this.cliente = cliente;
    this.contacto = contacto;
    this.domicilio = domicilio;
    this.usuario = usuario;
    this.detalle = detalle; // Se espera un array de instancias de OrdenDetalle
    this.fecha_carga = fecha_carga;
    this.fecha_entrega = fecha_entrega;
    this.subTotal = subTotal;
    this.total = total;
    this.estado = estado;
    this.pagado = pagado;
    this.tipoOrden = tipoOrden;
    this.tipoPago = tipoPago;
}

export default Orden;