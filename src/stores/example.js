import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', () => {
  const selectedExample = ref({
    name: '基础地图加载/切换',
    img: '/img/example/openlayers/map-toggle.png',
    key: 'basic_map',
    src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/OpenLayers/BasicMap.vue',
  });
  const allExampleList = ref({
    map: {
      openlayers: [
        {
          name: '基础地图加载/切换',
          img: '/img/example/openlayers/map-toggle.png',
          key: 'basic_map',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/OpenLayers/BasicMap.vue',
        },
        {
          name: '绘制和测量',
          img: '/img/example/openlayers/draw-measure.png',
          key: 'draw_measure',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/OpenLayers/MappingTools.vue',
        },
        {
          name: '弹窗和图表',
          img: '/img/example/openlayers/popup-chart.png',
          key: 'popup_chart',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/OpenLayers/MapChartPopup/index.vue',
        },
      ],
      mapbox: [
        {
          name: '省市信息悬浮弹窗',
          img: '/img/example/mapbox/province-hover-img.png',
          key: 'province_hover',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/Mapbox/ProviceHover.vue',
        },
        {
          name: '建筑白膜加载',
          img: '/img/example/mapbox/building-load-img.png',
          key: 'building_load',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/Mapbox/BuildingLoad.vue',
        },
        {
          name: '路径导航',
          img: '/img/example/mapbox/path-nav-img.png',
          key: 'path_nav',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/Mapbox/RoderGuider.vue',
        },
        {
          name: '线段绘制和漫游',
          img: '/img/example/mapbox/line-nav-img.png',
          key: 'line_nav',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/Mapbox/DrawLine.vue',
        },
      ],
      cesium: [
        {
          name: '基础地图加载',
          img: '/img/example/cesium/cesium-base.png',
          key: 'basic',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/cesium/Basic.vue',
        },
        {
          name: '轨迹漫游',
          img: '/img/example/cesium/cesium-trail.png',
          key: 'trail',
        },
        {
          name: '模型压平',
          img: '/img/example/cesium/model-transform.png',
          key: 'ModelTransfrom',
        },
        {
          name: '天空盒',
          img: '/img/example/cesium/skybox.png',
          key: 'skybox',
        },
        {
          name: '白膜加载',
          img: '/img/example/cesium/buildings.png',
          key: 'buildings',
        },
      ],
    },
    three: {
      'three-material': [
        {
          key: 'GlassMaterial',
          name: '玻璃材质',
          img: '/img/example/three/mesh/glassMaterial.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/material/glassMaterial.vue',
        },
        {
          key: 'Reflector',
          name: '镜面反射',
          img: '/img/example/three/mesh/reflector.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/material/Reflector.vue',
        },
        {
          key: 'CustomMateral',
          name: '自定义材质',
          img: '/img/example/three/mesh/customMaterial.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/material/CustomMaterial.vue',
        },
        {
          key: 'Globe',
          name: '地球',
          img: '/img/example/three/mesh/globe.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/material/Globe.vue',
        },
      ],
      'obj-control': [
        {
          key: 'HighLightMesh',
          name: '鼠标交互高亮',
          img: '/img/example/three/interaction/highLightMesh.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/obj-control/HighLightMesh.vue',
        },
        {
          key: 'Htmls',
          name: '内嵌HTML',
          img: '/img/example/three/interaction/htmls.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/obj-control/Htmls.vue',
        },
        {
          key: 'HtmlsWeb',
          name: '内嵌网站',
          img: '/img/example/three/interaction/htmls-web.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/obj-control/HtmlWeb.vue',
        },
        {
          key: 'MeshTransformer',
          name: '控制器',
          img: '/img/example/three/interaction/mesh-transformer.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/obj-control/MeshTransformer.vue',
        },
      ],
      'sprite-effect': [
        {
          key: 'PointFlow',
          name: '点',
          img: '/img/example/three/sprite-effect/point-flow.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/sprite-effect/PointFlow.vue',
        },
        {
          key: 'Snow',
          name: '雪花',
          img: '/img/example/three/sprite-effect/snow.png',
          src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/sprite-effect/Snow.vue',
        },
      ],
    },
  });
  const findKeyOrNameWithParentInfo = function (
    obj,
    targetKeyOrName,
    searchBy = 'key'
  ) {
    const results = [];

    function recurse(currentObj, parentClass = null, parentChild = null) {
      if (typeof currentObj === 'object' && currentObj !== null) {
        for (let key in currentObj) {
          if (currentObj.hasOwnProperty(key)) {
            if (Array.isArray(currentObj[key])) {
              currentObj[key].forEach((item) => {
                if (item[searchBy] === targetKeyOrName) {
                  results.push({
                    class: parentClass,
                    child: key,
                    example: item,
                  });
                }
              });
            } else {
              recurse(currentObj[key], parentClass || key, key);
            }
          }
        }
      }
    }
    recurse(obj);
    return results;
  };

  const findChildrenOfClass = function (obj, targetClass) {
    const results = [];

    // Helper function for recursion
    function recurse(currentObj, parentClass = null) {
      if (typeof currentObj === 'object' && currentObj !== null) {
        for (let key in currentObj) {
          if (currentObj.hasOwnProperty(key)) {
            if (key === targetClass && Array.isArray(currentObj[key])) {
              // Push all items in the target class
              currentObj[key].forEach((item) => {
                results.push(item);
              });
            } else if (typeof currentObj[key] === 'object') {
              // Recursively search in nested objects
              recurse(currentObj[key], key);
            }
          }
        }
      }
    }

    // Start recursion from the root object
    recurse(obj);

    return results;
  };

  const findItemsByNameContains = function (obj, searchTerm) {
    const results = [];

    // Helper function for recursion with parent tracking
    function recurse(currentObj, parentClass = null, parentChild = null) {
      if (typeof currentObj === 'object' && currentObj !== null) {
        for (let key in currentObj) {
          if (currentObj.hasOwnProperty(key)) {
            if (Array.isArray(currentObj[key])) {
              // 遍历数组并查找匹配项
              currentObj[key].forEach((item) => {
                if (item.name && item.name.includes(searchTerm)) {
                  results.push({
                    class: parentClass, // 外层类别，比如 'map' 或 'three'
                    child: key, // 当前的子类别，比如 'openlayers' 或 'material'
                    example: item, // 匹配到的具体项
                  });
                }
              });
            } else if (typeof currentObj[key] === 'object') {
              // 递归进入子对象
              recurse(currentObj[key], parentClass || key, key);
            }
          }
        }
      }
    }

    // 开始从根对象递归
    recurse(obj);

    return results;
  };

  return {
    selectedExample,
    allExampleList,
    findKeyOrNameWithParentInfo,
    findChildrenOfClass,
    findItemsByNameContains,
  };
});
