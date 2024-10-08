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
      <HighLightMesh v-if="selectedExample === 'HighLightMesh'" />
      <Htmls v-if="selectedExample === 'Htmls'" />
      <HtmlsWeb v-if="selectedExample === 'HtmlsWeb'" />
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
  import HighLightMesh from './HighLightMesh.vue';
  import Htmls from './Htmls.vue';
  import HtmlsWeb from './HtmlsWeb.vue';

  import { ref } from 'vue';
  import { useExampleStore } from '@/stores/example';
  import { storeToRefs } from 'pinia';

  const selectedExample = ref('');

  const exampleList = ref([
    {
      key: 'HighLightMesh',
      name: '鼠标交互高亮',
      img: '/src/assets/img/example/three/interaction/highLightMesh.png',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/obj-control/HighLightMesh.vue',
    },
    {
      key: 'Htmls',
      name: '内嵌HTML',
      img: '/src/assets/img/example/three/interaction/htmls.png',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/obj-control/Htmls.vue',
    },
    {
      key: 'HtmlsWeb',
      name: '内嵌网站',
      img: '/src/assets/img/example/three/interaction/htmls-web.png',
      src: 'https://github.com/Quincy0c0/mysita-web/blob/main/src/pages/example/example-three/obj-control/HtmlWeb.vue',
    },
  ]);

  const { exampleMenuList } = storeToRefs(useExampleStore());

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
