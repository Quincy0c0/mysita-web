<template>
  <primitive :object="nodes.Macbook">
    <Html
      transform
      wrapper-class="webpage"
      :distance-factor="6"
      :position="[0, 10.5, -13.6]"
      occlude
      :rotation-x="-0.256">
      <iframe
        class="iframe"
        :src="webUrl"
        frameborder="0" />
    </Html>
  </primitive>
</template>

<script setup>
  import { Html, useGLTF } from '@tresjs/cientos';

  const { webUrl } = defineProps(['webUrl']);

  const { nodes } = await useGLTF('/models/model.gltf', {
    draco: true,
    decoderPath: '/draco/',
  });
</script>
<style scoped>
  @import '@/assets/style/pane.css';

  .iframe {
    width: 1920px;
    height: 1200px;
    background-color: #fff;
  }
</style>
