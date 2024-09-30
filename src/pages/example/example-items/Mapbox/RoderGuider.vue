<template>
  <div id="map"></div>
  <div
    class="tips"
    v-show="tipsShow">
    Tips:点击地图以选择起始点/终点
    <el-icon @click="tipsShow = false"><Close /></el-icon>
  </div>
</template>

<script setup>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
  import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
  import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
  import { onMounted, ref, onBeforeUnmount } from 'vue';

  const tipsShow = ref(true);

  const map = ref(null);

  onMounted(async () => {
    const key = import.meta.env.VITE_MAPBOX_KEY;

    const gao = {
      //版本号
      version: 8,
      //数据源
      sources: {
        //数据源名称
        'raster-tiles': {
          //数据类型
          type: 'raster',
          //瓦片数据源
          tiles: [
            'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
          ],
          //瓦片大小
          tileSize: 256,
        },
      },
      //图层
      layers: [
        {
          //图层id
          id: 'simple-tiles',
          //图层类型
          type: 'raster',
          //图层数据
          source: 'raster-tiles',
          //最小最大放大级别
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    };
    //添加地图
    map.value = new mapboxgl.Map({
      container: 'map', //div的id
      style: gao, //高德地图
      center: [113.63035, 34.73831], //地图中心
      zoom: 12, //缩放等级
      projection: 'globe', //地图模式 球体
    });

    map.value.addControl(
      new MapboxDirections({
        accessToken: key,
        unit: 'metric', //设置单位公里
        profile: 'mapbox/driving',
        language: 'zh-CN',
      }),
      'top-right'
    );

    map.value.on('load', function () {
      map.value.setFog({}); //设置星空
    });
  });

  onBeforeUnmount(() => {
    map.value.remove();
    map.value = null;
  });
</script>
<style scoped>
  @import '/src/assets/style/mapTips.css';
  #map {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }
</style>
