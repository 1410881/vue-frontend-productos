Frontend - Vue 3 con Vite y Tailwind CSS

Este proyecto es la interfaz de usuario para el catálogo de productos, formulario de creación/edición y dashboard.

Requisitos previos:
Node.js 18 o superior
npm

Instrucciones para ejecutar el proyecto:

1. Asegúrate de que el backend de Laravel esté corriendo en http://127.0.0.1:8000

2. Abre la terminal en la carpeta raíz del proyecto frontend.

3. Instala las dependencias de Node:
   npm install

4. Levanta el servidor de desarrollo:
   npm run dev

El frontend estará disponible en http://localhost:5173

Rutas de la aplicación:
/ (Catálogo de productos)
/agregar (Formulario para crear producto)
/editar/:id (Formulario para editar producto)
/dashboard (Panel de control con métricas)

Notas:
Asegúrate de que el backend tenga configurado CORS para permitir peticiones desde http://localhost:5173
