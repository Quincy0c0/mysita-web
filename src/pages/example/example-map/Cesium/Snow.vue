<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import * as Cesium from 'cesium';
  import 'cesium/Build/Cesium/Widgets/widgets.css';
  import { TencentImageryProvider } from '@cesium-china/cesium-map';
  import Fs from '/src/shaders/snowfs.js';

  const viewer = ref(null);
  const tileset = ref(null);

  onMounted(() => {
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

    const options = {
      style: 4, //style: img、1：经典
      crs: 'WGS84', // 使用84坐标系，默认为：GCJ02,
    };
    viewer.value.scene.imageryLayers.addImageryProvider(
      new TencentImageryProvider(options)
    );

    // 使用modelMatrix构造模型的位置
    const cartesian = new Cesium.Cartesian3.fromDegrees(114.3, 30.5);
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian);
    tileset.value = viewer.value.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: '/models/AGI_HQ/tileset.json',
        modelMatrix,
      })
    );
    tileset.value.readyPromise.then((tile) => {
      viewer.value.zoomTo(tile);
    });

    const stages = viewer.value.scene.postProcessStages;

    stages.add(
      new Cesium.PostProcessStage({
        name: 'bink',
        uniforms: {
          snowSpeed: 2,
          snowSize: 1,
        },
        fragmentShader: Fs,
      })
    );
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

  .btns {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 999;
  }
</style>
