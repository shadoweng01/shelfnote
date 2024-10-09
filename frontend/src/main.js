import 'element-plus/dist/index.css';
import './style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router/router';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Element Plus config
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus);
  
// Use the router, start the thing
app.use(router);
app.mount('#app');

