🔧 Variables de Entorno

La aplicación utiliza las siguientes variables de entorno:

Variable	Descripción
REACT_APP_AUTH0_CLIENT_ID	Client ID provisto por Auth0
REACT_APP_AUTH0_AUDIENCE	Audience configurado en Auth0
REACT_APP_API_URL	URL del backend o API a consumir
REACT_APP_URL	URL pública de tu frontend (por ejemplo: http://localhost:3000
)
📁 Archivo .env

Crea en la raíz del proyecto un archivo llamado .env e incluye

REACT_APP_AUTH0_CLIENT_ID=tu_client_id
REACT_APP_AUTH0_AUDIENCE=tu_audience
REACT_APP_API_URL=http://localhost:8080
REACT_APP_URL=http://localhost:3000

⚠️ No subas el archivo .env al repositorio. Ya está incluido en .gitignore.

🖥️ Instalación y Ejecución en Entorno Local

* Clonar el repositorio
* ejecutar npm run build (previamente instalar dependencias con npm insall)
* servir aplicacion en un server como apache, ubicando todo el compilado en la raiz del mismo, para servir la app en un entorno local, a demas debera crear un archivo .access con la configuracion basica para manejo de SPA.


🐳 Ejecución con Docker y Docker Compose

Este proyecto incluye un Dockerfile y un docker-compose.yml para facilitar la ejecución en contenedores.

▶️ Ejecutar la Aplicación con Docker Compose

Asegúrate de tener el archivo .env en la raíz del proyecto.

Ejecuta:

docker compose up --build

Accede al frontend en:

👉 http://localhost:3000
