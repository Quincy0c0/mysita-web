<template>
  <div class="container">
    <TresCanvas v-bind="gl">
      <TresPerspectiveCamera
        :position="[0, 12, 12]"
        :look-at="[0, 0, 0]" />
      <OrbitControls />
      <TresGridHelper :args="[20, 20]" />

      <Html
        v-bind="htmlProps"
        transform
        sprite
        :position="[0, 5, -5]"
        :occlude="[torusRef]">
        <div class="html-in-three">
          <p>Hellow World!</p>
        </div>
      </Html>

      <TresMesh
        :position="[0, 3, 0]"
        ref="torusRef">
        <TresTorusGeometry :args="[1, 0.4, 16, 100]" />
        <TresMeshStandardMaterial
          v-bind="standardProps"
          ref="standardMaterialRef" />
        <Html
          v-bind="htmlProps"
          transform
          :position="[0, -1, 1]">
          <div class="html-in-three">
            <p>Torus ⭕️</p>
          </div>
        </Html>
      </TresMesh>

      <TresMesh
        :position="[6, 3, 0]"
        ref="boxRef">
        <TresBoxGeometry :args="[2, 2, 2]" />
        <TresMeshStandardMaterial v-bind="standardProps" />

        <Html
          v-bind="htmlProps"
          transform
          :position="[0, 1, 1]"
          :occlude="[torusRef]">
          <div class="html-in-three">
            <p>Box 📦</p>
          </div>
        </Html>
      </TresMesh>

      <TresMesh :position="[-6, 3, 0]">
        <TresSphereGeometry :args="[1]" />
        <TresMeshStandardMaterial v-bind="standardProps" />

        <Html
          v-bind="htmlProps"
          transform
          sprite
          :position="[0, 0, 0]">
          <div class="html-in-three">
            <p>Sphere 🌍</p>
          </div>
        </Html>
      </TresMesh>
      <TresDirectionalLight :intensity="3" />
      <TresAmbientLight :intensity="8" />
    </TresCanvas>
  </div>
</template>

<script setup>
  import LapTop from './models/LaptopModel.vue';

  import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three';
  import { OrbitControls, Html } from '@tresjs/cientos';
  import { shallowReactive, ref } from 'vue';

  const torusRef = ref(null);
  const boxRef = ref(null);

  const gl = {
    clearColor: '#fff2f5',
    shadows: true,
    alpha: false,
    shadowMapType: BasicShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
  };

  const standardProps = shallowReactive({
    metalness: 0.5,
    roughness: 0.2,
    color: '#c58796',
  });

  const htmlProps = shallowReactive({
    wrapperClass: 'wrapper',
    as: 'div',
    center: true,
  });
</script>

<style scoped>
  @import '@/assets/style/pane.css';

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
</style>
