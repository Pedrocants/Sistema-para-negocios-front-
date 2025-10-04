import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { ModalContent, Form, Input, Label, Button, Select } from './ModalStyles';
import { obtenerDatos } from '../helper/traeDatos';
import { excelPorFecha, reportes_ventasProducto } from '../helper/url';
import { convertirFechaConZonaHoraria } from '../helper/definirFecha';

function ModalReportes({ isModalOpen, toggleModal, token }) {
    const [tipo, setTipo] = useState();
    const [fecha, setFecha] = useState(null);
    const [fecha_hasta, setFechaHasta] = useState(null);

    const handlerTipo = (e) => {
        setTipo(e.target.value);
    };
    const handlerAceptar = () => {
        const enviado = cargarEnviarDatos(true);
        if (enviado) {
            setFecha(null)
            setFechaHasta(null)
            setTipo(null);
            toggleModal();
        }
    };

    const cargarEnviarDatos = async (enviar = false) => {
        if (enviar) {
            let urlExcel;
            switch (tipo) {
                case 'orden':
                    urlExcel = excelPorFecha(fecha);
                    break;
                case 'producto':
                    if (fecha != null) {

                        urlExcel = reportes_ventasProducto(fecha, (!fecha_hasta) ? convertirFechaConZonaHoraria(new Date()) : fecha_hasta);
                        console.log(urlExcel);
                        break;
                    } else {
                        return;
                    }
            }
            const data = await obtenerDatos(urlExcel, 'GET', token);

            if (data instanceof Blob) {
                const urlBlob = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href = urlBlob;
                a.download = 'archivo.xlsx'; // podés cambiar el nombre si querés
                document.body.appendChild(a); // necesario para Firefox
                a.click();
                a.remove();
                window.URL.revokeObjectURL(urlBlob);
            }
            return true;
        }
    }
    useEffect(() => {
        if (tipo != null) {
            cargarEnviarDatos();
        }
    }, [tipo]);

    return (
        <Modal isOpen={isModalOpen} onRequestClose={toggleModal} contentLabel="Formulario de generacion de reportes" style={{
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
                <h1>Generar nuevo reporte</h1>

                <Form>
                    <Label htmlFor="tipo">Tipo de reporte:</Label>
                    <Select name="tipo" onChange={handlerTipo}>
                        <option>Seleccionar uno...</option>
                        <option value='orden'>Reporte de ventas</option>
                        <option value='producto'>Reporte de ventas de productos</option>
                    </Select>
                    {tipo == 'orden' && (
                        <>
                            <Label htmlFor='fecha'>Fecha:</Label>
                            <Input type="datetime-local" name="fecha" onChange={(e) => setFecha(e.target.value)} />
                        </>
                    )}
                    {tipo == 'producto' && (
                        <>
                            <Label htmlFor='fecha'>Fecha desde:</Label>
                            <Input type="datetime-local" name="fecha" onChange={(e) => setFecha(e.target.value)} />
                            <Label htmlFor='fecha-hasta'>Fecha hasta* opcional:</Label>
                            <Input type="datetime-local" name="fecha-hasta" onChange={(e) => setFechaHasta(e.target.value)} />
                        </>
                    )}
                    <Button type="button" onClick={handlerAceptar}>Aceptar</Button>
                    <Button type="button" onClick={toggleModal}>Cancelar</Button>
                </Form>
            </ModalContent>
        </Modal>
    )
}
export default ModalReportes;