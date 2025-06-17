import { createRouter, createWebHistory } from 'vue-router'
import StepOne from '../views/StepOne.vue'
import StepTwo from '../views/StepTwo.vue'
import StepThree from '../views/StepThree.vue'

const routes = [
    { path: '/', name: 'StepOne', component: StepOne },
    { path: '/confirm', name: 'StepTwo', component: StepTwo },
    { path: '/success', name: 'StepThree', component: StepThree },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router