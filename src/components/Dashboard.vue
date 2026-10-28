<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 1. Estado para guardar los productos reales
const productos = ref([])
const cargando = ref(true)

// 2. Función para traer los datos de Laravel
const cargarProductos = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8000/api/productos')
    // Accedemos a .data.data por el formato de respuesta que creamos
    productos.value = respuesta.data.data 
  } catch (error) {
    console.error('Error al cargar productos para el dashboard:', error)
  } finally {
    cargando.value = false
  }
}

// 3. Cálculos automáticos (Métricas)
const totalProductos = computed(() => productos.value.length)

const valorInventario = computed(() => {
  // Sumamos (precio * stock) de cada producto
  return productos.value.reduce((total, p) => total + (p.price * p.stock), 0)
})

const bajoStock = computed(() => {
  // Filtramos los productos con stock menor a 5
  return productos.value.filter(p => p.stock < 5).length
})

// 4. Función para formatear precios
const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precio)
}

// 5. Cargar datos al montar el componente
onMounted(() => {
  cargarProductos()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Encabezado del Dashboard -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Panel de Control</h1>
          <p class="text-gray-500 mt-1">Resumen de tu inventario actual</p>
        </div>
        <router-link to="/" class="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
          </svg>
          Ir a la Tienda
        </router-link>
      </div>

      <!-- Spinner de carga (opcional) -->
      <div v-if="cargando" class="text-center py-20 text-gray-500">
        Cargando datos del inventario...
      </div>

      <div v-else>
        <!-- Tarjetas de Métricas (KPIs) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <!-- Tarjeta 1: Total Productos -->
          <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Total Productos</p>
              <p class="text-3xl font-bold text-gray-900">{{ totalProductos }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-xl text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>

          <!-- Tarjeta 2: Valor del Inventario -->
          <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Valor del Inventario</p>
              <p class="text-3xl font-bold text-gray-900">{{ formatearPrecio(valorInventario) }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-xl text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <!-- Tarjeta 3: Bajo Stock -->
          <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Bajo Stock (Alerta)</p>
              <p class="text-3xl font-bold" :class="bajoStock > 0 ? 'text-red-600' : 'text-gray-900'">{{ bajoStock }}</p>
            </div>
            <div class="p-3 rounded-xl" :class="bajoStock > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>

        </div>

        <!-- Tabla de Inventario -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-lg font-bold text-gray-900">Inventario Reciente</h2>
            <router-link to="/agregar" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              + Nuevo Producto
            </router-link>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 text-gray-500 text-sm">
                  <th class="p-4 font-medium">Producto</th>
                  <th class="p-4 font-medium">Categoría</th>
                  <th class="p-4 font-medium">Precio</th>
                  <th class="p-4 font-medium">Stock</th>
                  <th class="p-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="prod in productos" :key="prod.id" class="hover:bg-gray-50 transition-colors">
                  <td class="p-4 font-medium text-gray-900">{{ prod.name }}</td>
                  <td class="p-4 text-gray-500">{{ prod.categoria?.nombre || 'Sin categoría' }}</td>
                  <td class="p-4 text-gray-900">{{ formatearPrecio(prod.price) }}</td>
                  <td class="p-4 text-gray-900">{{ prod.stock }} uds.</td>
                  <td class="p-4">
                    <span v-if="prod.stock > 5" class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">En Stock</span>
                    <span v-else class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Bajo Stock</span>
                  </td>
                </tr>
                <!-- Si no hay productos -->
                <tr v-if="productos.length === 0">
                  <td colspan="5" class="p-8 text-center text-gray-500">
                    No hay productos registrados aún.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>