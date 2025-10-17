# Uso de URL con PROXY

El uso de la segunda URL que se me entregó funciona correctamente al agregar el PROXY en el archivo vite.config.js. Es necesario agregar un PROXY porque el servidor backend no permite solicitudes directas desde localhost a menos que el backend lo explicitamente. El proxy funciona como intermediario entre el frontend y el backend, evitando las solicitudes de origen cruzado (CORS), y permitiendo que el frontend se comunique con el backend sin problemas.

## Requisitos 

Instalar:

- **Node.js** versión 18 o superior 

- npm install axios tailwindcss

Corre proyecto con:

- npm run dev


