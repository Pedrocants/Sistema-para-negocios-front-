import { useState, useEffect } from "react";
import Select from 'react-select';
import styled from 'styled-components';
import { RadioGroup, RadioInput, RadioLabel, RadioOption } from './radioStyles';

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #ccc;
  }
`;
const Button = styled.button`
  background-color: #e0a800;
  color: #000;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #ffd700;
  }
`;


const StyledSelect = styled(Select)`
  width: 87%;
  margin: 10px;
  
  .react-select__control {
    background-color: #555;
    border: none;
    border-radius: 4px;
    padding: 4px;
    font-size: 16px;
    color: #fff;
    box-shadow: none;
  }

  .react-select__single-value {
    color: #fff;
  }

  .react-select__placeholder {
    color: #ccc;
  }

  .react-select__input-container {
    color: #fff;
  }

  .react-select__menu {
    background-color: #444;
    color: #fff;
  }

  .react-select__option {
    background-color: #444;
    color: #fff;
    cursor: pointer;
  }

  .react-select__option--is-focused {
    background-color: #666;
  }
`;

const CajaProducto = styled.div`
  display: inline-block;
  float: left;
  padding: 10px;
  border: #333;
  border-radius: 3px;
`;

const Number = styled.input`
  width: 80%;
  padding: 10px;
  background-color: #555; /* Fondo gris para los campos */
  color: #fff; /* Letras blancas */
  border: none;
  border-radius: 4px;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #ccc;
  }
    `;
const Label = styled.label`
    width: 100%;
    margin-right: 15px;
    color: #bbb;
    font-size: 14px;
  `;
export const ProductoDetalle = ({ cont, contOrdenesDetalle, productos, insumos, onActualizarSumaTotal, setOrdenDetalle, calcularDescuentos, token }) => {

  const [estadoDeBoton, setEstado] = useState(true);
  const [selectedItemProducto, setSelectedItemProductos] = useState(null);
  const [masDetalle, setMasDetalle] = useState(false);

  const [selectedItemInsumo, setSelectedItemInsumo] = useState(null);
  const [sumaTotalProductos, setSumaTotalProductos] = useState(0);
  const [sumaTotalInsumos, setSumaTotalInsumos] = useState(0);
  const [labelCantidad, setLabelCantidad] = useState({
    labelProducto: false,
    labelInsumo: false
  });
  const [sumaTotal, setSuma] = useState(0);
  const [cantidadProducto, setCantidadProducto] = useState(0);
  const [cantidadInsumo, setCantidadInsumo] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [descuentos, setDescuentos] = useState(0);
  const [radioProductos, setRadio] = useState('p');
  const [numero, setNumero] = useState(0);

  const productosOptions = productos?.map((item) => ({
    value: item.idProductoManufacturado,
    label: item.denominacion + "  $" + item.precio.toLocaleString('es-AR')
  }))

  const insumosOptions = insumos?.map((item) => ({
    value: item.idInsumo,
    label: item.denominacion + "  $" + item.precio.toLocaleString('es-AR')
  }));

  const agregarDetalles = (ordenDetalle) => {
    if (cont != contOrdenesDetalle) {

      setOrdenDetalle(
        (prevOrdenDetalle) => (
          !prevOrdenDetalle.some((item) => JSON.stringify(item) == JSON.stringify(ordenDetalle)))
          ? [...prevOrdenDetalle, ordenDetalle] : prevOrdenDetalle);
    } else {
      setOrdenDetalle(
        (prevOrdenDetalle) => {
          const copia = [...prevOrdenDetalle];
          if (copia.length > 0) {
            copia[cont - 1] = ordenDetalle;
            //console.log(cont - 1);
          }
          return copia;
        });
    }
  }

  useEffect(() => {

    calcularDescuentos();

  }, [estadoDeBoton])

  const handleSelectChange = (selectedOption) => {
    const selectedItemId = parseInt(selectedOption, 10);
    const item = productos.find(
      (item) => item.idProductoManufacturado === selectedItemId
    );
    setSelectedItemProductos(item);
  };

  const handleSelectChangeInsumo = (selectedOption) => {
    const selectedItemId = parseInt(selectedOption, 10);
    const item = insumos.find((item) => item.idInsumo === selectedItemId);
    setSelectedItemInsumo(item);
  };

  const handleInput = (e) => {
    const cantidad = e.target.value;
    if (cantidad > selectedItemProducto.detalle?.stockActual) {
      setLabelCantidad(prev => ({
        ...prev,
        labelProducto: true
      }));
    } else {
      setLabelCantidad(prev => ({
        ...prev,
        labelProducto: false
      }));
    }
    let precio = selectedItemProducto.precio;
    let suma = (precio * cantidad);
    setSumaTotalProductos(parseFloat(suma.toFixed(2)));
    const agregarCantidadProducto = (cantidad) => {
      setCantidadProducto(cantidad)
    };
    agregarCantidadProducto(cantidad);
  };
  const handleInputInsumo = (e) => {
    const cantidad = e.target.value;
    if (cantidad > selectedItemInsumo.detalle.stockActual) {
      setLabelCantidad(prev => ({
        ...prev,
        labelInsumo: true
      }));
    } else {
      setLabelCantidad(prev => ({
        ...prev,
        labelInsumo: false
      }));
    }
    let precio = selectedItemInsumo.precio;
    let suma = (precio * cantidad);
    setSumaTotalInsumos(suma);
    const agregarCantidadInsumo = (cantidad) => {
      setCantidadInsumo(cantidad)
    }
    agregarCantidadInsumo(cantidad);
  };

  const agregarObservaciones = (observaciones) => {
    setObservaciones(() => observaciones.target.value);
  };
  const agregarDescuentos = (descuentos) => {
    setDescuentos(() => descuentos.target.value);
  }
  function sumarTodo() {
    let nuevaSuma;
    switch (radioProductos) {
      case 'p':
        nuevaSuma = sumaTotalProductos;
        break;
      case 'i':
        nuevaSuma = sumaTotalInsumos;
        break;
      case 'p&i':
        nuevaSuma = sumaTotalProductos + sumaTotalInsumos;
        break;

    }
    setSuma(nuevaSuma);
    onActualizarSumaTotal(nuevaSuma);

    const ordenDetalle = {
      'productos': (selectedItemProducto) ? { idProductoManufacturado: selectedItemProducto.idProductoManufacturado } : null,
      'insumo': (selectedItemInsumo) ? { idInsumo: selectedItemInsumo.idInsumo } : null,
      'descuentosPorProducto': descuentos,
      'observaciones': observaciones,
      'cantidadProducto': (selectedItemProducto && cantidadProducto) ? cantidadProducto : 0,
      'cantidadInsumo': (selectedItemInsumo && cantidadInsumo) ? cantidadInsumo : 0
    };
    agregarDetalles(ordenDetalle);
    setEstado(() => false);
    setNumero(cont);
  }
  return estadoDeBoton ? (
    <CajaProducto>
      <h2><span>Detalle</span></h2>
      {
        (insumosOptions.length > 0 || productosOptions.length > 0) && (
          <>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="p"
                  id="p"
                  checked={radioProductos == 'p'}
                  onChange={() => setRadio('p')} />
                <RadioLabel htmlFor="p">Productos manufacturados</RadioLabel>
              </RadioOption>

              <RadioOption>
                <RadioInput
                  type="radio"
                  name="i"
                  id="i"
                  checked={radioProductos == 'i'}
                  onChange={() => setRadio('i')} />
                <RadioLabel htmlFor="i">Otros productos</RadioLabel>
              </RadioOption>

              <RadioOption>
                <RadioInput
                  type="radio"
                  name="p&i"
                  id="p&i"
                  checked={radioProductos == 'p&i'}
                  onChange={() => setRadio('p&i')} />
                <RadioLabel htmlFor="p&i">Todos</RadioLabel>
              </RadioOption>

            </RadioGroup>

            {
              (radioProductos == 'p' || radioProductos == 'p&i') && (
                <>
                  <Label htmlFor="productos">Productos:</Label>
                  <StyledSelect
                    classNamePrefix="react-select"
                    name="productos"
                    options={productosOptions}
                    placeholder="Seleccionar uno..."
                    isSearchable
                    onChange={(selectedOption) => handleSelectChange(selectedOption?.value)}
                  />
                  <div>
                    <Label>Cantidad de producto manufacturado:</Label>
                    <Number type='number' step="0.01" onWheel={(e) => e.target.blur()} onChange={handleInput} name="cantidad" placeholder="0.00" />
                    {
                      (labelCantidad.labelProducto == true) && (
                        <h5 style={{
                          color: "red"
                        }}><strong>stock actual: {selectedItemProducto.detalle.stockActual}</strong></h5>
                      )
                    }
                  </div>

                </>
              )}
            {
              (radioProductos == 'i' || radioProductos == 'p&i') && (
                <>
                  <Label htmlFor="insumos">Otros productos:</Label>
                  <StyledSelect
                    name="insumos"
                    classNamePrefix="react-select"
                    options={insumosOptions}
                    placeholder="Seleccionar uno..."
                    isSearchable
                    onChange={(selectedOption) => handleSelectChangeInsumo(selectedOption?.value)}
                  />

                  <div>
                    <Label htmlFor="campoInsumo">{'Cantidad de otros productos (no manufacturados)'}</Label>
                    <Number type='number' step="0.01" onWheel={(e) => e.target.blur()} name="campoInsumo" className="campoInsumo" onChange={handleInputInsumo} />
                    {
                      (labelCantidad.labelInsumo == true) && (
                        <h5 style={{
                          color: "red"
                        }}><strong>stock actual: {selectedItemInsumo.detalle.stockActual}</strong></h5>
                      )
                    }
                  </div>

                </>
              )
            }

          </>
        )
      }

      <RadioGroup>
        <RadioOption>
          <RadioInput
            type="radio"
            name="masDetalle"
            id="masDetalle"
            checked={masDetalle == true}
            onChange={() => setMasDetalle(true)} />
          <RadioLabel htmlFor="masDetalle">Mas detalles</RadioLabel>
        </RadioOption>

        <RadioOption>
          <RadioInput
            type="radio"
            name="menosDetalle"
            id="menosDetalle"
            checked={masDetalle == false}
            onChange={(e) => setMasDetalle(false)} />
          <RadioLabel htmlFor="menosDetalle">Menos detalles</RadioLabel>
        </RadioOption>
      </RadioGroup>
      {
        masDetalle == true && (
          <>
            <Label>Descuentos por producto:</Label>
            <Number type='number' onChange={agregarDescuentos} />
            <Label>Observaciones: </Label>
            <Input type='text' onChange={agregarObservaciones} />

          </>
        )
      }
      <Button type="button" onClick={sumarTodo} disabled={!estadoDeBoton}> {estadoDeBoton ? 'Calcular' : 'Listo...'}</Button>
      <hr />
    </CajaProducto >
  ) : (
    <>
      <h3>Detalle {numero}: ${sumaTotal.toLocaleString("es-AR")}</h3>
    </>
  )
};