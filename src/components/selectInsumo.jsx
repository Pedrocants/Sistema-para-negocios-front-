import { useState, useEffect } from "react";
import { Label, Input, Button, Select } from './ModalStyles';

const SelectInsumo = ({ insumos, addInsumoItem, denomUnidad, denominacionProducto }) => {

    const [bottonEstado, setBottonEstado] = useState(false);
    const [select, setSelected] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const [denominacion, setDenominacion] = useState("");
    const [denUInsumo, setDenUInsumo] = useState("");
    const [texto, setTexto] = useState("");

    const Add = () => {

        setBottonEstado(() => true);
    }
    useEffect(() => {
        if (denomUnidad != "" && denominacion != "" && cantidad > 0) {

            setTexto(() => "cada 1 " + denomUnidad + " de " + denominacionProducto + ", seran " + cantidad + " " + denUInsumo + " de " + denominacion);
            return;
        }
    }, [denomUnidad, denominacion, cantidad, denominacionProducto]);

    function addItem() {
        if (cantidad > 0 && select != null) {

            const item = {
                idInsumo: select,
                denominacion: denominacion,
                cantidad: cantidad,
                texto
            }
            addInsumoItem(item);
            setBottonEstado(() => true);
        }
    }
    function handlerInput(e) {
        const c = parseFloat(e.target.value);
        if (c > 0) {
            setCantidad(c);
        }
    }
    function handlerSelect(e) {
        const valor = Number(e.target.value);
        setSelected(valor);
        const i = insumos.find((insumo) => insumo.idInsumo === valor);
        setDenominacion(i.denominacion);
        setDenUInsumo(i?.unidadMedida?.denominacion);
    }

    return (
        <>
            <div>

                <Label>Insumo:</Label>
                <Select onChange={handlerSelect}>
                    <option>Seleccionar uno...</option>
                    {insumos.map((insumo) => (
                        <option key={insumo.idInsumo} value={insumo.idInsumo}>{insumo.denominacion}</option>
                    ))}
                </Select>
                <Label htmlFor="cantidad">Cantidad:</Label>
                <Input type="number" name="cantidad" placeholder="0" onChange={handlerInput} step="0.01" min="0" max="100000" onWheel={(e) => e.target.blur()} />
                <h3><span>{texto}</span></h3>
                <Button type="button" disabled={bottonEstado} onClick={addItem}> {bottonEstado == false ? "Añadir" : "Listo..."}</Button>
            </div>
        </>
    )
}
export default SelectInsumo;