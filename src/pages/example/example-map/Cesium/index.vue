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
      <Basic v-if="selectedExample === 'basic'"></Basic>
      <div
        v-if="selectedExample === 'basic'"
        class="example-code-link"
        @click="openLink">
        <i class="iconfont icon-code"></i>
        <span>查看源码</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Basic from './Basic.vue';

  import { ref } from 'vue';

  const selectedExample = ref('');

  const exampleList = ref([
    {
      name: '基础地图加载',
      img: '/src/assets/img/example/cesium/cesium-base.png',
      key: 'basic',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-map/cesium/Basic.vue',
    },
    {
      name: '轨迹漫游',
      img: '/src/assets/img/example/cesium/cesium-trail.png',
      key: 'trail',
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
