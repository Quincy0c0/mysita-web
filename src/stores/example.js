import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', () => {
  const exampleMenuList = ref({
    map: {
      openLayers: [
        {
          name: '基础地图加载/切换',
          img: '/src/assets/img/example/openlayers/map-toggle.png',
          key: 'basic_map',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-items/OpenLayers/BasicMap.vue',
        },
        {
          name: '绘制和测量',
          img: '/src/assets/img/example/openlayers/draw-measure.png',
          key: 'draw_measure',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-items/OpenLayers/MappingTools.vue',
        },
      ],
      mapbox: [
        {
          name: '省市信息悬浮弹窗',
          img: '/src/assets/img/example/mapbox/province-hover-img.png',
          key: 'province_hover',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-items/Mapbox/ProviceHover.vue',
        },
        {
          name: '建筑白膜加载',
          img: '/src/assets/img/example/mapbox/building-load-img.png',
          key: 'building_load',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-items/Mapbox/BuildingLoad.vue',
        },
        {
          name: '路径导航',
          img: '/src/assets/img/example/mapbox/path-nav-img.png',
          key: 'path_nav',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-items/Mapbox/RoderGuider.vue',
        },
        {
          name: '线段绘制和漫游',
          img: '/src/assets/img/example/mapbox/line-nav-img.png',
          key: 'line_nav',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-items/Mapbox/DrawLine.vue',
        },
      ],
      cesium: [],
    },
    three: {},
  });

  return {
    exampleMenuList,
  };
});
