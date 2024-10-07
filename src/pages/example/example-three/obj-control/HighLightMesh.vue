<template>
  <div class="container">
    <TresCanvas v-bind="gl">
      <TresPerspectiveCamera
        :position="[8, 8, 8]"
        :look-at="[0, 0, 0]" />
      <OrbitControls />

      <template v-for="x in [-3, 0, 3]">
        <template v-for="y in [-3, 0, 3]">
          <TresMesh
            v-for="z in [-3, 0, 3]"
            :key="`${[x, y, z]}`"
            :position="[x, y, z]"
            @click="onClick"
            @pointer-enter="onPointerEnter"
            @pointer-leave="onPointerLeave">
            <TresSphereGeometry :args="[0.75, 32, 32]" />
            <TresMeshToonMaterial color="#36b8f2" />
          </TresMesh>
        </template>
      </template>
      <TresDirectionalLight :intensity="1" />
      <TresAmbientLight :intensity="1" />
    </TresCanvas>
  </div>
</template>

<script setup>
  import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three';
  import { OrbitControls } from '@tresjs/cientos';
  import { ref } from 'vue';

  const gl = {
    clearColor: '#fff2f5',
    shadows: true,
    alpha: false,
    shadowMapType: BasicShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
  };

  const clickedColors = ref({});

  const paneRef = ref(null);

  const onClick = (ev) => {
    if (ev) {
      clickedColors.value[ev.object.uuid] = '#fcc423';
      ev.object.material.color.set(clickedColors.value[ev.object.uuid]);
    }
    console.log(clickedColors);
  };

  const onPointerEnter = (ev) => {
    if (ev) {
      if (!clickedColors.value[ev.object.uuid]) {
        ev.object.material.color.set('#00ff00');
      }
    }
  };

  const onPointerLeave = (ev) => {
    if (ev && !clickedColors.value[ev.object.uuid]) {
      ev.object.material.color.set('#36b8f2');
    }
  };
</script>

<style scoped>
  @import '@/assets/style/pane.css';

  .container {
    width: 100%;
    height: 100%;
  }
</style>
