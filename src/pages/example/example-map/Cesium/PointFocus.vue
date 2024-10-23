<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import * as Cesium from 'cesium';
  import 'cesium/Build/Cesium/Widgets/widgets.css';
  import vertexShader from '/src/shaders/pointLightShader/vs';
  import fragmentShader from '/src/shaders/pointLightShader/fs';
  import { TencentImageryProvider } from '@cesium-china/cesium-map';

  const viewer = ref(null);

  onMounted(async () => {
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

    const tile = new Cesium.Cesium3DTileset({
      url: '/tileset/tileset.json',
    });

    console.log(Cesium.Cesium3DTile);

    const tileset = viewer.value.scene.primitives.add(tile);

    tileset.readyPromise.then((tile) => {
      viewer.value.zoomTo(tile);
      viewer.value.scene.postProcessStages.fxaa.enabled = true;
      tile.customShader = new Cesium.CustomShader({
        uniforms: {
          u_LightPosition: {
            type: Cesium.UniformType.VEC3,
            value: Cesium.Cartesian3.fromDegrees(118.815023, 32.087364),
          },
          u_LightCol: {
            type: Cesium.UniformType.VEC3,
            value: new Cesium.Color.fromCssColorString('#fbc013'),
          },
          u_LightRadius: {
            type: Cesium.UniformType.FLOAT,
            value: 10000.0,
          },
        },
        varyings: {
          v_normalMC: Cesium.VaryingType.VEC3,
        },
        vertexShaderText: vertexShader,
        fragmentShaderText: fragmentShader,
      });
    });
    const options = {
      style: 4, //style: img、1：经典
      crs: 'WGS84', // 使用84坐标系，默认为：GCJ02,
    };
    viewer.value.scene.imageryLayers.addImageryProvider(
      new TencentImageryProvider(options)
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
</style>
