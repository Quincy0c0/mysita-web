<template>
  <div class="container">
    <div
      ref="paneRef"
      class="pane"></div>
    <TresCanvas
      shadows
      v-bind="gl"
      ref="context">
      <OrbitControls />
      <TresGridHelper :args="[10, 10]" />
      <TresPerspectiveCamera
        :position="creamaPosition"
        :look-at="[0, 0, 0]"
        ref="cameraRef" />

      <TresMesh ref="globeRef">
        <TresSphereGeometry :args="[1, 32, 32]" />

        <TresMeshStandardMaterial
          :map="texture.map"
          :normalMap="texture.normalMap" />
      </TresMesh>

      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight
        cast-shadow
        :intensity="6"
        :position="[5, 2, 0]" />
    </TresCanvas>
  </div>
</template>

<script setup>
  import { TresCanvas, useTexture, useRenderLoop } from '@tresjs/core';
  import { OrbitControls } from '@tresjs/cientos';
  import { ref, shallowReactive, onMounted } from 'vue';
  import * as Three from 'three';

  const { onLoop } = useRenderLoop();

  const context = ref();
  const rotation = ref([0, 0, 0]);
  const globeRef = ref();
  const creamaPosition = ref([2, 2, 2]);
  const cameraRef = ref();

  const gl = {
    clearColor: '#f6f0f4',
    shadows: true,
    alpha: false,
    shadowMapType: Three.BasicShadowMap,
    outputColorSpace: Three.SRGBColorSpace,
    toneMapping: Three.NoToneMapping,
  };

  const texture = ref({});

  onLoop(() => {
    if (globeRef.value) {
      globeRef.value.rotation.y += 0.005;
    }
  });

  onMounted(async () => {
    texture.value = await useTexture({
      map: '/texture/world.jpeg',
      normalMap: '/texture/world_normal.jpg',
    });
  });
</script>

<style scoped>
  @import '/src/assets/style/pane.css';

  .container {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
