export default function Contacto({
    idContacto = null,
    telefono = "",
    email = "",
} = {}) {
    this.idContacto = idContacto;
    this.telefono = telefono;
    this.email = email;
}