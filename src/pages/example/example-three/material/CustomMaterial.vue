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

      <TresMesh>
        <TresSphereGeometry :args="[1, 32, 32]" />
        <CustomShaderMaterial v-bind="materialProps"></CustomShaderMaterial>
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
  import { TresCanvas, useRenderLoop } from '@tresjs/core';
  import { OrbitControls, CustomShaderMaterial } from '@tresjs/cientos';
  import { ref, onMounted, shallowReactive, nextTick, watch } from 'vue';
  import * as Three from 'three';
  import { Pane } from 'tweakpane';

  const { onLoop } = useRenderLoop();

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

  const uniforms = shallowReactive({
    Time: 2,
    WobbleSpeed: 1,
    WobbleAmplitude: 0.03,
    WobbleFrequency: 20,
  });
  console.log(uniforms.Time);

  const materialProps = shallowReactive({
    baseMaterial: Three.MeshBasicMaterial,
    fragmentShader: `
      varying float vWobble;

      void main() {
        float wobble = vWobble * 0.5 + 0.5;
        csm_FragColor = mix(vec4(0.1, 0.6, 0.7, 1.0), vec4(0.2, 0.8, 0.9, 1.0), wobble);
      }
    `,
    vertexShader: `
      uniform float u_Time;
      uniform float u_WobbleSpeed;
      uniform float u_WobbleAmplitude;
      uniform float u_WobbleFrequency;

      varying float vWobble;

      void main() {
        float wobble = sin(csm_Position.z * u_WobbleFrequency + u_Time * u_WobbleSpeed);
        csm_Position += normal * wobble * u_WobbleAmplitude;

        vWobble = wobble;
      }
    `,
    uniforms: {
      u_Time: { value: 2 },
      u_WobbleSpeed: { value: 1 },
      u_WobbleAmplitude: { value: 0.03 },
      u_WobbleFrequency: { value: 20 },
    },
  });

  watch(
    uniforms,
    (val) => {
      materialProps.uniforms.u_Time.value = val.Time;
      materialProps.uniforms.u_WobbleSpeed.value = val.WobbleSpeed;
      materialProps.uniforms.u_WobbleAmplitude.value = val.WobbleAmplitude;
      materialProps.uniforms.u_WobbleFrequency.value = val.WobbleFrequency;
    },
    {
      deep: true,
    }
  );

  const pane = ref();

  const initPane = () => {
    pane.value = new Pane({
      container: paneRef.value,
      expanded: true,
    });

    pane.value.addBinding(uniforms, 'Time', {
      min: 0,
      max: 10,
      step: 0.01,
    });

    pane.value.addBinding(uniforms, 'WobbleSpeed', {
      min: 0,
      max: 10,
      step: 0.01,
    });

    pane.value.addBinding(uniforms, 'WobbleAmplitude', {
      min: 0,
      max: 0.1,
      step: 0.001,
    });

    pane.value.addBinding(uniforms, 'WobbleFrequency', {
      min: 0,
      max: 100,
      step: 0.01,
    });
  };

  onMounted(async () => {
    initPane();
    await nextTick();
    onLoop(() => {
      materialProps.uniforms.u_Time.value +=
        0.01 * materialProps.uniforms.u_WobbleSpeed.value;
    });
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
