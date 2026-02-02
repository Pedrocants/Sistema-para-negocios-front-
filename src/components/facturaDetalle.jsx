import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FACTURA_ELEMENT_ID = "factura-pdf";

export const generarPDF = async (orden) => {
    const elemento = document.getElementById(FACTURA_ELEMENT_ID);

    if (!elemento) {
        console.error(`No se encontró el elemento #${FACTURA_ELEMENT_ID}`);
        return;
    }

    try {
        const canvas = await html2canvas(elemento, {
            scale: 2,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`factura_orden_${orden.idOrden}.pdf`);
    } catch (error) {
        console.error("Error al generar el PDF", error);
    }
};

export const FacturaPDF = ({ orden }) => {
    const fechaCarga = new Date(orden.fecha_carga);
    const fechaEntrega = new Date(orden.fecha_entrega);

    const fechasIguales =
        fechaCarga.toDateString() === fechaEntrega.toDateString();

    const manufacturados = orden.detalle.filter(
        d => d.productos?.denominacion
    );

    const insumos = orden.detalle.filter(
        d => d.insumo?.denominacion
    );

    return (
        <div id={FACTURA_ELEMENT_ID} style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={{ margin: 0, color: "#e10600", textAlign: "center" }}>
                    FACTURA
                </h1>
            </div>
            <h3 style={titleStyle}>
                {orden.cliente
                    ? `${orden.cliente.nombre} ${orden.cliente.apellido}`
                    : "Cliente local (caja)"}
            </h3>

            <p><strong>ID Orden:</strong> #{orden.idOrden}</p>
            <p><strong>Tipo Orden:</strong> {orden.tipoOrden}</p>
            <p>
                <strong>Total:</strong>{" "}
                ${orden.total.toLocaleString("es-AR")}
            </p>

            <div style={{ marginBottom: "1rem" }}>
                {fechasIguales ? (
                    <p>
                        <strong>Fecha:</strong>{" "}
                        {fechaCarga.toLocaleDateString()}
                    </p>
                ) : (
                    <>
                        <p>
                            <strong>Carga:</strong>{" "}
                            {fechaCarga.toLocaleDateString()}{" "}
                            {fechaCarga.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p>
                            <strong>Entrega:</strong>{" "}
                            {fechaEntrega.toLocaleDateString()}{" "}
                            {fechaEntrega.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </>
                )}
            </div>

            {manufacturados.length > 0 && (
                <>
                    <h3>Productos Manufacturados</h3>
                    <TablaProductos
                        items={manufacturados}
                        tipo="manufacturado"
                    />
                </>
            )}

            {insumos.length > 0 && (
                <>
                    <h3 style={{ marginTop: "2rem" }}>Otros productos</h3>
                    <TablaProductos
                        items={insumos}
                        tipo="insumo"
                    />
                </>
            )}
        </div>
    );
};

/* =====================================================
   COMPONENTE TABLA REUTILIZABLE
===================================================== */
const TablaProductos = ({ items, tipo }) => (
    <table style={tableStyle}>
        <thead style={theadStyle}>
            <tr>
                <th style={cellStyle}>Producto</th>
                <th style={cellStyle}>Cantidad</th>
                <th style={cellStyle}>Precio</th>
            </tr>
        </thead>
        <tbody>
            {items.map((item, index) => {
                const producto = tipo === "manufacturado"
                    ? item.productos
                    : item.insumo;

                const cantidad = tipo === "manufacturado"
                    ? item.cantidadProducto
                    : item.cantidadInsumo;

                return (
                    <tr key={index} style={index % 2 === 0 ? rowEven : rowOdd}>
                        <td style={cellStyle}>{producto.denominacion}</td>
                        <td style={cellStyle}>{cantidad}</td>
                        <td style={cellStyle}>
                            ${producto.precio.toLocaleString("es-AR")}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
);

const containerStyle = {
    width: "210mm",
    minHeight: "297mm",

    margin: "0 auto",
    padding: "20mm",

    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#111",
    color: "#f5f5f5",

    boxSizing: "border-box",
    lineHeight: "1.5"
};

const headerStyle = {
    borderBottom: "2px solid #e10600",
    paddingBottom: "10px",
    marginBottom: "20px"
};

const titleStyle = {
    color: "red",
    textAlign: "center"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    tableLayout: "fixed"
};

const theadStyle = {
    backgroundColor: "#333",
    color: "#fff"
};

const cellStyle = {
    padding: "8px 10px",
    border: "1px solid #ccc",
    textAlign: "left",
    fontSize: "12px",
    wordWrap: "break-word"
};

const rowEven = { backgroundColor: "black" };
const rowOdd = { backgroundColor: "#ffffff" };