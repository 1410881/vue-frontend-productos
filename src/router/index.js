import { createRouter, createWebHistory } from 'vue-router'
import ListaProductos from '../components/Listas_productos.vue'
import ProductForm from '../components/Formulario_productos.vue'
import FormularioProductos from '../components/Formulario_productos.vue'
import Dashboard from '../components/Dashboard.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      name: 'home',
      component: ListaProductos 
    },
    { 
      path: '/agregar', 
      name: 'agregar',
      component: ProductForm 
    },
      { path: '/dashboard', name: 'dashboard', component: Dashboard } ,
       { path: '/editar/:id', name: 'editar', component: FormularioProductos }
  ]
})

export default router