<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
// 1. Importamos iconos de Heroicons (son componentes de Vue)
import { 
  ComputerDesktopIcon, 
  DevicePhoneMobileIcon, 
  SpeakerWaveIcon, 
  ShoppingBagIcon,
  TagIcon
} from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router' 
// 2. Estados
const productosApi = ref([]) // Productos reales de Laravel
const categoriasApi = ref([]) 
const categoriaSeleccionada = ref('Todos')
const router = useRouter()

const eliminarProducto = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return
  
  try {
    await axios.delete(`http://127.0.0.1:8000/api/productos/${id}`)
    // Recargamos los datos de la tabla
    cargarDatos()
  } catch (error) {
    console.error('Error al eliminar:', error)
    alert('Hubo un error al eliminar el producto.')
  }
}

const irAEditar = (id) => {
  router.push(`/editar/${id}`) // Redirigimos a la nueva ruta
}
// 3. Cargar datos
const cargarDatos = async () => {
  try {
    const [resCategorias, resProductos] = await Promise.all([
      axios.get('http://127.0.0.1:8000/api/categorias'),
      axios.get('http://127.0.0.1:8000/api/productos')
    ])
    // AHORA ACCEDEMOS A .data.data porque Laravel lo envuelve en "data"
    categoriasApi.value = resCategorias.data.data 
    productosApi.value = resProductos.data.data
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
}

// 4. Categorías para el header (Todos + las de la API)
const categorias = computed(() => {
  const nombresApi = categoriasApi.value.map(c => c.nombre)
  return ['Todos', ...nombresApi]
})

// 5. Filtro de productos
const productosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === 'Todos') return productosApi.value
  // Filtramos comparando el nombre de la categoría del producto con la seleccionada
  return productosApi.value.filter(p => p.categoria?.nombre === categoriaSeleccionada.value)
})

// 6. Función que devuelve el icono según la categoría (Ahorra muchísimo código)
const getIcono = (categoriaNombre) => {
  const mapa = {
    'Tecnología': ComputerDesktopIcon,
    'Pantallas': ComputerDesktopIcon,
    'Audio': SpeakerWaveIcon,
    'Muebles': ShoppingBagIcon,
    'Accesorios': TagIcon
  }
  // Si no encuentra la categoría, devuelve un icono por defecto
  return mapa[categoriaNombre] || TagIcon 
}

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precio)
}

onMounted(() => {
  cargarDatos()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    
    <!-- ================= HEADER CON CATEGORÍAS ================= -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
          
          <!-- Logo / Título -->
          <div class="flex items-center gap-2">
            <div class="bg-indigo-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">MiTienda</span>
          </div>

          <!-- Botones de Categorías -->
          <nav class="flex flex-wrap justify-center gap-2">
            <button 
              v-for="cat in categorias" 
              :key="cat"
              @click="categoriaSeleccionada = cat"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                categoriaSeleccionada === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ cat }}
            </button>
            <router-link 
  to="/agregar" 
  class="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
  Agregar Producto
</router-link>
<!-- En el header de Listas_productos.vue -->
<router-link to="/dashboard" class="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm ml-2">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
  Dashboard
</router-link>
          </nav>

        </div>
      </div>
      
    </header>

    <!-- ================= TÍTULO Y GRID DE PRODUCTOS ================= -->
    <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      <!-- Título dinámico según categoría -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {{ categoriaSeleccionada === 'Todos' ? 'Todos los Productos' : categoriaSeleccionada }}
        </h1>
        <p class="mt-2 text-gray-500">
          Mostrando {{ productosFiltrados.length }} productos
        </p>
      </div>

      <!-- Grid de 3 columnas -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  
  <div v-for="producto in productosFiltrados" :key="producto.id" 
       class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
    
    <div class="p-6">
      <!-- Contenedor del Icono Dinámico -->
      <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
        <!-- Aquí se renderiza el componente del icono según la categoría -->
        <component :is="getIcono(producto.categoria?.nombre)" class="w-8 h-8" />
      </div>

      <!-- Categoría y Nombre -->
      <div class="mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {{ producto.categoria?.nombre || 'Sin categoría' }}
        </span>
        <h3 class="text-lg font-bold text-gray-900 mt-1 truncate">{{ producto.name }}</h3>
        <p class="text-sm text-gray-500 truncate">{{ producto.description }}</p>
      </div>

     <!-- Precio y Stock -->
<div class="mt-4 flex items-center justify-between">
  <div>
    <p class="text-2xl font-extrabold text-gray-900">{{ formatearPrecio(producto.price) }}</p>
    <p class="text-xs text-gray-500">Stock: {{ producto.stock }} uds.</p>
  </div>
  
  <!-- BOTONES DE ACCIÓN -->
  <div class="flex gap-2">
    <button @click="irAEditar(producto.id)" class="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
      Editar
    </button>
    <button @click="eliminarProducto(producto.id)" class="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
      Eliminar
    </button>
  </div>
</div>
    </div>
  </div>

</div>
    </main>
    <!-- MODAL DE CATEGORÍAS -->
<CategoriaModal 
  v-if="mostrarModal" 
  @close="mostrarModal = false" 
  @actualizar-categorias="refrescarCategorias" 
/>
  </div>
</template>

