<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import * as Cesium from 'cesium';
  import 'cesium/Build/Cesium/Widgets/widgets.css';
  import SkyBoxOnGround from '/src/plugins/cesium/skyBoxRepiar.js';

  const viewer = ref(null);

  onMounted(() => {
    // 设置基础URL
    viewer.value = new Cesium.Viewer('cesiumContainer', {
      timeline: false,
      // 动画控件
      animation: false,
      // 右上方的底图控件
      baseLayerPicker: false,
      // 右上方的复位按钮
      homeButton: false,
      // 右上方的全屏按钮
      fullscreenButton: false,
      // 右上方的导航按钮
      geocoder: false,
      // 右上方的二三维切换按钮
      sceneModePicker: false,
      // 右上方的帮助按钮
      navigationHelpButton: false,
      // 用来做动画的shouldAnimate，是否让cesium的时钟正常的步进
      shouldAnimate: true,
      // 阻止弹出点击的信息框
      infoBox: false,
      // 取消元素的选中
      selectionIndicator: false,
    });

    viewer.value.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
    ];

    // zoomEventType 控制相机的缩放交互模式，改为中键拖动和中键的滚轮
    viewer.value.scene.screenSpaceCameraController.zoomEventType = [
      Cesium.CameraEventType.MIDDLE_DRAG,
      Cesium.CameraEventType.WHEEL,
    ];

    // 设置拖转模式，rotateEventTypes
    viewer.value.scene.screenSpaceCameraController.rotateEventTypes = [
      Cesium.CameraEventType.LEFT_DRAG,
    ];

    viewer.value.terrainProvider = Cesium.createWorldTerrain();

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(114.397, 30.917, 1000),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-10.0),
        roll: 0.0,
      },
    });
    const groundSky = new Cesium.SkyBox({
      sources: {
        positiveX: `/skyBox/02/px.jpg`,
        negativeX: `/skyBox/02/nx.jpg`,
        positiveY: `/skyBox/02/py.jpg`,
        negativeY: `/skyBox/02/ny.jpg`,
        positiveZ: `/skyBox/02/pz.jpg`,
        negativeZ: `/skyBox/02/nz.jpg`,
      },
    });

    // const groundSky = new SkyBoxOnGround({
    //   sources: {
    //     positiveX: `/skyBox/02/px.jpg`,
    //     negativeX: `/skyBox/02/nx.jpg`,
    //     positiveY: `/skyBox/02/py.jpg`,
    //     negativeY: `/skyBox/02/ny.jpg`,
    //     positiveZ: `/skyBox/02/pz.jpg`,
    //     negativeZ: `/skyBox/02/nz.jpg`,
    //   },
    // });
    viewer.value.scene.skyBox = groundSky;

    viewer.value.scene.skyBoxNearDistance = 1.0; // 设置为您希望显示近景天空盒的相机距离

    viewer.value.scene.skyAtmosphere.show = false;
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
