<template>
  <div>
    <div class="example-list">
      <div
        class="example-item"
        v-for="item in exampleList"
        :key="item.key"
        @click="selectedExample = item"
        :class="item.key === selectedExample.key ? 'selected' : ''">
        <img :src="item.img" />
        <span>{{ item.name }}</span>
      </div>
      <p class="example-desc">更多案例正在开发中···</p>
    </div>
    <div class="show-window">
      <span v-if="!selectedExample.key">选择一个示例以展示</span>
      <Basic v-if="selectedExample.key === 'basic'"></Basic>
      <Trail v-if="selectedExample.key === 'trail'"></Trail>
      <ModelTransfrom
        v-if="selectedExample.key === 'ModelTransfrom'"></ModelTransfrom>
      <SkyBox v-if="selectedExample.key === 'skybox'"></SkyBox>
      <Builings v-if="selectedExample.key === 'buildings'"></Builings>
      <PointFocus v-if="selectedExample.key === 'PointFocus'"></PointFocus>
      <Snow v-if="selectedExample.key === 'snow'"> </Snow>
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
  import Basic from './Basic.vue';
  import Trail from './Trail.vue';
  import ModelTransfrom from './ModelTransfrom.vue';
  import SkyBox from './SkyBox.vue';
  import Builings from './Buildings.vue';
  import Snow from './Snow.vue';
  import PointFocus from './PointFocus.vue';
  import { useExampleStore } from '@/stores/example';
  import { storeToRefs } from 'pinia';

  import { ref } from 'vue';

  const { selectedExample, allExampleList } = storeToRefs(useExampleStore());

  const exampleList = ref(allExampleList.value.map.cesium);

  const openLink = () => {
    exampleList.value.map((item) => {
      if (item.key === selectedExample.value.key) {
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
