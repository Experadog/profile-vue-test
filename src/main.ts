import './app/styles/global.css'

import { createApp } from 'vue'

import App from './app/App.vue'
import { pinia } from './app/providers/with-pinia'
import { router } from './app/providers/with-router'
import { i18n } from './app/providers/with-i18n'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
