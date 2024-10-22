<template>
  <div id="map"></div>
</template>

<script setup>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import { getProvinceGeo } from '/src/request/index.js';

  const map = ref(null);

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
      center: [112.298, 30.574], //地图中心
      zoom: 2, //缩放等级
      projection: 'globe', //地图模式 球体
    });

    const data = await getProvinceGeo();

    map.value.on('load', function () {
      map.value.setFog({}); //设置星空

      map.value.addSource('data', {
        type: 'geojson',
        data: data,
      });

      //添加图层
      map.value.addLayer({
        id: 'vector_layer',
        type: 'fill',
        source: 'data',
        paint: {
          'fill-color': '#2240c3',
          'fill-opacity': 0.5,
        },
      });
      map.value.addLayer({
        id: 'outline',
        type: 'line',
        source: 'data',
        paint: {
          'line-color': '#333',
          'line-width': 1,
          'line-opacity': 0.8,
        },
      });

      map.value.addSource('highlight', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.value.addLayer({
        id: 'highlight',
        type: 'fill',
        source: 'highlight',
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.5,
        },
      });
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.value.on('mousemove', 'vector_layer', function (e) {
      //移入
      map.value.getCanvas().style.cursor = 'pointer';
      let features = map.value.queryRenderedFeatures(e.point, {
        layers: ['vector_layer'],
      });
      if (!features.length) {
        map.value.setPaintProperty('highlight', 'fill-opacity', 0);
        return;
      }
      var feature = features[0];
      map.value.setPaintProperty('highlight', 'fill-opacity', 0.5);
      map.value.getSource('highlight').setData(feature.geometry);

      popup
        .setLngLat(e.lngLat) //设置弹窗位置
        .setHTML(
          //设置弹窗内容，为properties里面的属性
          `<p>省份名称:<span style="color:blue">${e.features[0].properties.name}</span></P>
          <p>adcode:<span style="color:blue">${e.features[0].properties.adcode}</span></P>`
        )
        //添加到地图上
        .addTo(map.value);
    });

    map.value.on('mouseleave', 'vector_layer', () => {
      map.value.getSource('highlight').setData({
        type: 'FeatureCollection',
        features: [],
      });
      popup.remove();
      map.value.getCanvas().style.cursor = '';
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
