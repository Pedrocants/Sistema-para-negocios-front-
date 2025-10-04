import { useEffect, useState } from 'react';
import { obtenerDatos } from '../helper/traeDatos';
import { insumoFindById, manufacturadoFiindById } from '../helper/url';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Label } from './ModalStyles';
import { obtenerHistorial, actualizarProducto } from '../helper/url';

const ButtonHiellow = styled.button`
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

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #222;
  color: #fff;
  border-radius: 10px;

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    padding: 10px;
    border-radius: 6px;
    border: none;
    background-color: #333;
    color: #fff;
    font-size: 1rem;

    &:focus {
      outline: 2px solid #555;
    }
  }
`;

const IngredientesWrapper = styled.div`
  min-height: 0;
  width: 100%;
  padding: 1rem;
  background: #0b0f13;
  color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const IngredientesHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 0.05em;

    @media (min-width: 640px) {
      font-size: 1.25rem;
    }
  }
`;

const IngredientesTable = styled.table`
  width: 100%;
  table-layout: fixed;
  text-align: left;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid rgba(23, 49, 58, 0.4);
  margin-bottom: 1rem;

  thead {
    background: #071017;
    border-bottom: 1px solid #17313a;

    th {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #00ffff;
    }
  }

  tbody {
    background: #071217;
  }
`;

export const IngredientesRow = styled.tr`
  border-bottom: 1px solid #17313a;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #092127;
  }

  td {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;

    &:first-child {
      font-weight: 500;
    }

    &:last-child {
      opacity: 0.95;
    }
  }
`;

export const IngredientesCardGrid = styled.div`
  display: grid;
  gap: 0.75rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const IngredientesCard = styled.article`
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #17313a;
  background: linear-gradient(to bottom, #061019, #071217);
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);

  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
  }

  p {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.9;

    span {
      font-weight: 500;
    }
  }
`;

const ProductoDetalleInfo = ({ token, manufacturado = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [denominacion, setDenom] = useState('');
    const [precio, setPrecio] = useState(0);
    const [botonEstado, setBotonEstado] = useState(false);
    const [historial, setHistorial] = useState();

    useEffect(() => {
        async function cargar() {
            if (id != null && token) {
                const url = (!manufacturado) ? insumoFindById(id) : manufacturadoFiindById(id);
                const data = await obtenerDatos(url, 'GET', token);
                setProducto(data);
            }
        }
        cargar();
    }, [id, token]);
    useEffect(() => {
        if (!producto) {
            return;
        }
        if (precio != producto.precio && precio != 0 || denominacion != producto.denominacion && denominacion != '') {
            setBotonEstado(true);
            return;
        }
        if (manufacturado && historial == null) {
            historialProducto();
        }
        setPrecio(producto.precio);
        setDenom(producto.denominacion);
        setBotonEstado(false);
    }, [producto]);

    const actualizar = async () => {
        if (manufacturado) {
            historial.map((h) => {
                h.nombreProducto = producto.denominacion;
            });
            producto.historial = historial;
        }
        const url = actualizarProducto(manufacturado);
        const datos = obtenerDatos(url, 'PUT', token, producto);
        setHistorial([]);
        setDenom('');
        setPrecio(0);
        setProducto(null);
        setBotonEstado(false);
        navigate('/');
        return;
    }
    async function historialProducto() {
        const urlHistorial = obtenerHistorial(producto.idProductoManufacturado);
        const dataHistorial = await obtenerDatos(urlHistorial, 'GET', token);
        setHistorial(dataHistorial);
    }

    if (!producto || producto.eliminado == true) {
        return <h2>Cargando...</h2>;
    }

    return (
        <Container>
            <Title>
                Detalle de producto #{!manufacturado ? producto.idInsumo : producto.idProductoManufacturado}
            </Title>

            <FieldGroup>
                <label>Denominación</label>
                <input
                    type="text"
                    value={producto.denominacion || ''}
                    onChange={(e) =>
                        setProducto({ ...producto, denominacion: e.target.value })
                    }
                />
            </FieldGroup>

            <FieldGroup>
                <label>Precio</label>
                <input
                    type="number"
                    value={producto.precio || ''}
                    onChange={(e) =>
                        setProducto({ ...producto, precio: e.target.value })
                    }
                    step="0.01"
                    onWheel={(e) => e.target.blur()}
                />
            </FieldGroup>

            {!manufacturado ? (
                <>
                    <FieldGroup>
                        <label>Es para elaborar</label>
                        <input
                            type="checkbox"
                            checked={producto.esParaElaborar || false}
                            disabled
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <label>Marca</label>
                        <h3>{producto.marca?.nombre || 'Sin marca'}</h3>
                    </FieldGroup>
                </>
            ) : (
                <>
                    {producto.tiempo_estimado != null && (
                        <FieldGroup>
                            <Label>Tiempo estimado:</Label>
                            <h3>{producto.tiempo_estimado}</h3>
                        </FieldGroup>
                    )}

                    {producto.descripcion && (
                        <>
                            <label>Descripción:</label>
                            <h3><strong>{producto.descripcion}</strong></h3>
                        </>
                    )}

                    {Array.isArray(producto.insumos) && producto.insumos.length > 0 && (
                        <IngredientesWrapper>
                            <IngredientesHeader>
                                <h2>Ingredientes:</h2>
                            </IngredientesHeader>

                            {/* Tabla Desktop */}
                            <IngredientesTable>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Marca</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {producto.insumos.map((it, idx) => (
                                        <IngredientesRow key={it.id ?? idx}>
                                            <td>{it.denominacion}</td>
                                            <td>{(it.marca != null) ? it.marca?.nombre : 'Sin marca'}</td>
                                        </IngredientesRow>
                                    ))}
                                </tbody>
                            </IngredientesTable>
                            <IngredientesCardGrid>
                                {producto.insumos.map((it, idx) => (
                                    <IngredientesCard key={it.idInsumo ?? idx}>
                                        <div>
                                            <h3>{it.denominacion}</h3>
                                        </div>
                                        <p>Marca: <span>{(it.marca != null) ? it.marca?.nombre : 'Sin marca'}</span></p>
                                        <p>Stock actual: <span>{it.detalle?.stockActual}</span></p>
                                        <p>Unidad medida: <span>{it.unidadMedida?.denominacion}</span></p>
                                    </IngredientesCard>
                                ))}
                            </IngredientesCardGrid>
                        </IngredientesWrapper>
                    )}
                </>
            )}

            <FieldGroup>
                <label>Detalle (stock actual / mínimo)</label>
                <input
                    type="text"
                    disabled={true}
                    value={
                        producto.detalle
                            ? `${producto.detalle.stockActual} / ${producto.detalle.stockMinimo}`
                            : ''
                    }
                    readOnly
                />
            </FieldGroup>

            {botonEstado && <ButtonHiellow onClick={actualizar}>Actualizar</ButtonHiellow>}
        </Container>
    );
};
export default ProductoDetalleInfo;