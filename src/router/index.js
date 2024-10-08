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
            import('../pages/example/example-map/Mapbox/index.vue'),
        },
        {
          path: 'openlayers',
          name: 'openlayers',
          component: () =>
            import('../pages/example/example-map/OpenLayers/index.vue'),
        },
        {
          path: 'cesium',
          name: 'cesium',
          component: () =>
            import('../pages/example/example-map/Cesium/index.vue'),
        },
        {
          path: 'three-material',
          name: 'three-material',
          component: () =>
            import('../pages/example/example-three/material/index.vue'),
        },
        {
          path: 'three-interaction',
          name: 'three-interaction',
          component: () =>
            import('../pages/example/example-three/obj-control/index.vue'),
        },
        {
          path: 'sprite-effect',
          name: 'sprite-effect',

          component: () =>
            import('../pages/example/example-three/sprite-effect/index.vue'),
        },
      ],
    },
  ],
});

export default router;
