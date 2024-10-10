<template>
  <div>
    <div class="example-list">
      <div
        class="example-item"
        v-for="item in exampleList"
        :key="item.key"
        @click="selectedExample = item.key"
        :class="item.key === selectedExample ? 'selected' : ''">
        <img :src="item.img" />
        <span>{{ item.name }}</span>
      </div>
      <p class="example-desc">更多案例正在开发中···</p>
    </div>
    <div class="show-window">
      <span v-if="!selectedExample">选择一个示例以展示</span>
      <BasicMap v-if="selectedExample === 'basic_map'" />
      <MappingTools v-if="selectedExample === 'draw_measure'"></MappingTools>
      <PopupChart v-if="selectedExample === 'popup_chart'"></PopupChart>
      <div
        class="example-code-link"
        @click="openLink">
        <i class="iconfont icon-code"></i>
        <span>查看源码</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import BasicMap from './BasicMap.vue';
  import MappingTools from './MappingTools.vue';
  import PopupChart from './MapChartPopup/index.vue';

  import { ref } from 'vue';

  const selectedExample = ref('');

  const exampleList = ref([
    {
      name: '基础地图加载/切换',
      img: '/src/assets/img/example/openlayers/map-toggle.png',
      key: 'basic_map',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/OpenLayers/BasicMap.vue',
    },
    {
      name: '绘制和测量',
      img: '/src/assets/img/example/openlayers/draw-measure.png',
      key: 'draw_measure',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/OpenLayers/MappingTools.vue',
    },
    {
      name: '弹窗和图表',
      img: '/src/assets/img/example/openlayers/popup-chart.png',
      key: 'popup_chart',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/OpenLayers/MapChartPopup/index.vue',
    },
  ]);

  const openLink = () => {
    exampleList.value.map((item) => {
      if (item.key === selectedExample.value) {
        if (item.src) {
          window.open(item.src, '_blank');
        }
      }
    });
  };
</script>
<style scoped>
  @import '/src/assets//style/icon.css';

  @import '/src/assets/style/example.css';
</style>
