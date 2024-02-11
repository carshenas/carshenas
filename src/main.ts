import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'

// Custom styles
import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
