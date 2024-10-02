<template>
  <div id="map"></div>
  <div class="controls">
    <div class="draw-line-control">
      <el-button
        @click="startMove"
        type="success"
        >开启漫游</el-button
      >
      <el-button
        @click="resetMap"
        type="danger"
        >重置地图</el-button
      >
    </div>

    <div class="anime-timer-control">
      <span>速度：</span>
      <el-slider
        v-model="AnimeTimer"
        :max="9999"
        show-input />
    </div>
  </div>
  <div
    class="tips"
    v-show="tipsShow">
    <p>
      Tips:左键拖动
      <i class="iconfont icon-location-full"></i>
      绘制线段，绘制结束后点击“开启漫游”开始动画
    </p>
    <el-icon @click="tipsShow = false"><Close /></el-icon>
  </div>
</template>

<script setup>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import * as turf from '@turf/turf';

  const tipsShow = ref(true);

  const map = ref(null);

  const geometryLine = ref({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
  });

  const marker = ref(null);

  const animeMarker = ref(null);

  const pointSource = ref({
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  const lightData = ref({
    type: 'FeatureCollection',
    features: [],
  });

  const startFrame = ref(0);

  const AnimeTimer = ref(7000);

  const resetMap = () => {
    const $map = map.value;
    geometryLine.value.geometry.coordinates = [];
    pointSource.value.data.features = [];
    lightData.value.features = [];

    $map.getSource('lineSource').setData(geometryLine.value);
    $map.getSource('pointSource').setData(pointSource.value.data);
    $map.getSource('lightSource').setData(lightData.value);

    $map.flyTo({
      center: [113.63035, 34.73831],
      zoom: 13,
    });

    marker.value.setLngLat([113.63035, 34.73831]);
    animeMarker.value.remove();

    startFrame.value = 0;
  };

  const startMove = () => {
    const $map = map.value;

    let distance = turf.length(geometryLine.value, { units: 'kilometers' });

    animeMarker.value
      .setLngLat(geometryLine.value.geometry.coordinates[0])
      .addTo($map);

    const animate = (t) => {
      let animationFrame;
      const time = 10000 - AnimeTimer.value;
      if (startFrame.value < time) {
        startFrame.value++;

        let along = turf.along(
          geometryLine.value,
          (distance / time) * startFrame.value
        );

        animeMarker.value.setLngLat(along.geometry.coordinates);

        const { lng, lat } = animeMarker.value.getLngLat();

        let zoom = $map.getZoom();

        $map.easeTo({
          center: [lng, lat],
          zoom: zoom,
        });

        pointSource.value.data.features.forEach((item) => {
          const distancePoint = turf.distance(
            [lng, lat],
            item.geometry.coordinates
          );
          if (distancePoint / distance < 0.01) {
            lightData.value.features[0] = item;
            $map.getSource('lightSource').setData(lightData.value);
          }
        });
        animationFrame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrame);
        animeMarker.value.remove();
        startFrame.value = 0;
      }
    };

    animate();
  };

  onMounted(async () => {
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
      zoom: 13, //缩放等级
      projection: 'globe', //地图模式 球体
    });

    map.value.on('load', function () {
      map.value.setFog({}); //设置星空

      map.value.addSource('pointSource', pointSource.value); //设置点
      map.value.addLayer({
        id: 'pointLayer',
        type: 'circle',
        source: 'pointSource',
        paint: {
          'circle-radius': 10,
          'circle-color': '#4164fb',
        },
      });

      map.value.addSource('lineSource', {
        type: 'geojson',
        data: geometryLine.value,
        lineMetrics: true, // 启用线度量
      });
      //将线添加到一个图层中，在地图中显示
      map.value.addLayer({
        //此id可随意设置，但是要唯一
        id: 'Line',
        //指定类型为线
        type: 'line',
        //设置数据来源
        source: 'lineSource',
        //设置绘制参数
        paint: {
          'line-width': 4,
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            '#ff0000', // 起点红色
            0.25,
            '#ff7f00', // 橙色
            0.5,
            '#ffff00', // 黄色
            0.75,
            '#7fff00', // 绿色
            1,
            '#0000ff', // 终点蓝色
          ],
        },
      });

      map.value.addSource('lightSource', {
        type: 'geojson',
        data: lightData.value,
      });

      map.value.addLayer({
        id: 'lightLayer',
        type: 'circle',
        source: 'lightSource',
        paint: {
          'circle-radius': 10,
          'circle-color': 'red',
        },
      });

      marker.value = new mapboxgl.Marker({
        draggable: true,
      }).setLngLat([113.63035, 34.73831]);
      marker.value.addTo(map.value);

      const addFeatures = function (e) {
        const { lng, lat } = e.target.getLngLat();
        const $map = map.value;
        let id;
        if (pointSource.value.data.features.length > 0) {
          id =
            Number(
              pointSource.value.data.features[
                pointSource.value.data.features.length - 1
              ].properties.id
            ) + 1;
        } else {
          id = 1;
        }

        pointSource.value.data.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          properties: {
            id: id,
          },
        });
        $map.getSource('pointSource').setData(pointSource.value.data);

        if (geometryLine.value.geometry.coordinates.length > 0) {
          geometryLine.value.geometry.coordinates.push([lng, lat]);
        } else {
          geometryLine.value.geometry.coordinates = [[lng, lat]];
        }
        $map.getSource('lineSource').setData(geometryLine.value);
      };

      marker.value.on('dragend', addFeatures);

      animeMarker.value = new mapboxgl.Marker({
        color: 'orange',
      });
    });
  });

  onBeforeUnmount(() => {
    map.value.remove();
    map.value = null;
  });
</script>
<style scoped>
  @import '/src/assets/style/icon.css';
  @import '/src/assets/style/mapTips.css';

  #map {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }

  .controls {
    position: absolute;
    top: 50px;
    left: 20px;
    z-index: 9;
    display: flex;
    width: 500px;
    flex-wrap: wrap;
    background-color: rgba(133, 112, 117, 0.7);
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    color: rgb(255, 244, 246);
  }

  .anime-timer-control {
    display: flex;
    align-items: center;
    width: 500px;
    padding: 10px;
    font-size: 14px;
  }
  .draw-line-control {
    display: flex;
    align-items: center;
    width: 500px;
    margin: 10px 0px 0px 10px;
    font-size: 14px;
  }

  .anime-timer-control span {
    width: 50px;
  }
</style>
