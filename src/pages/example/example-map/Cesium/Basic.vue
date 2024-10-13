<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import * as Cesium from 'cesium';
  import 'cesium/Build/Cesium/Widgets/widgets.css';

  const viewer = ref(null);

  onMounted(() => {
    // 设置基础URL
    viewer.value = new Cesium.Viewer('cesiumContainer');
  });

  onBeforeUnmount(() => {
    viewer.value && viewer.value.destroy();
    viewer.value = null;
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
