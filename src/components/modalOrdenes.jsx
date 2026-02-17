import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { RadioGroup, RadioInput, RadioLabel, RadioOption } from './radioStyles';
import styled from 'styled-components';
import { obtenerDatos } from '../helper/traeDatos';
import { mostrarProductos, getInsumos, getClientes, guardarOrden, getProvincias, traerDatosCliente } from '../helper/url';
import { convertirFechaConZonaHoraria } from '../helper/definirFecha';
import { ProductoDetalle } from './ProductoDetalle';
import Contacto from '../prototype/Contacto';
import Orden from '../prototype/Orden';

const Select = styled.select`
  width: 100%;
  padding: 12px;
  background-color: #444;
  color: #f1f1f1;
  border: 1px solid #666;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #e0a800;
    box-shadow: 0 0 5px #e0a80055;
    outline: none;
  }
`;

const ModalContent = styled.div`
  background: #1c1c1c;
  padding: 30px;
  border-radius: 12px;
  color: #fff;
  max-width: 600px;
  width: 90%;
  margin: 0 auto;
  box-shadow: 0 0 20px #00000066;
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Label = styled.label`
  color: #ccc;
  font-size: 14px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background-color: #2d2d2d;
  color: #fff;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #e0a800;
    box-shadow: 0 0 5px #e0a80055;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #e0a800;
  color: #000;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;

  &:hover {
    background-color: #ffd700;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ModalOrdenes = ({ isModalOpen, toggleModal, openConfirmationModal, onLabel, userId, token }) => {

  const [ordenTipoForm, setOrdenTipoForm] = useState('caja');
  const [sumaTotal, setSumaTotal] = useState(0);
  const [sumaCostos, setSumaCostos] = useState(0);
  const [productos, setProductos] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pagado, setPagado] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [total, setTotal] = useState(0);
  const [ordenDetalle, setOrdenDetalle] = useState([]);
  const [tipoPago, setTipoPago] = useState('EFECTIVO');
  const [optionClient, setOptionClient] = useState('Elegir');
  const [tipoCliente, setTipoCliente] = useState();
  const [idContactoDomicilio, setIdContactoDomicilio] = useState();
  const [provincias, setProvincias] = useState([]);
  const [errors, setErrors] = useState(null);

  const handleSelectChange = (e) => {
    const selectedItemid = parseInt(e.target.value, 10);
    const item = clientes.find((item) => item.idCliente === selectedItemid);
    setSelectedItem(item);
    //console.log(item);

  };
  useEffect(() => {
    const cargarProvincias = async () => {
      try {

        const urlProvincias = getProvincias();
        const dataProv = await obtenerDatos(urlProvincias, 'GET');
        const prov = dataProv.provincias.map((prov) => prov.nombre);
        setProvincias(prov);
      } catch (err) {
        console.error("Puede que esta api no este disponible: " + err);
      }
    }
    if (provincias == []) {
      cargarProvincias();
    }
  }, [provincias]);

  useEffect(() => {
    const cargarProductosYClientes = async () => {
      try {
        const url = mostrarProductos();
        const urlClientes = getClientes();
        const urlInsumos = getInsumos();

        const dataProductos = await obtenerDatos(url, 'GET', token);
        const dataClientes = await obtenerDatos(urlClientes, 'GET', token);
        const dataInsumo = await obtenerDatos(urlInsumos, 'GET', token);

        setProductos(dataProductos);
        setClientes(dataClientes);
        setInsumos(dataInsumo);
      } catch (error) {
        setErrors(error);
      }
    };

    cargarProductosYClientes();
  }, [toggleModal]);

  useEffect(() => {
    if (errors) {
      onLabel(errors);
    }
  }, [errors]);

  useEffect(() => {
    async function traerDatosIdCliente() {

      if (selectedItem) {
        const url = traerDatosCliente(selectedItem.idCliente);
        const data = await obtenerDatos(url, 'GET', token);
        setIdContactoDomicilio(data);
      }
    }
    traerDatosIdCliente();
  }, [selectedItem]);

  const handleAgregarDetalle = () => {
    if (productos?.length > 0 || insumos?.length > 0) {
      const nuevoDetalle = {
        id: Date.now(),
        productos,
        insumos,
        suma: 0,
        sumaCostos: 0
      };
      setDetalles([...detalles, nuevoDetalle]);
    } else {
      console.warn('Productos no disponibles para agregar.');
    }
  };

  const handleQuitarDetalle = () => {
    if (detalles.length > 0) {
      const ultimoDetalle = detalles[detalles.length - 1];
      const ultimaOrdenDetalle = ordenDetalle[detalles.length - 1];
      const descuento = (ultimaOrdenDetalle && ultimaOrdenDetalle.descuentosPorProducto) ? parseFloat(ultimaOrdenDetalle.descuentosPorProducto) : 0;

      const nuevaSuma = parseFloat(ultimoDetalle.suma) - descuento;

      const ultSumCosto = (ultimoDetalle.sumaCostos) ? ultimoDetalle.sumaCostos : 0;

      setSumaCostos((prevSumCosto) => (prevSumCosto - ultSumCosto).toFixed(2));

      setSumaTotal((prevSumaTotal) => (prevSumaTotal - ultimoDetalle.suma).toFixed(2));
      setTotal((prevTotal) => prevTotal - nuevaSuma);
      setDetalles((prevDetalles) => prevDetalles.slice(0, -1));
      if (ordenDetalle.length === detalles.length) {
        setOrdenDetalle((prevOrdenDetalle) => prevOrdenDetalle.slice(0, -1));
      }
    }
  };

  const actualizarSumaDetalle = (id, nuevaSuma, sumaCostos) => {
    setDetalles(
      (prevDetalles) => {
        const nuevosDetalles = prevDetalles.map((detalle) =>
          detalle.id === id ?
            { ...detalle, suma: nuevaSuma, sumaCostos: sumaCostos } :
            detalle
        );
        const nuevaSumaTotal = nuevosDetalles.reduce(
          (total, detalle) => total + detalle.suma,
          0
        );
        const nuevaSumaCostos = nuevosDetalles?.reduce((sumaCostos, detalle) => sumaCostos + detalle.sumaCostos, 0);

        setSumaCostos(nuevaSumaCostos);
        setSumaTotal(nuevaSumaTotal);

        return nuevosDetalles;
      }
    );
  };

  function calcularDescuentos() {

    let descuentosPorProducto = 0;

    if (ordenDetalle.length > 0) {

      for (let i = 0; i < ordenDetalle.length; i++) {

        if (ordenDetalle[i].descuentosPorProducto > 0 && ordenDetalle[i].descuentosPorProducto <= sumaTotal) {
          descuentosPorProducto += parseFloat(ordenDetalle[i].descuentosPorProducto);
        }
      }
      descuentosPorProducto = sumaTotal - descuentosPorProducto;
      setTotal(() => descuentosPorProducto);
    }
  }
  const enviarDatos = (event) => {
    event.preventDefault();

    const esCaja = ordenTipoForm === 'caja';

    if (!esCaja && optionClient == 'Elegir' && !selectedItem) {
      alert('Seleccione un cliente antes de guardar.');
      return;
    }
    if (!sumaTotal) {
      alert('Total de orden no puede ser 0');
      return;
    }
    if (detalles.length === 0) {
      alert('Agregue al menos un detalle.');
      return;
    }
    if (!pagado && !esCaja) {
      alert('Pagado debe contener un valor');
      return;
    }

    const form = event.target;
    const nombre = esCaja ? '' : (form.nombre?.value != null) ? form.nombre.value : '';
    const apellido = esCaja ? '' : (form.apellido?.value != null) ? form.apellido.value : '';
    const direccion = esCaja ? '' : (form.calle?.value != null) ? form.calle.value : '';
    const provincia = esCaja ? '' : (form.provincia?.value != null) ? form.provincia.value : '';
    const telefono = esCaja ? '' : (form.telefono?.value != null) ? form.telefono.value : '';
    const email = esCaja ? '' : (form.email?.value != null) ? form.email.value : '';

    if (!esCaja) {
      switch (optionClient) {
        case 'nuevo':
          if (email == '' || direccion == '' || telefono == '' || provincia == '' || nombre == '' || apellido == '' || tipoCliente == null && optionClient != 'Elegir') {
            alert("Nuevo cliente no puede tener campos vacios.");
            //console.log(optionClient);
            return;
          }
          break;
        default:
          break;
      }
    }

    const fecha_entrega = esCaja
      ? convertirFechaConZonaHoraria(new Date())
      : form.fecha.value || convertirFechaConZonaHoraria(new Date());

    const contacto = new Contacto({
      idContacto: null,
      telefono,
      email
    });

    const orden = new Orden({
      cliente: esCaja ? null : (optionClient == 'nuevo') ? {
        idCliiente: null,
        nombre,
        apellido,
        tipoCliente,
        eliminado: false
      } : selectedItem,
      contacto: esCaja ? null : (optionClient == 'Elegir') ? {
        idContacto: idContactoDomicilio.idContacto
      } : contacto,
      domicilio: (esCaja) ? null : (optionClient == 'Elegir') ? {
        idDomicilio: idContactoDomicilio.idDomicilio
      } : { direccion, provincia },
      usuario: { idUsuario: userId },
      detalle: ordenDetalle,
      fecha_entrega,
      subTotal: sumaTotal,
      total: (tipo != 'COMPRA') ? total : sumaCostos,
      pagado: pagado || (esCaja ? (tipo != 'COMPRA') ? total : sumaCostos : 0),
      tipoOrden: tipo,
      tipoPago: tipoPago
    });
    async function cargarOrden(orden) {
      try {
        const url = guardarOrden();
        const data = await obtenerDatos(url, 'POST', token, orden);
      } catch (error) {
        setErrors(error?.message);
      } finally {

        if (!esCaja && optionClient != 'Elegir') {
          form.nombre.value = "";
          form.apellido.value = "";
          form.provincia.value = "";
          form.telefono.value = "";
          form.calle.value = "";
          form.email.value = "";
          form.fecha.value = "";
        }
        setTipoCliente(null);
        setOrdenTipoForm('caja');
        setSumaTotal(0);
        setPagado(0);
        setTotal(0);
        setTipo(null);
        setSumaCostos(0);
        setDetalles([]);
        setOrdenDetalle([]);
        toggleModal();
        openConfirmationModal();
        onLabel(null);
      }
    }
    cargarOrden(orden);
    setErrors(null);
  };

  return (
    <Modal isOpen={isModalOpen} onRequestClose={toggleModal} contentLabel="Formulario de Nueva Orden" style={{
      overlay: {
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        transition: "opacity 0.3s ease",
      },
      content: {
        width: "90%",
        maxWidth: "600px",
        margin: "auto",
        padding: "0",
        borderRadius: "12px",
        background: "transparent",
        border: "none",
        inset: "unset",
      },
    }}>
      <ModalContent>
        <h2 style={{ textAlign: 'center' }}>Nueva Orden</h2>
        <Form onSubmit={enviarDatos}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label>
              <input
                type="radio"
                name="tipoFormulario"
                value="caja"
                checked={ordenTipoForm === 'caja'}
                onChange={() => setOrdenTipoForm('caja')}
              />
              Orden de caja
            </label>
            <label>
              <input
                type="radio"
                name="tipoFormulario"
                value="completa"
                checked={ordenTipoForm === 'completa'}
                onChange={() => setOrdenTipoForm('completa')}
              />
              Orden completa
            </label>
          </div>

          {ordenTipoForm === 'completa' && (
            <>

              <RadioGroup>

                <RadioOption>
                  <RadioInput
                    type="radio"
                    id="nuevo"
                    name="nuevo"
                    value="nuevo"
                    checked={optionClient === 'nuevo'}
                    onChange={(e) => setOptionClient(e.target.value)}
                  />
                  <RadioLabel htmlFor="nuevo">Nuevo cliente</RadioLabel>
                </RadioOption>

                <RadioOption>
                  <RadioInput
                    type="radio"
                    id="elegir"
                    name="cliente"
                    value="Elegir"
                    checked={optionClient === 'Elegir'}
                    onChange={(e) => setOptionClient(e.target.value)}
                  />
                  <RadioLabel htmlFor="elegir">Elegir un cliente</RadioLabel>
                </RadioOption>
              </RadioGroup>
              {optionClient == 'Elegir' ? (

                <>
                  <Label htmlFor='selectCliente'>Cliente</Label>

                  <Select name='selectCliente' id='selectCliente' onChange={handleSelectChange}>
                    <option>Seleccione uno...</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.idCliente} value={cliente.idCliente}>
                        {cliente.nombre} {cliente.apellido || ''}
                      </option>
                    ))}
                  </Select>
                </>
              ) : (
                <>

                  <div>
                    <Label htmlFor='nombre'>Nombre:</Label>
                    <Input type="text" name="nombre" id='selectCliente' maxLength="25" />
                    <Label htmlFor='apellido'>Apellido:</Label>
                    <Input type="text" name="apellido" id='apellido' maxLength="25" />

                    <Label htmlFor='tipoCliente'>Tipo de cliente:</Label>
                    <Select name='tipoCliente' id='tipoCliente' onChange={(e) => setTipoCliente(e.target.value)}>
                      <option>Seleccionar uno...</option>
                      <option value="Mayorista">Mayorista</option>
                      <option value="Minorista">Minorista</option>
                      <option value="Industrial">Induustrial</option>
                      <option value="Institucional">Institucional</option>
                      <option value="Otro">Otro</option>
                    </Select>

                    <Label htmlFor='calle'>Domicilio:</Label>
                    <Input type="text" name="calle" id="calle" maxLength="125" />
                    <Label htmlFor='provincia'>Provincia:</Label>
                    {
                      provincias.length > 0 ? (
                        <div>
                          <Select onChange={(e) => e.target.value} name="provincia" id="provincia">
                            <option>Seleccionar uno..</option>
                            {provincias.map((p, i) => (
                              <option key={i} value={p}>{p}</option>
                            ))}
                          </Select>
                        </div>
                      ) : (
                        <div>
                          <Input type="text" name="provincia" id="provincia" maxLength="25" />

                        </div>

                      )
                    }
                  </div>

                  <div>
                    <h3><span>Contacto</span></h3>
                    <Label htmlFor='telefono'>Teléfono:</Label>
                    <Input type="tel" name="telefono" maxLength="10" />
                    <Label htmlFor='email'>Email:</Label>
                    <Input type="email" name="email" />
                  </div>
                </>
              )}

              <Label htmlFor='fecha'>Fecha de Entrega:</Label>
              <Input type="datetime-local" name="fecha" min="2000-01-01T00:00"
                max="9999-12-31T23:59" />
            </>
          )}

          {
            detalles.map((detalle) => (
              <ProductoDetalle
                key={detalle.id}
                cont={detalles.length}
                contOrdenesDetalle={ordenDetalle.length}
                productos={detalle.productos}
                insumos={detalle.insumos}
                onActualizarSumaTotal={(nuevaSuma, nuevaSumaCostos) => actualizarSumaDetalle(detalle.id, nuevaSuma, nuevaSumaCostos)}
                setOrdenDetalle={setOrdenDetalle}
                calcularDescuentos={calcularDescuentos}
                token={token}
              />
            ))
          }
          <Button type="button" onClick={handleAgregarDetalle}>
            Agregar detalle
          </Button>
          {
            (detalles.length > 0) && (
              <Button type="button" onClick={handleQuitarDetalle} disabled={detalles.length === 0}>
                Quitar Último Detalle
              </Button>

            )
          }
          <Label htmlFor='tipoOrden'>Tipo: </Label>
          <Select name='tipoOrden' id='tipoOrden' onChange={(event) => (setTipo(event.target.value))}>
            <option value={null}>Seleccione uno...</option>
            <option value={'PAGO'}>PAGO</option>
            <option value={'COMPRA'}>COMPRA</option>
            <option value={'VENTA'}>VENTA</option>
            <option value={'AGREGACION_DE_STOCK'}>AGREGACIÓN DE STOCK</option>
            <option value={'DEVOLUCION_O_ELIMINACION_DE_STOCK'}>DEVOLUCION O ELIMINACION DE STOCK</option>
          </Select>

          {
            tipo != 'AGREGACION_DE_STOCK' && tipo != 'DEVOLUCION_O_ELIMINACION_DE_STOCK' && (
              <>

                <Label htmlFor='pagado'>Pagado:</Label>
                <Input
                  type="number"
                  name="pagado"
                  step="0.00"
                  placeholder="9.99"
                  onChange={(event) => setPagado(parseFloat(event.target.value))}
                  onWheel={(e) => e.target.blur()}
                />
                <Label htmlFor='tipoPago'>tipo de pago:</Label>
                <Select name='tipoPago' onChange={(event) => (setTipoPago(event.target.value))}>
                  <option value={'EFECTIVO'}>Efectivo</option>
                  <option value={'TRANSFERENCIA'}>Transferencia</option>
                  <option value={'VILLETERAS_VIRTUALES'}>VILLETERAS VIRTUALES (QR, LINK, ETC.)</option>
                  <option value={'OTROS'}>OTROS (cheques, pagaré, cuenta corriente, etc.)</option>
                </Select>

                <h5>subTotal: <span>${sumaTotal.toLocaleString('es-AR')}</span></h5>
                {
                  tipo == 'COMPRA' ? (
                    <>
                      <h3>Total Orden {'(COMPRA)'}: <span>${sumaCostos.toLocaleString('es-AR')}</span></h3>
                    </>
                  ) : (

                    <h3>Total Orden {'(VENTA)'}: <span>${total.toLocaleString('es-AR')}</span></h3>
                  )
                }
              </>
            )
          }

          <Button type="submit">Enviar</Button>
          <Button type="button" onClick={toggleModal}>Cancelar</Button>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default ModalOrdenes;