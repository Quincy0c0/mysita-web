<template>
  <div
    id="map"
    @click.right="stopDraw"
    @mousemove="getMousePosition"></div>

  <div class="draw-tools">
    <button
      @click="drawEvent('Point')"
      :class="drawType === 'Point' ? 'active' : ''">
      <i class="iconfont icon-a-1xdian"></i>
    </button>
    <button
      @click="drawEvent('LineString')"
      :class="drawType === 'LineString' ? 'active' : ''">
      <i class="iconfont icon-xian"></i>
    </button>
    <button
      @click="drawEvent('Circle')"
      :class="drawType === 'Circle' ? 'active' : ''">
      <i class="iconfont icon-huizhiyuanxing"></i>
    </button>
    <button
      @click="drawEvent('Rectangle')"
      :class="drawType === 'Rectangle' ? 'active' : ''">
      <i class="iconfont icon-huizhijuxing"></i>
    </button>
    <button
      @click="drawEvent('Polygon')"
      :class="drawType === 'Polygon' ? 'active' : ''">
      <i class="iconfont icon-huaduobianxing"></i>
    </button>
  </div>

  <div class="mapControls">
    <el-button
      @click="clearDraw"
      color="#f4dbe0"
      >清空画布</el-button
    >
  </div>
  <div
    v-show="drawType !== 'none'"
    class="draw-tips"
    :style="{
      left: tipsPosition.left + 'px',
      top: tipsPosition.top + 'px',
    }">
    点击左键进行绘制，右键取消绘制
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
  import { Vector as VectorLayer } from 'ol/layer';
  import { Vector as VectorSource } from 'ol/source';
  import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
  import { Draw } from 'ol/interaction';
  import { Polygon } from 'ol/geom';

  const map = ref(null);

  const draw = ref(null);

  const drawSource = ref(null);

  const drawLayer = ref(null);

  const drawType = ref('none');

  const tipsPosition = ref({
    left: 0,
    top: 0,
    display: 'none',
  });

  const drawEvent = (type) => {
    if (drawType.value === type) {
      drawType.value = 'none';

      map.value.removeInteraction(draw.value);

      tipsPosition.value.display = 'none';
    } else {
      map.value.removeInteraction(draw.value);
      drawType.value = type;

      if (
        drawType.value === 'Point' ||
        drawType.value === 'LineString' ||
        drawType.value === 'Polygon' ||
        drawType.value === 'Circle'
      ) {
        draw.value = new Draw({
          source: drawSource.value,
          type: type,
        });
      }
      if (drawType.value === 'Rectangle') {
        draw.value = new Draw({
          source: drawSource.value,
          type: 'LineString',
          geometryFunction: (coordinates, geometry) => {
            if (!geometry) {
              //多边形
              geometry = new Polygon([]);
            }
            var start = coordinates[0];
            var end = coordinates[1];
            geometry.setCoordinates([
              [start, [start[0], end[1]], end, [end[0], start[1]], start],
            ]);
            return geometry;
          },
          maxPoints: 2,
        });
      }

      map.value.addInteraction(draw.value);
    }
  };

  const getMousePosition = (event) => {
    if (drawType.value !== 'none') {
      tipsPosition.value.left = event.clientX - 250;
      tipsPosition.value.top = event.clientY - 320;
    }
  };

  const clearDraw = () => {
    drawSource.value.clear();
  };

  const stopDraw = () => {
    map.value.removeInteraction(draw.value);
    drawType.value = 'none';
  };

  onMounted(() => {
    map.value = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM({
            url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
            wrapX: false,
          }),
          layerName: 'gaode',
        }),
      ],
      view: new View({
        center: fromLonLat([116.397428, 39.90923]),
        zoom: 10,
      }),
    });

    drawSource.value = new VectorSource();

    drawLayer.value = new VectorLayer({
      source: drawSource.value,
      style: new Style({
        fill: new Fill({
          color: 'rgba(129, 113, 117, 0.6)',
        }),
        stroke: new Stroke({
          color: 'rgb(228, 158, 174)',
          width: 4,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: 'rgb(228, 158, 174)',
          }),
        }),
      }),
    });

    map.value.addLayer(drawLayer.value);
  });

  onBeforeUnmount(() => {
    map.value = null;
  });
</script>
<style scoped>
  @import '/src/assets/style/icon.css';

  #map {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }

  .draw-tools {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .draw-tools button {
    width: 30px;
    height: 30px;
    padding: 5px;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
  }

  .draw-tools button:last-child {
    border-bottom: none;
  }

  i {
    font-size: 20px;
  }

  .draw-tools button:hover {
    background-color: #f0f0f0;
    border-radius: 5px;
  }

  .draw-tips {
    font-size: 12px;
    width: 210px;
    height: 24px;
    position: absolute;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 5px;
    padding: 5px;
  }

  .mapControls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 999;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .active {
    background-color: rgb(244, 219, 224) !important;
    /* border-radius: 5px; */
  }
</style>
