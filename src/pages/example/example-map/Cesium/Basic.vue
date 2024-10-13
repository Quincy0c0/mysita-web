<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import * as Cesium from 'cesium';
  import 'cesium/Build/Cesium/Widgets/widgets.css';

  onMounted(() => {
    // 设置基础URL
    Cesium.buildModuleUrl.setBaseUrl('/node_modules/cesium/Build/Cesium/');

    const viewer = new Cesium.Viewer('cesiumContainer');
  });
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }

  #cesiumContainer {
    width: 100%;
    height: 100%;
  }
</style>
