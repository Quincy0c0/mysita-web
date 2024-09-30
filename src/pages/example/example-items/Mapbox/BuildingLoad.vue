<template>
  <div id="map"></div>
</template>

<script setup>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
  import { onMounted, onBeforeUnmount, ref } from 'vue';

  const map = ref(null);
  onMounted(async () => {
    //添加地图

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

    map.value = new mapboxgl.Map({
      container: 'map', //div的id
      style: gao, //高德地图
      center: [114.050008, 22.529272], //地图中心
      zoom: 14, //缩放等级
      projection: 'globe', //地图模式 球体
      pitch: 60, //倾斜角度
    });

    map.value.on('load', function () {
      map.value.setFog({}); //设置星空

      const url =
        'https://gw.alipayobjects.com/os/basement_prod/972566c5-a2b9-4a7e-8da1-bae9d0eb0117.json';

      map.value.addSource('buildings', {
        type: 'geojson',
        data: url,
      });

      //添加3D建筑图层
      map.value.addLayer({
        id: 'buildingsLayer',
        type: 'fill-extrusion',
        source: 'buildings',
        paint: {
          'fill-extrusion-color': {
            property: 'h20', //获取properties的属性
            stops: [
              /* 小于10 绿色 */
              [10, 'green'],
              /* 10~50  渐变 */
              [50, 'yellow'],
              /* 50~100   渐变*/
              [100, 'red'],
            ],
          },
          'fill-extrusion-height': ['get', 'h20'],
          'fill-extrusion-opacity': 0.6,
          'fill-extrusion-base': 0,
        },
      });
    });
  });

  onBeforeUnmount(() => {
    map.value.remove();
    map.value = null;
  });
</script>
<style scoped>
  #map {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }
</style>
