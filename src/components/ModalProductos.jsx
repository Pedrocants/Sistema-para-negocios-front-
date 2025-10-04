import React, { useState, useEffect } from "react";
import { ModalContent, Form, Label, Input, Button, Select } from './ModalStyles';
import Modal from 'react-modal';
import SelectInsumo from './selectInsumo';
import { obtenerDatos } from '../helper/traeDatos';
import { getMarcas, obtenerUnidades, getInsumos, guardarProducto } from '../helper/url';
import ProductoManufacturado from '../prototype/ProductoManufacturado';
import ProductoDetalle from '../prototype/ProductoDetalle';
import Historial from '../prototype/Historial';
import MarcaRadioGroup from './MarcaRadioGroup';

const ModalProductos = ({ isModalOpen, toggleModal, openConfirmationModal, onLabel, token }) => {

    const [selected, setSelectedOption] = useState('No');
    const [insumos, setInsumos] = useState(null);
    const [compInsumo, setCompInsumo] = useState([]);
    const [itemInsumo, setItemInsumo] = useState([]);
    const [unidades, setUnidades] = useState(null);
    const [denominacion, setDenominacion] = useState(null);
    const [descripcion, setDescripcion] = useState(null);
    const [precio, setPrecio] = useState(0);
    const [stockActual, setStockActual] = useState(0);
    const [stockMinimo, setStockMinimo] = useState(0);
    const [unidad, setUnidad] = useState(null);
    const [tiempo_estimado, setTiempoEstimado] = useState();
    const [esParaElaborar, setElaborarOption] = useState(false);
    const [denominacionUnidad, setDenominacionUnidad] = useState("");
    const [marca, setMarca] = useState(null);
    const [optionMarca, setOptionMarca] = useState('Ninguna');
    const [marcas, setMarcas] = useState([]);
    const [idMarca, setIdMarca] = useState(null);


    useEffect(() => {
        const urlInsumos = getInsumos(true);
        const urlUnidades = obtenerUnidades();
        const urlMarca = getMarcas();

        async function cargar() {
            try {
                const dataInsumo = await obtenerDatos(urlInsumos, 'GET', token);
                const dataUnidades = await obtenerDatos(urlUnidades, 'GET', token);
                const dataMarca = await obtenerDatos(urlMarca, 'GET', token);
                setInsumos(dataInsumo);
                setUnidades(dataUnidades);
                setMarcas(dataMarca);
            } catch (e) {
                console.error(e);
            }
        }
        cargar();
    }, [isModalOpen == true])

    const handleSelectChange = (e) => {
        const option = e.target.value;
        setSelectedOption(option);
    }

    const handleSelectChangeElaborar = (e) => {
        const option = e.target.value;
        setElaborarOption(option);
    }
    function addInsumo() {
        if (insumos.length > 0) {

            const nuevoInsumoComp = {
                id: Date.now(),
                insumos
            };
            setCompInsumo(() => [...compInsumo, nuevoInsumoComp]);
        } else {
            alert("no hay insumos para mostrar.");
        }
    }
    function addInsumoItem(item) {
        if (insumos.length > 0) {
            setItemInsumo(() => [...itemInsumo, item]);
        }
    }
    const handlerStock = (e) => {
        const stock = parseFloat(e.target.value);
        if (stock < stockMinimo) {
            alert("stock no puede ser menor a " + stockMinimo);
            e.target.value = "";
            return;
        }
        setStockActual(stock);
    }
    const handlerSelectUnidad = (e) => {
        setUnidad(() => parseInt(e.target.value));
        setDenominacionUnidad(() => e.target.options[e.target.selectedIndex].text);
    }

    function cargarProducto() {
        let esManufacturado = true;
        let dataRespuesta = null;

        if (denominacion == null) {
            alert("debe ingresar un nombre.");
            return;
        }
        if (denominacion.length > 50) {
            alert("denominacion: longitud no permitida.");
            return;
        }
        if (typeof precio == "string") {
            alert("Campo precio debe ser un numero.");
            return;
        }
        if (descripcion != null && descripcion.length > 255) {
            alert("descripcion: cantidad de caracteres no soportada.")
            return;
        }
        if (marca != null && marca.length > 50) {
            alert("marca: longitud no soportada.");
        }
        const producto = {
            denominacion,
            idUnidadMedida: {
                idUnidadMedida: unidad
            },
            insumos: itemInsumo,
            descripcion,
            stockActual,
            stockMinimo,
            tiempo_estimado: (tiempo_estimado != null) ? tiempo_estimado : new Date(),
            precio
        }
        if (selected == 'No') {
            if (itemInsumo.length <= 0) {
                alert("Si es un producto manufacturado, debe tener al menos 1 producto insumo.")
                return;
            }
            let ins = [];
            let historial = [];

            for (let i = 0; i < producto.insumos.length; i++) {

                ins = [...ins, {
                    idInsumo: producto.insumos[i].idInsumo
                }];
                historial = [...historial, new Historial(null, producto.insumos[i].idInsumo, producto.insumos[i].cantidad, producto.insumos[i].texto)];
            }
            const detalle = new ProductoDetalle(null, producto.stockActual, producto.stockMinimo);

            const ProductoMan = new ProductoManufacturado(producto.denominacion, producto.idUnidadMedida, detalle, ins, historial, producto.precio, 0, producto.descripcion, producto.tiempo_estimado, false);
            dataRespuesta = enviar(esManufacturado, ProductoMan);

        } else {
            esManufacturado = false;
            const ProductoInsumo = {
                idInsumo: null,
                unidadMedida: producto.idUnidadMedida,
                detalle: new ProductoDetalle(null, producto.stockActual, producto.stockMinimo),
                precio: producto.precio,
                denominacion: producto.denominacion,
                esParaElaborar: esParaElaborar,
                eliminado: false,
                marca: (optionMarca != 'Ninguna') ? optionMarca != 'Nueva' ? {
                    idMarca: idMarca
                } : {
                    idMarca: null,
                    nombre: marca
                } : null
            }
            dataRespuesta = enviar(esManufacturado, ProductoInsumo);
        }
        if (dataRespuesta != null) {

            limpiarCampos();
            toggleModal();
            openConfirmationModal();
        }
        return;
    }

    async function enviar(esManufacturado, producto) {

        const url = guardarProducto(esManufacturado);

        const data = await obtenerDatos(url, 'POST', token, producto);

        return data;
    }

    const limpiarCampos = () => {
        setDenominacion("");
        setMarca("");
        setStockMinimo("");
        setStockActual("");
        setDescripcion("");
        setTiempoEstimado("");
        setPrecio("");
        setSelectedOption("No");
        setElaborarOption(false);
        setUnidad(null);
        setDenominacionUnidad("");
        setCompInsumo([]);
        setItemInsumo([]);
        setOptionMarca(null)
    };

    return (
        <Modal isOpen={isModalOpen} onRequestClose={toggleModal} contentLabel="Formulario de Nuevo producto" style={{
            overlay: {
                background: "rgba(0, 0, 0, 0.8)",
            },
            content: {
                width: "90%",
                maxWidth: "600px",
                margin: "auto",
                padding: "2rem",
                borderRadius: "16px",
                background: "#121212",
                border: "none",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
            }
        }}>
            <ModalContent>
                <h1>Nuevo producto</h1>
                <hr />
                <Form>

                    <Label htmlFor="denominacion">Denominacion:</Label>
                    <Input type="text" name="denominacion" required onChange={(e) => (setDenominacion(e.target.value))} />
                    {unidades && (
                        <>
                            <Label htmlFor="unidad">Unidad de medida:</Label>
                            <Select name="unidad" onChange={handlerSelectUnidad}>
                                <option>Seleccionar uno...</option>
                                {unidades.map((unidad) => (
                                    <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>{unidad.denominacion}</option>
                                ))}
                            </Select>
                        </>
                    )}
                    <h3>Detalles del producto:</h3>
                    <Label htmlFor="elaborar">¿Es un producto insumo?</Label>
                    <Select name="elaborar" onChange={handleSelectChange}>
                        <option value={'No'}>No</option>
                        <option value={'Si'}>Si</option>
                    </Select>
                    {
                        selected == 'No' ? (
                            <>
                                <h3>Producto manufacturado</h3>
                                <Button type="button" onClick={addInsumo}>Agregar insumo</Button>
                                {compInsumo.map((comp) => (
                                    <SelectInsumo key={comp.id}
                                        insumos={insumos} addInsumoItem={addInsumoItem} denomUnidad={denominacionUnidad} denominacionProducto={denominacion}/>
                                ))}
                            </>
                        ) : (
                            <>
                                <h3>Producto/insumo</h3>
                                <Label>¿es para elaborar?</Label>
                                <Select onChange={handleSelectChangeElaborar}>
                                    <option key={false} value={false} defaultValue={false}>No</option>
                                    <option key={true} value={true}>Si</option>
                                </Select>
                                <Label htmlFor="marca">{"Marca (opcional)"}</Label>
                                <MarcaRadioGroup optionMarca={optionMarca} setOptionMarca={setOptionMarca} />
                                {
                                    optionMarca == 'Nueva' && (
                                        <div>
                                            <Label htmlFor="marca">{'Nombre'}</Label>
                                            <Input type="text" name="marca" required onChange={(e) => (setMarca(e.target.value))} />
                                        </div>
                                    )
                                }
                                {
                                    optionMarca == 'Elegir' && (
                                        <Select onChange={(e) => (setIdMarca(e.target.value))}>
                                            <option>{"Seleccionar una..."}</option>
                                            {
                                                marcas.map((m) => (
                                                    <option key={m.idMarca} value={m.idMarca}>{m.nombre}</option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </>
                        )
                    }
                    <Label htmlFor="stockMin">Stock minimo:</Label>
                    <Input type="number" name="stockMin" onWheel={(e) => e.target.blur()} onChange={(e) => (setStockMinimo(e.target.value))} step="0.01" min="0" max="100000" />
                    <Label htmlFor="stock">Stock actual:</Label>
                    <Input type="number" name="stock" onWheel={(e) => e.target.blur()} onChange={handlerStock} step="0.01" min="0" max="100000" />
                    {
                        selected == 'No' && (
                            <>

                                <Label htmlFor="desc">Descripcion:</Label>
                                <Input type="text" name="desc" onChange={(e) => (setDescripcion(e.target.value))} />

                                <Label htmlFor="time">Tiempo estimado: {"(Opcional)"} </Label>
                                <Input
                                    type="time" name="time"
                                    onChange={(e) => setTiempoEstimado(e.target.value)}
                                />


                            </>
                        )
                    }
                    <Label htmlFor="precio">Precio:</Label>
                    <Input type="number" name="precio" onWheel={(e) => e.target.blur()} onChange={(e) => (setPrecio(parseFloat(e.target.value)))} step="0.01" min="0" max="100000" />
                    <Button type="button" onClick={cargarProducto}>Aceptar</Button>
                    <Button type="button" onClick={toggleModal}>Cancelar</Button>
                </Form>
            </ModalContent>
        </Modal >
    )
}

export default ModalProductos