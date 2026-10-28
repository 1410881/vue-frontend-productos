=========================================================
  FRONTEND - CATÁLOGO DE PRODUCTOS Y DASHBOARD
  Desarrollado en Vue 3 + Vite + Tailwind CSS
=========================================================

1. REQUISITOS PREVIOS
---------------------------------------------------------
- Node.js >= 18
- npm o yarn
- Backend de Laravel corriendo en http://127.0.0.1:8000

2. INSTALACIÓN
---------------------------------------------------------
1. Clonar el repositorio.
2. Abrir la terminal en la raíz del proyecto y ejecutar:
   npm install
3. Levantar el servidor de desarrollo:
   npm run dev
   El frontend estará disponible en: http://localhost:5173

3. ESTRUCTURA DEL PROYECTO
---------------------------------------------------------
src/
 ├── components/
 │    ├── CategoriaModal.vue      (Modal para CRUD de categorías)
 │    ├── Dashboard.vue           (Panel de control con métricas)
 │    ├── Formulario_productos.vue(Crear/Editar productos)
 │    ├── Listas_productos.vue    (Catálogo principal con filtros)
 │    └── ...
 ├── router/
 │    └── index.js                (Definición de rutas)
 ├── services/                    (Opcional: lógica de Axios)
 ├── utils/                       (Opcional: helpers)
 ├── App.vue                      (Componente raíz con <router-view>)
 └── main.js                      (Punto de entrada)

4. RUTAS DE LA APLICACIÓN
---------------------------------------------------------
- /                 -> Catálogo de productos (Listas_productos.vue)
- /agregar          -> Formulario para crear un nuevo producto
- /editar/:id       -> Formulario para editar un producto existente
- /dashboard        -> Panel de control con métricas y tabla de inventario

5. FUNCIONALIDADES PRINCIPALES
---------------------------------------------------------
- Listado dinámico de productos desde la API de Laravel.
- Filtro de productos por categoría en el encabezado.
- Creación de productos con validación en el backend.
- Edición y eliminación de productos.
- Gestión de categorías (CRUD) mediante un modal dentro del formulario.
- Dashboard con métricas calculadas en tiempo real:
    * Total de productos.
    * Valor total del inventario (precio * stock).
    * Productos con bajo stock (menos de 5 unidades).
- Iconos dinámicos según la categoría usando @heroicons/vue.
- Diseño responsive con Tailwind CSS (1, 2 y 3 columnas).

6. DEPENDENCIAS PRINCIPALES
---------------------------------------------------------
- vue ^3.x
- vue-router ^4.x
- axios ^1.x
- @heroicons/vue ^2.x
- tailwindcss ^4.x
- vite ^5.x

7. CONFIGURACIÓN DE LA API
---------------------------------------------------------
La URL base del backend está definida directamente en los componentes
como: http://127.0.0.1:8000/api

Si necesitas cambiarla, puedes buscar y reemplazar en los archivos:
- Listas_productos.vue
- Formulario_productos.vue
- CategoriaModal.vue
- Dashboard.vue

8. MANEJO DE ERRORES
---------------------------------------------------------
- Si el backend devuelve un error 422 (validación), se muestra un
  mensaje con los campos fallidos.
- Si el backend está apagado, se muestra un mensaje de error en consola.
- Los formularios incluyen atributos required para validación básica
  del navegador.

9. NOTAS ADICIONALES
---------------------------------------------------------
- El frontend consume la API REST del backend en Laravel.
- Asegúrate de que el backend tenga CORS configurado para aceptar
  peticiones desde http://localhost:5173.
- Para producción, ejecutar: npm run build (genera la carpeta dist/).