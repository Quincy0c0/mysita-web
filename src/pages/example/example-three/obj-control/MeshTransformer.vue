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
      <OrbitControls make-default />

      <TransformControls
        v-if="transformRef"
        :object="transformRef"
        v-bind="controlsState" />

      <TresGridHelper :args="[10, 10]" />

      <TresMesh
        ref="torusRef"
        @click="changeSelected(torusRef)"
        cast-shadow
        receive-shadow>
        <TresTorusGeometry :args="[1, 0.4, 16, 100]" />
        <TresMeshStandardMaterial
          v-bind="standardProps"
          ref="standardMaterialRef" />
      </TresMesh>

      <TresMesh
        ref="boxRef"
        :position="[3, 0, 0]"
        @click="changeSelected(boxRef)"
        cast-shadow
        receive-shadow>
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial v-bind="standardProps" />
      </TresMesh>

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
  import { OrbitControls, TransformControls, Box } from '@tresjs/cientos';
  import { ref, onMounted, shallowReactive, reactive } from 'vue';
  import * as Three from 'three';
  import { Pane } from 'tweakpane';

  const context = ref();
  const paneRef = ref();

  const torusRef = ref();
  const boxRef = ref();
  const transformRef = ref();

  const gl = {
    clearColor: '#817175',
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

  const controlsState = reactive({
    mode: 'translate',
    enabled: true,
    space: 'world',
    axis: 'XYZ',
    size: 1,
    showX: true,
    showY: true,
    showZ: true,
  });

  const changeSelected = (object) => {
    transformRef.value = object;
  };

  const pane = ref();

  const initPane = () => {
    pane.value = new Pane({
      container: paneRef.value,
    });

    const controlsFolder = pane.value.addFolder({
      title: '控制器设置',
    });

    controlsFolder
      .addBlade({
        view: 'list',
        label: '模式',
        options: [
          { text: '移动', value: 'translate' },
          { text: '旋转', value: 'rotate' },
          { text: '缩放', value: 'scale' },
        ],
        value: controlsState.mode,
      })
      .on('change', (e) => {
        controlsState.mode = e.value;
      });

    controlsFolder
      .addBlade({
        label: '控制器大小',
        view: 'slider',
        min: 0.1,
        max: 10,
        value: 1,
      })
      .on('change', (e) => {
        controlsState.size = e.value;
      });

    controlsFolder
      .addBlade({
        view: 'list',
        label: '坐标系',
        options: [
          { text: '世界坐标', value: 'world' },
          { text: '本地坐标', value: 'local' },
        ],
        value: controlsState.space,
      })
      .on('change', (e) => {
        controlsState.space = e.value;
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
  };

  onMounted(() => {
    initPane();
  });
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
