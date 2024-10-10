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
      <GlassMaterial v-if="selectedExample === 'GlassMaterial'" />
      <Reflector v-if="selectedExample === 'Reflector'" />
      <CustomMateral v-if="selectedExample === 'CustomMateral'" />
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
  import GlassMaterial from './GlassMaterial.vue';
  import Reflector from './Reflector.vue';
  import CustomMateral from './CustomMaterial.vue';

  import { ref } from 'vue';

  const selectedExample = ref('');

  const exampleList = ref([
    {
      key: 'GlassMaterial',
      name: '玻璃材质',
      img: '/src/assets/img/example/three/mesh/glassMaterial.png',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/material/glassMaterial.vue',
    },
    {
      key: 'Reflector',
      name: '镜面反射',
      img: '/src/assets/img/example/three/mesh/reflector.png',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/material/Reflector.vue',
    },
    {
      key: 'CustomMateral',
      name: '自定义材质',
      img: '/src/assets/img/example/three/mesh/customMaterial.png',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/material/CustomMaterial.vue',
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
