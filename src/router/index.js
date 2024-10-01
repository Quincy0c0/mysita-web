import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/home/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/example',
      name: 'example',
      component: () => import('../pages/example/index.vue'),
      children: [
        {
          path: 'mapbox',
          name: 'mapbox',
          component: () =>
            import('../pages/example/example-items/Mapbox/index.vue'),
        },
        {
          path: 'openlayers',
          name: 'openlayers',
          component: () =>
            import('../pages/example/example-items/OpenLayers/index.vue'),
        },
        {
          path: 'cesium',
          name: 'cesium',
          component: () =>
            import('../pages/example/example-items/Cesium/index.vue'),
        },
      ],
    },
    ,
  ],
});

export default router;
