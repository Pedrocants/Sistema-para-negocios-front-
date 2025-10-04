export async function obtenerDatos(url, metodo, token, body = null) {
    const response = await fetch(url, {
        method: metodo,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(body && { 'Content-Type': 'application/json' }),
        },
        body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        const blob = await response.blob();
        return blob;
    }

    if (metodo === 'DELETE' || response.status == 204) {
        return 'Elemento sin contenido';
    }

    const data = await response.json();
    return data;
}