import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Tres from '@tresjs/core';

import App from './App.vue';
import router from './router';
import './assets/style/basic.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import mapboxgl from 'mapbox-gl';

const app = createApp(App);
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(createPinia());
app.use(router);
app.use(Tres);

app.mount('#app');
