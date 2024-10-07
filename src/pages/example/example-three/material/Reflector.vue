<template>
  <div class="container">
    <div
      ref="paneRef"
      class="pane"></div>
    <TresCanvas
      shadows
      v-bind="gl"
      ref="context">
      <TresPerspectiveCamera :position="[6, 5.0, 7.0]" />
      <OrbitControls />
      <TresGridHelper :args="[10, 10]" />

      <TresMesh
        receive-shadow
        :position="[0, -4, 0]"
        :rotation="[-Math.PI / 2, 0, 0]">
        <TresPlaneGeometry :args="[20, 20, 20, 20]" />
        <TresMeshToonMaterial color="#82DBC5" />
      </TresMesh>

      <TresMesh
        cast-shadow
        receive-shadow>
        <TresTorusGeometry :args="[1, 0.4, 16, 100]" />
        <TresMeshStandardMaterial
          v-bind="standardProps"
          ref="standardMaterialRef" />
      </TresMesh>

      <Box
        :position="[0, 3, 1]"
        cast-shadow>
        <TresMeshStandardMaterial v-bind="standardProps" />
      </Box>

      <Reflector v-bind="reflectorProps">
        <TresPlaneGeometry :args="[10, 10, 10, 10]" />
      </Reflector>

      <Reflector
        cast-shadow
        color="#82DBC5"
        :position="[0, 3, -1]"
        textureWidth="1024"
        textureHeight="1024">
        <TresSphereGeometry :args="[1, 32, 32]" />
      </Reflector>

      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight
        cast-shadow
        :intensity="10"
        :position="[2, 5, 2]" />
    </TresCanvas>
  </div>
</template>

<script setup>
  import { TresCanvas } from '@tresjs/core';
  import { OrbitControls, Reflector, Box } from '@tresjs/cientos';
  import { ref, onMounted, shallowReactive } from 'vue';
  import * as Three from 'three';
  import { Pane } from 'tweakpane';

  const context = ref();
  const paneRef = ref();

  const gl = {
    clearColor: '#fff2f5',
    shadows: true,
    alpha: false,
    shadowMapType: Three.BasicShadowMap,
    outputColorSpace: Three.SRGBColorSpace,
    toneMapping: Three.NoToneMapping,
  };

  const standardProps = shallowReactive({
    metalness: 0.5,
    roughness: 0.2,
    color: '#f19aae',
  });

  const reflectorProps = shallowReactive({
    color: '#e5ffff',
    textureWidth: '1024',
    textureHeight: '1024',
    position: [0, 0, -3],
  });

  const pane = ref();

  const initPane = () => {
    pane.value = new Pane({
      container: paneRef.value,
    });

    const standardFloder = pane.value.addFolder({
      title: '物体',
    });

    standardFloder.addBinding(standardProps, 'color', {
      label: '物体颜色',
    });

    standardFloder.addBinding(standardProps, 'metalness', {
      label: '金属度',
      min: 0,
      max: 1,
    });

    standardFloder.addBinding(standardProps, 'roughness', {
      label: '粗糙度',
      min: 0,
      max: 1,
    });

    const reflectorFloder = pane.value.addFolder({
      title: '反射',
    });

    reflectorFloder.addBinding(reflectorProps, 'color', {
      label: '颜色',
    });
  };

  onMounted(() => {
    initPane();
  });
</script>

<style>
  @import '@/assets/style/pane.css';

  .container {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
