<template>
  <div
    id="map"
    class="map-container"></div>

  <div class="selector">
    <div class="map-selector">
      <p>地图源：</p>
      <div
        class="map-name-item"
        v-for="item in mapProvider"
        :key="item.key"
        @click="mapSelected.name = item.name"
        :class="mapSelected.name === item.name ? 'active' : ''">
        {{ item.name }}
      </div>
    </div>
    <div class="layer-selector">
      <p>地图类型:</p>
      <div
        class="map-layer-item"
        v-for="item in mapType"
        @click="mapSelected.type = item.type"
        :class="mapSelected.type === item.type ? 'active' : ''">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, toRaw, watch, onBeforeUnmount } from 'vue';
  //基础组件
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import { fromLonLat } from 'ol/proj';
  //加载天地图需要用到的额外组件
  import WMTS from 'ol/source/WMTS';
  import WMTSTileGrid from 'ol/tilegrid/WMTS';
  import { get as getProjection } from 'ol/proj';
  import { getWidth, getTopLeft } from 'ol/extent';

  const map = ref(null);

  const gaode = ref(null);
  const gaodeImage = ref(null);

  const tianDiTu = ref(null);
  const tianDituMarker = ref(null);
  const tianDiTuImage = ref(null);

  const mapProvider = ref([
    {
      name: '高德',
      layer: 'gaode',
      key: 'gaode',
    },
    {
      name: '天地图',
      layer: 'tianDiTu',
      key: 'tianDiTu',
    },
  ]);

  const mapType = ref([
    {
      name: '基础图',
      type: 'base',
    },
    {
      name: '影像图',
      type: 'image',
    },
  ]);

  const mapSelected = ref({
    name: '高德',
    type: 'base',
  });

  watch(
    mapSelected,
    (val) => {
      if (map.value) {
        const layers = map.value.getLayers().getArray();
        layers.forEach((item) => {
          item.set('opacity', 0);
        });
      }

      if (val.name === '高德') {
        if (val.type === 'base') {
          gaode.value.set('opacity', 1);
        }
        if (val.type === 'image') {
          gaodeImage.value.set('opacity', 1);
        }
      }

      if (val.name === '天地图') {
        tianDiTu.value.set('opacity', 1);
        tianDituMarker.value.set('opacity', 1);
      }
      if (val.type === 'image') {
        tianDiTuImage.value.set('opacity', 1);
      }
    },

    {
      deep: true,
    }
  );

  onMounted(() => {
    //高德地图
    gaode.value = new TileLayer({
      source: new OSM({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: false,
      }),
      layerName: 'gaode',
    });

    gaodeImage.value = new TileLayer({
      source: new OSM({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        wrapX: false,
      }),
      layerName: 'gaodeImage',
    });

    //加载天地图
    const tianDiKey = import.meta.env.VITE_TIANDITU_KEY;
    const projection = getProjection('EPSG:4326');
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(18);
    const matrixIds = new Array(18);
    for (let z = 0; z < 19; ++z) {
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    tianDiTu.value = new TileLayer({
      source: new WMTS({
        url: 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=' + tianDiKey,
        layer: 'vec',
        matrixSet: 'c',
        format: 'tiles',
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        style: 'default',
        wrapX: true,
      }),
      layerName: 'tianDiTu',
    });

    tianDituMarker.value = new TileLayer({
      opacity: 0.7,
      source: new WMTS({
        url: 'http://t{0-7}.tianditu.gov.cn/cva_c/wmts?tk=' + tianDiKey,
        layer: 'cva',
        matrixSet: 'c',
        format: 'tiles',
        style: 'default',
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        style: 'default',
        wrapX: true,
      }),
      layerName: 'tianDituMarker',
    });

    tianDiTuImage.value = new TileLayer({
      source: new WMTS({
        url: 'http://t{0-7}.tianditu.gov.cn/img_c/wmts?tk=' + tianDiKey,
        layer: 'img',
        matrixSet: 'c',
        format: 'tiles',
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        style: 'default',
        wrapX: true,
      }),
      layerName: 'tianDiTuImage',
    });

    const gaodeLayer = toRaw(gaode.value);
    const gaodeImageLayer = toRaw(gaodeImage.value);
    const tianDiTuLayer = toRaw(tianDiTu.value);
    const markerTianDituLayer = toRaw(tianDituMarker.value);
    const tianDiTuImageLayer = toRaw(tianDiTuImage.value);

    map.value = new Map({
      target: 'map',
      layers: [
        tianDiTuLayer,
        markerTianDituLayer,
        gaodeImageLayer,
        tianDiTuImageLayer,
        gaodeLayer,
      ],
      view: new View({
        center: fromLonLat([114.23, 35.46]),
        zoom: 6,
      }),
    });
  });

  onBeforeUnmount(() => {
    map.value = null;
  });
</script>
<style scoped>
  #map {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }

  .selector {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 9;
    border-radius: 15px;
    color: rgb(255, 244, 246);
    font-size: 14px;
  }

  .map-selector {
    display: flex;
    margin-bottom: 10px;
    background-color: rgba(133, 112, 117, 0.7);
    border-radius: 15px;
    align-items: center;
  }

  .map-name-item {
    padding: 10px;
    margin: 5px;
    cursor: pointer;
    border-radius: 15px;
    border: 2px solid transparent;
  }

  .map-name-item:hover {
    background-color: rgb(241, 154, 174);
    color: rgb(133, 112, 117);
    animation: example-item-hover 0.3s ease-in-out;
    border: 2px solid rgb(249, 223, 227);
    cursor: pointer;
  }

  @keyframes example-item-hover {
    0% {
      background-color: transparent;
    }
    100% {
      background-color: rgb(241, 154, 174);
    }
  }

  .layer-selector {
    display: flex;
    margin-bottom: 10px;
    background-color: rgba(133, 112, 117, 0.7);
    border-radius: 15px;
    align-items: center;
  }

  .map-layer-item {
    padding: 10px;
    margin: 5px;
    border-radius: 15px;
    border: 2px solid transparent;
  }

  .map-layer-item:hover {
    background-color: rgb(241, 154, 174);
    color: rgb(133, 112, 117);
    animation: example-item-hover 0.3s ease-in-out;
    border: 2px solid rgb(249, 223, 227);
    cursor: pointer;
  }

  p {
    margin-left: 10px;
  }

  .active {
    background-color: rgb(241, 154, 174);
  }
</style>
