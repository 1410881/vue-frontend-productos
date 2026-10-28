<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const emit = defineEmits(['close', 'actualizar-categorias'])

const categorias = ref([])
const nuevaCategoria = ref({ nombre: '', descripcion: '' })
const editandoId = ref(null)
const error = ref('')

const API_URL = 'http://127.0.0.1:8000/api/categorias'

const cargarCategorias = async () => {
  try {
    const res = await axios.get(API_URL)
    categorias.value = res.data.data 
  } catch (e) {
    error.value = 'Error al cargar categorías.'
  }
}

const guardarCategoria = async () => {
  error.value = ''
  try {
    if (editandoId.value) {
      await axios.put(`${API_URL}/${editandoId.value}`, nuevaCategoria.value)
    } else {
      await axios.post(API_URL, nuevaCategoria.value)
    }
    
    nuevaCategoria.value = { nombre: '', descripcion: '' }
    editandoId.value = null
    await cargarCategorias()
    emit('actualizar-categorias') 
  } catch (e) {
    if (e.response && e.response.status === 422) {
      error.value = Object.values(e.response.data.errors).flat().join(', ')
    } else {
      error.value = 'Error al guardar la categoría.'
    }
  }
}

const prepararEdicion = (cat) => {
  editandoId.value = cat.id
  nuevaCategoria.value = { nombre: cat.nombre, descripcion: cat.descripcion }
}

const cancelarEdicion = () => {
  editandoId.value = null
  nuevaCategoria.value = { nombre: '', descripcion: '' }
  error.value = ''
}

const eliminarCategoria = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return
  
  try {
    await axios.delete(`${API_URL}/${id}`)
    await cargarCategorias()
    emit('actualizar-categorias')
  } catch (e) {
    error.value = 'No se puede eliminar (quizás tiene productos asociados).'
  }
}

onMounted(() => {
  cargarCategorias()
})
</script>

<template>
<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      
      <div class="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 class="text-xl font-bold text-gray-900">Gestionar Categorías</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1">
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{{ error }}</div>

        <div class="bg-gray-50 p-4 rounded-xl mb-6">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">{{ editandoId ? 'Editar Categoría' : 'Nueva Categoría' }}</h4>
          <div class="flex flex-col sm:flex-row gap-3">
            <input v-model="nuevaCategoria.nombre" type="text" placeholder="Nombre (Ej. Ropa)" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
            <input v-model="nuevaCategoria.descripcion" type="text" placeholder="Descripción (opcional)" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
            
            <button @click="guardarCategoria" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              {{ editandoId ? 'Guardar' : 'Añadir' }}
            </button>
            <button v-if="editandoId" @click="cancelarEdicion" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors">
              Cancelar
            </button>
          </div>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th class="p-3 font-medium rounded-tl-lg">Nombre</th>
              <th class="p-3 font-medium">Descripción</th>
              <th class="p-3 font-medium rounded-tr-lg text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="cat in categorias" :key="cat.id" class="hover:bg-gray-50 transition-colors">
              <td class="p-3 text-sm font-medium text-gray-900">{{ cat.nombre }}</td>
              <td class="p-3 text-sm text-gray-500">{{ cat.descripcion || '-' }}</td>
              <td class="p-3 text-right">
                <button @click="prepararEdicion(cat)" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium mr-3">Editar</button>
                <button @click="eliminarCategoria(cat.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
              </td>
            </tr>
            <tr v-if="categorias.length === 0">
              <td colspan="3" class="p-4 text-center text-gray-500 text-sm">No hay categorías creadas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>