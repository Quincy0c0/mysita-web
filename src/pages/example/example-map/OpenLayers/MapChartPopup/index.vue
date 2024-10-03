<template>
  <div id="map"></div>
  <MapPopup
    :chartOptions="chartOptions"
    @closeEvent="closePopup" />
  <div
    class="tips"
    v-show="tipsShow">
    Tips: 点击
    <img
      src="https://openlayers.org/en/latest/examples/data/icon.png"
      style="width: 16px" />
    查看图表

    <el-icon
      @click="tipsShow = false"
      class="close"
      ><Close
    /></el-icon>
  </div>
</template>

<script setup>
  import MapPopup from './popup.vue';
  import { onMounted, ref, toRaw, onBeforeUnmount } from 'vue';
  //openlayers引入
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import { fromLonLat } from 'ol/proj';
  import Overlay from 'ol/Overlay';
  import Feature from 'ol/Feature';
  import { Icon, Style } from 'ol/style';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import { GeoJSON } from 'ol/format';

  const map = ref(null);
  const gaode = ref(null);
  const popup = ref(null);

  const chartOptions = ref({});

  const tipsShow = ref(true);

  const closePopup = () => {
    popup.value.setPosition(undefined);
    chartOptions.value = {};
  };

  onMounted(() => {
    //高德地图
    gaode.value = new TileLayer({
      source: new OSM({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: false,
      }),
      layerName: 'gaode',
    });

    const gaodeLayer = toRaw(gaode.value);

    map.value = new Map({
      target: 'map',
      layers: [gaodeLayer],
      view: new View({
        center: [115.397428, 36.90923],
        zoom: 6,
        projection: 'EPSG:4326', //参考系
      }),
    });

    popup.value = new Overlay({
      element: document.getElementById('popup'),
      positioning: 'top-center',
      stopEvent: false,
      offset: [0, -280],
      autoPanAnimation: {
        //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
        duration: 250,
      },
    });

    map.value.addOverlay(popup.value);

    const iconGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [111.23, 35.46],
          },
          properties: {
            name: '测试点1',
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [115.23, 34.46],
          },
          properties: {
            name: '测试点2',
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [116.23, 37.46],
          },
          properties: {
            name: '测试点3',
          },
        },
      ],
    };

    const iocnStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      }),
    });

    const iconFeatures = new GeoJSON().readFeatures(iconGeoJson, {
      featureProjection: 'EPSG:4326', // 根据你的需求调整投影
    });

    const iconSource = new VectorSource({
      features: iconFeatures,
    });

    const vectorLayer = new VectorLayer({
      source: iconSource,
    });

    // 添加样式到每个特征
    iconFeatures.forEach((feature) => {
      feature.setStyle(iocnStyle);
    });

    map.value.addLayer(vectorLayer);

    map.value.on('click', (evt) => {
      const feature = map.value.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature
      );
      if (feature) {
        if (feature.getProperties().name === '测试点1') {
          chartOptions.value = {
            title: {
              text: '测试图表',
              subtext: '示例',
              left: 'left',
            },
            tooltip: {
              trigger: 'item',
            },
            legend: {
              orient: 'horizontal',
              left: 'left',
              top: 'bottom',
            },
            series: [
              {
                name: '数据',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 1048, name: 'value1' },
                  { value: 735, name: 'value2' },
                  { value: 580, name: 'value3' },
                  { value: 484, name: 'value4' },
                  { value: 300, name: 'value5' },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              },
            ],
          };
        }
        if (feature.getProperties().name === '测试点2') {
          chartOptions.value = {
            title: {
              text: '测试图表',
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985',
                },
              },
            },
            legend: {
              data: ['data1', 'data2', 'data3', 'data4', 'data5'],
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
              left: '100px',
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              },
            ],
            yAxis: [
              {
                type: 'value',
              },
            ],
            series: [
              {
                name: 'Email',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series',
                },
                data: [120, 132, 101, 134, 90, 230, 210],
              },
              {
                name: 'Union Ads',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series',
                },
                data: [220, 182, 191, 234, 290, 330, 310],
              },
              {
                name: 'Video Ads',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series',
                },
                data: [150, 232, 201, 154, 190, 330, 410],
              },
              {
                name: 'Direct',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                  focus: 'series',
                },
                data: [320, 332, 301, 334, 390, 330, 320],
              },
              {
                name: 'Search Engine',
                type: 'line',
                stack: 'Total',
                label: {
                  show: true,
                  position: 'top',
                },
                areaStyle: {},
                emphasis: {
                  focus: 'series',
                },
                data: [820, 932, 901, 934, 1290, 1330, 1320],
              },
            ],
          };
        }
        if (feature.getProperties().name === '测试点3') {
          chartOptions.value = {
            tooltip: {},
            angleAxis: [
              {
                type: 'category',
                polarIndex: 0,
                startAngle: 90,
                endAngle: 0,
                data: ['S1', 'S2', 'S3'],
              },
              {
                type: 'category',
                polarIndex: 1,
                startAngle: -90,
                endAngle: -180,
                data: ['T1', 'T2', 'T3'],
              },
            ],
            radiusAxis: [{ polarIndex: 0 }, { polarIndex: 1 }],
            polar: [{}, {}],
            series: [
              {
                type: 'bar',
                polarIndex: 0,
                data: [1, 2, 3],
                coordinateSystem: 'polar',
              },
              {
                type: 'bar',
                polarIndex: 1,
                data: [1, 2, 3],
                coordinateSystem: 'polar',
              },
            ],
          };
        }
        const coordinate = evt.coordinate;
        popup.value.setPosition(coordinate);
      }
    });
  });

  onBeforeUnmount(() => {
    map.value = null;
  });
</script>
<style scoped>
  @import '/src/assets/style/mapTips.css';

  #map {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }

  .test {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
