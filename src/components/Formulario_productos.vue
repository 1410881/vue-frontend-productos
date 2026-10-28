<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import CategoriaModal from './CategoriaModal.vue' 

const router = useRouter()
const route = useRoute() 

const categorias = ref([])
const errorGuardado = ref('')
const esEdicion = ref(false)
const mostrarModal = ref(false) 

const formData = ref({
  name: '',
  description: '',
  price: null,
  stock: null,
  category_id: ''
})

const cargarCategorias = async () => {
  try {
    const respuesta = await axios.get('http://127.0.0.1:8000/api/categorias')
    categorias.value = respuesta.data.data // <-- Modificado
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}


const cargarProducto = async (id) => {
  try {
    const respuesta = await axios.get(`http://127.0.0.1:8000/api/productos/${id}`)
    const prod = respuesta.data.data
    
    formData.value = {
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      category_id: prod.category_id
    }
    esEdicion.value = true
  } catch (error) {
    console.error('Error al cargar producto:', error)
    errorGuardado.value = 'No se pudo cargar el producto.'
  }
}

const guardarProducto = async () => {
  errorGuardado.value = ''
  try {
    if (esEdicion.value) {
      await axios.put(`http://127.0.0.1:8000/api/productos/${route.params.id}`, formData.value)
    } else {
      await axios.post('http://127.0.0.1:8000/api/productos', formData.value)
    }
    router.push('/')
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const errores = error.response.data.errors
      errorGuardado.value = Object.values(errores).flat().join(', ')
    } else {
      errorGuardado.value = 'Hubo un error al guardar.'
    }
  }
}

onMounted(() => {
  cargarCategorias()
  if (route.params.id) {
    cargarProducto(route.params.id)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      
      <div class="mb-6">
        <router-link to="/" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver al catálogo
        </router-link>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ esEdicion ? 'Editar Producto' : 'Agregar Nuevo Producto' }}
          </h2>
          
          <div v-if="errorGuardado" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {{ errorGuardado }}
          </div>

          <form @submit.prevent="guardarProducto" class="space-y-6">
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
              <input type="text" v-model="formData.name" required placeholder="Ej. Camiseta Overskull" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea v-model="formData.description" rows="2" placeholder="Descripción del producto..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-sm font-medium text-gray-700">Categoría</label>
                  <button type="button" @click="mostrarModal = true" class="text-xs text-indigo-600 hover:text-indigo-800 font-bold">
                    + Gestionar
                  </button>
                </div>
                
                <select v-model="formData.category_id" required 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                  <option value="" disabled>Selecciona</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                <input type="number" v-model="formData.price" required step="0.01" min="0" placeholder="0.00"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" v-model="formData.stock" required min="0" placeholder="0"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
              </div>
            </div>

            <div class="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <router-link to="/" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </router-link>
              <button type="submit" class="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                {{ esEdicion ? 'Actualizar Producto' : 'Guardar Producto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <CategoriaModal 
      v-if="mostrarModal" 
      @close="mostrarModal = false" 
      @actualizar-categorias="cargarCategorias" 
    />
  </div>
</template>