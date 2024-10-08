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
      <ProviceHover v-if="selectedExample === 'province_hover'"></ProviceHover>
      <BuildingLoad v-if="selectedExample === 'building_load'"> </BuildingLoad>
      <RoderGuider v-if="selectedExample === 'path_nav'"></RoderGuider>
      <DrawLine v-if="selectedExample === 'line_nav'"></DrawLine>
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
  import ProviceHover from './ProviceHover.vue';
  import BuildingLoad from './BuildingLoad.vue';
  import RoderGuider from './RoderGuider.vue';
  import DrawLine from './DrawLine.vue';
  import { ref } from 'vue';
  import { useExampleStore } from '@/stores/example';
  import { storeToRefs } from 'pinia';

  const selectedExample = ref('');

  const exampleList = ref([
    {
      name: '省市信息悬浮弹窗',
      img: '/src/assets/img/example/mapbox/province-hover-img.png',
      key: 'province_hover',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/Mapbox/ProviceHover.vue',
    },
    {
      name: '建筑白膜加载',
      img: '/src/assets/img/example/mapbox/building-load-img.png',
      key: 'building_load',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/Mapbox/BuildingLoad.vue',
    },
    {
      name: '路径导航',
      img: '/src/assets/img/example/mapbox/path-nav-img.png',
      key: 'path_nav',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/Mapbox/RoderGuider.vue',
    },
    {
      name: '线段绘制和漫游',
      img: '/src/assets/img/example/mapbox/line-nav-img.png',
      key: 'line_nav',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/Mapbox/DrawLine.vue',
    },
  ]);

  const { exampleMenuList } = storeToRefs(useExampleStore());

  exampleMenuList.value.map.mapbox = exampleList.value;

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
