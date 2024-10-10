<template>
  <div class="container">
    <div
      ref="paneRef"
      class="pane"></div>

    <TresCanvas v-bind="gl">
      <TresPerspectiveCamera
        :position="[5, 5, 5]"
        :fov="45"
        :near="0.1"
        :far="1000"
        :look-at="[0, 0, 0]" />
      <OrbitControls />
      <TresAmbientLight :intensity="0.5" />
      <TresPoints :position="[-size * 0.5, -size * 0.5, -size * 0.5]">
        <TresBufferGeometry
          :position="[positionArray, 3]"
          :a-scale="[scaleArray, 1]" />
        <TresShaderMaterial v-bind="shader" />
      </TresPoints>
      <TresDirectionalLight
        :position="[0, 2, 4]"
        :intensity="1"
        cast-shadow />

      <TresGridHelper />
    </TresCanvas>
  </div>
</template>

<script setup>
  import { OrbitControls } from '@tresjs/cientos';
  import { useRenderLoop } from '@tresjs/core';
  import { AdditiveBlending } from 'three';
  import { ref, watch, onMounted, reactive } from 'vue';
  import { Pane } from 'tweakpane';

  const { onLoop } = useRenderLoop();

  const pane = ref();
  const paneRef = ref();

  const gl = reactive({
    clearColor: 'black',
    shadows: true,
    alpha: false,
  });

  const shader = {
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,

    vertexShader: `
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uTime;
  attribute float aScale;

  void main()
  {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;

      gl_Position = projectionPosition;
      gl_PointSize = aScale * uSize * uPixelRatio;
      gl_PointSize *= (1.0 / - viewPosition.z);
  }
  `,
    fragmentShader: `
  void main()
    {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float strength = 0.05 / distanceToCenter - 0.1;

      gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
    }
  `,
    uniforms: {
      uSize: { value: 100 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uTime: { value: 0 },
    },
  };

  const firefliesCount = ref(6000);
  const positionArray = ref(null);
  const scaleArray = ref(null);
  const size = ref(10);
  const speed = ref(1);

  watch(
    firefliesCount,
    (val) => {
      positionArray.value = new Float32Array(val * 3);
      scaleArray.value = new Float32Array(val);

      for (let i = 0; i < val; i++) {
        positionArray.value[i * 3 + 0] = Math.random() * size.value;
        positionArray.value[i * 3 + 1] = Math.random() * size.value;
        positionArray.value[i * 3 + 2] = Math.random() * size.value;
        scaleArray.value[i] = Math.random();
      }
    },
    {
      immediate: true,
    }
  );

  const initPane = () => {
    pane.value = new Pane({
      container: paneRef.value,
    });

    pane.value
      .addBlade({
        view: 'slider',
        label: '粒子数量',
        min: 0,
        max: 10000,
        value: firefliesCount.value,
      })
      .on('change', (e) => {
        firefliesCount.value = e.value;
      });

    pane.value
      .addBlade({
        view: 'slider',
        label: '粒子速度',
        min: 0,
        max: 10,
        value: speed.value,
      })
      .on('change', (e) => {
        speed.value = e.value;
      });
  };

  onLoop(({ elapsed }) => {
    shader.uniforms.uTime.value = elapsed * speed.value;
  });

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
