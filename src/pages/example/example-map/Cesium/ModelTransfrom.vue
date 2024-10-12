<template>
  <div class="container">
    <div id="cesiumContainer"></div>

    <div class="btns">
      <el-button @click="toPlane">压平区域绘制</el-button>
    </div>

    <div
      ref="paneRef"
      class="pane"></div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import * as Cesium from 'cesium';
  import 'cesium/Build/Cesium/Widgets/widgets.css';

  import DrawTool from '/src/plugins/cesium/DrawTool-complete';
  import { TencentImageryProvider } from '@cesium-china/cesium-map';
  import TileFlatten from '/src/plugins/cesium/TileFlatten';
  import { Pane } from 'tweakpane';

  const viewer = ref(null);
  const tileset = ref(null);
  const drawTool = ref(null);
  const height = ref(-50);
  const flattenTool = ref(null);

  const pane = ref();
  const paneRef = ref();

  const toPlane = () => {
    drawTool.value.active(drawTool.value.DrawTypes.Rect);

    drawTool.value.DrawEndEvent.addEventListener((ent, positions) => {
      drawTool.value.removeAllDrawEnts();
      flattenTool.value = new TileFlatten(
        viewer.value,
        tileset.value,
        positions,
        height.value
      );
      flattenTool.value.startFlatten();
    });
  };

  const initPane = () => {
    pane.value = new Pane({
      container: paneRef.value,
    });

    pane.value
      .addBlade({
        view: 'slider',
        label: '压平高度',
        min: -100,
        max: 100,
        value: height.value,
      })
      .on('change', (e) => {
        height.value = e.value;
        flattenTool.value.changeFlattenHeight(height.value);
      });
  };

  onMounted(() => {
    initPane();
    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_KEY;

    Cesium.buildModuleUrl.setBaseUrl('/node_modules/cesium/Build/Cesium/');

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
        url: import.meta.env.VITE_SERVER_SRC + 'AGI_HQ/tileset.json',
        modelMatrix,
      })
    );
    tileset.value.readyPromise.then((tile) => {
      viewer.value.zoomTo(tile);
    });

    drawTool.value = new DrawTool(viewer.value, {});
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
