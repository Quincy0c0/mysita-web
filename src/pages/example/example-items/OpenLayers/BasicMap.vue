<template>
  <div
    id="map"
    class="map-container"></div>
</template>

<script setup>
  import { onMounted, ref, toRaw } from 'vue';
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

  const tianDiTu = ref(null);
  const markerTianDitu = ref(null);

  onMounted(() => {
    let $map = map.value;
    let $gaode = gaode.value;
    let $tianDiTu = tianDiTu.value;
    let $markerTianDitu = markerTianDitu.value;
    //高德地图
    $gaode = new TileLayer({
      source: new OSM({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: false,
      }),
    });

    const gaodeLayer = toRaw($gaode);
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

    let wmtsUrl_1 = 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk='; //矢量底图
    let wmtsUrl_2 = 'http://t{0-7}.tianditu.gov.cn/cva_c/wmts?tk='; //矢量注记

    $tianDiTu = new TileLayer({
      source: new WMTS({
        url: wmtsUrl_1 + tianDiKey,
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
    });

    $markerTianDitu = new TileLayer({
      opacity: 0.7,
      source: new WMTS({
        url: wmtsUrl_2 + tianDiKey,
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
    });

    const tianDiTuLayer = toRaw($tianDiTu);
    const markerTianDituLayer = toRaw($markerTianDitu);

    $map = new Map({
      target: 'map',
      layers: [tianDiTuLayer, markerTianDituLayer, gaodeLayer],
      view: new View({
        center: fromLonLat([114.23, 35.46]),
        zoom: 6,
      }),
    });
  });
</script>
<style scoped>
  #map {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }
</style>
