<template>
  <div id="map"></div>
  <MapPopup :chartShow="chartShow" />
  <el-button @click="chartShow = !chartShow">test</el-button>
</template>

<script setup>
  import MapPopup from './popup.vue';
  import { onMounted, ref, toRaw, onBeforeUnmount } from 'vue';
  //openlayers引入
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import { fromLonLat } from 'ol/proj';
  import Overlay from 'ol/Overlay';

  const map = ref(null);
  const gaode = ref(null);
  const popup = ref(null);

  const chartShow = ref(false);

  onMounted(() => {
    //高德地图
    gaode.value = new TileLayer({
      source: new OSM({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: false,
      }),
      layerName: 'gaode',
    });

    const gaodeLayer = toRaw(gaode.value);

    map.value = new Map({
      target: 'map',
      layers: [gaodeLayer],
      view: new View({
        center: fromLonLat([114.23, 35.46]),
        zoom: 6,
      }),
    });

    popup.value = new Overlay({
      element: document.getElementById('popup'),
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10],
      autoPanAnimation: {
        //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
        duration: 250,
      },
    });

    map.value.addOverlay(popup.value);

    popup.value.setPosition(fromLonLat([114.23, 35.46]));
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

  .test {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
