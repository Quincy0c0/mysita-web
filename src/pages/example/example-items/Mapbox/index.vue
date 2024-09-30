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
    </div>
    <div class="show-window">
      <span v-if="!selectedExample">选择一个示例以展示</span>
      <ProviceHover v-if="selectedExample === 'province_hover'"></ProviceHover>
      <BuildingLoad v-if="selectedExample === 'building_load'"> </BuildingLoad>
      <RoderGuider v-if="selectedExample === 'path_nav'"></RoderGuider>
      <DrawLine v-if="selectedExample === 'line_nav'"></DrawLine>
    </div>
  </div>
</template>

<script setup>
  import ProviceHover from './ProviceHover.vue';
  import BuildingLoad from './BuildingLoad.vue';
  import RoderGuider from './RoderGuider.vue';
  import DrawLine from './DrawLine.vue';
  import { ref } from 'vue';

  const selectedExample = ref('');

  const exampleList = ref([
    {
      name: '省市信息悬浮弹窗',
      img: '/src/assets/img/example/mapbox/province-hover-img.png',
      key: 'province_hover',
    },
    {
      name: '建筑白膜加载',
      img: '/src/assets/img/example/mapbox/building-load-img.png',
      key: 'building_load',
    },
    {
      name: '路径导航',
      img: '/src/assets/img/example/mapbox/path-nav-img.png',
      key: 'path_nav',
    },
    {
      name: '线段绘制和漫游',
      img: '/src/assets/img/example/mapbox/line-nav-img.png',
      key: 'line_nav',
    },
  ]);
</script>
<style scoped>
  .show-window {
    position: relative;
    width: 100%;
    height: 600px;
    border-radius: 15px;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .show-window span {
    color: rgb(249, 223, 227);
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .example-list {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: rgb(133, 112, 117);
    overflow-x: auto;
  }
  .example-item {
    width: 210px;
    height: 175px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
    background-color: transparent;
    border: 2px solid rgba(133, 112, 117, 0.3);
    margin: 0 10px;
  }

  @keyframes example-item-hover {
    0% {
      background-color: transparent;
    }
    100% {
      background-color: rgb(241, 154, 174);
    }
  }
  .example-item:hover {
    background-color: rgb(241, 154, 174);
    color: rgb(249, 223, 227);
    animation: example-item-hover 0.3s ease-in-out;
    border: 2px solid rgb(249, 223, 227);
  }
  .example-item img {
    padding: 10px 10px 0px 10px;
    width: 210px;
    height: 160px;
    border-radius: 15px;
  }
  .example-item span {
    font-size: 14px;
  }
  .selected {
    background-color: rgb(133, 112, 117);
    color: rgb(249, 223, 227);
  }
</style>
