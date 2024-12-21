import { registerPlugins } from '@/plugins'
import { createApp } from 'vue'

import App from './App.vue'

// Custom styles
import '@/assets/styles/main.scss'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
