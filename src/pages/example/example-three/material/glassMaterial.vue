<template>
  <div class="container">
    <TresCanvas
      v-bind="gl"
      ref="context">
      <TresPerspectiveCamera :position="[6, 5.0, 7.0]" />
      <OrbitControls />
      <TresGridHelper :args="[10, 10]" />

      <TresMesh
        :position="[0, 0, -1]"
        cast-shadow>
        <TresPlaneGeometry :args="[10, 10]" />
        <TresMeshBasicMaterial
          color="#f9dae0"
          :side="DoubleSide" />
      </TresMesh>

      <TresMesh
        :position="[0, -2, 0]"
        :rotation="[-Math.PI / 2, 0, 0]"
        receive-shadow>
        <TresPlaneGeometry :args="[20, 20, 20, 20]" />
        <TresMeshToonMaterial color="#82DBC5" />
      </TresMesh>

      <TresMesh>
        <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
        <MeshGlassMaterial ref="glassMaterialRef" />
      </TresMesh>

      <Box
        cast-shadow
        ref="boxRef"
        :args="[1, 1, 1]"
        :position="[0, 3, 0]" />

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
  import { OrbitControls, MeshGlassMaterial, Box } from '@tresjs/cientos';
  import {
    BasicShadowMap,
    SRGBColorSpace,
    NoToneMapping,
    DoubleSide,
  } from 'three';

  import { shallowRef, watch, ref } from 'vue';

  const glassMaterialRef = shallowRef();
  const boxRef = shallowRef();
  const context = ref();


  const gl = {
    clearColor: '#fff2f5',
    shadows: true,
    alpha: false,
    shadowMapType: BasicShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
  };

  watch(glassMaterialRef, (value) => {
    boxRef.value.instance.material.dispose();
    boxRef.value.instance.material = value.instance;
  });
</script>

<style>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
