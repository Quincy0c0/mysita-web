<template>
  <div class="container">
    <div class="html-input">
      <el-input
        v-model="inputVal"
        style="max-width: 800px"
        placeholder="输入网址">
        <template #prepend>Https://</template>
      </el-input>
    </div>
    <TresCanvas v-bind="gl">
      <TresPerspectiveCamera
        :position="[8, 8, 8]"
        :look-at="[0, 0, 0]" />
      <OrbitControls />

      <Suspense>
        <LapTop
          :position="[0, -2, 0]"
          :scale="0.3"
          :webUrl="webUrl" />
      </Suspense>

      <TresDirectionalLight :intensity="3" />
      <TresAmbientLight :intensity="8" />
    </TresCanvas>
  </div>
</template>

<script setup>
  import LapTop from './models/LaptopModel.vue';

  import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three';
  import { OrbitControls } from '@tresjs/cientos';
  import { ref, watch } from 'vue';

  const inputVal = ref(
    'thwiki.cc/%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85%C2%B7%E8%90%9D%E8%95%BE%E6%8B%89'
  );

  const webUrl = ref(
    'https://thwiki.cc/%E7%B1%B3%E6%96%AF%E8%92%82%E5%A8%85%C2%B7%E8%90%9D%E8%95%BE%E6%8B%89'
  );

  const gl = {
    clearColor: '#fdf3f5',
    shadows: true,
    alpha: false,
    shadowMapType: BasicShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
  };

  watch(inputVal, (val) => {
    if (val.includes('https://')) {
      webUrl.value = val;
    } else {
      webUrl.value = `https://${val}`;
    }
  });
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }
  .html-in-three {
    background-color: #a6979b;
    color: #fdf3f5;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-top: 1rem;
    border-radius: 10px;
    padding: 5px;
  }

  .html-input {
    position: absolute;
    justify-content: center;
    margin-top: 1rem;
    z-index: 999;
  }
</style>
