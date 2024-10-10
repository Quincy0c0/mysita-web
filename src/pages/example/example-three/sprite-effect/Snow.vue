<template>
  <div class="container">
    <TresCanvas v-bind="gl">
      <TresPerspectiveCamera
        :position="[5, 5, 5]"
        :fov="45"
        :near="0.1"
        :far="1000"
        :look-at="[0, 0, 0]" />
      <OrbitControls />
      <TresAmbientLight :intensity="0.5" />

      <primitive :object="particleSystem" />

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
  import * as THREE from 'three';
  import { reactive } from 'vue';

  const { onLoop } = useRenderLoop();

  const gl = reactive({
    clearColor: 'black',
    shadows: true,
    alpha: false,
  });

  // 定义雪花的数量
  const snowNumbers = 1000;
  const snowSize = 0.8;
  const snowOpacity = 0.8;
  const snowColor = '#ffffff';

  // 创建一个缓冲几何体，用于存储粒子的位置
  const particles = new THREE.BufferGeometry();

  // 创建一个浮点型数组，用于存储每个粒子的三维坐标（x, y, z）
  const buffer = new Float32Array(snowNumbers * 3);

  // 创建一个浮点型数组，用于存储每个粒子的纹理索引
  const textureIndices = new Float32Array(snowNumbers);

  // 创建一个浮点型数组，用于存储每个粒子的 UV 坐标（用于纹理映射）
  const uvs = new Float32Array(snowNumbers * 2);

  // 预加载雪花纹理
  const textures = [
    new THREE.TextureLoader().load('/src/assets/texture/snowflake1_t.png'),
    new THREE.TextureLoader().load('/src/assets/texture/snowflake2_t.png'),
    new THREE.TextureLoader().load('/src/assets/texture/snowflake3_t.png'),
    new THREE.TextureLoader().load('/src/assets/texture/snowflake4_t.png'),
  ];
  for (let i = 0, l = snowNumbers; i < l; i++) {
    const x = Math.random() * 20 - 10; // 随机生成x坐标
    const y = Math.random() * 20 - 10; // 随机生成y坐标
    const z = Math.random() * 20 - 10; // 随机生成z坐标
    buffer[i * 3] = x;
    buffer[i * 3 + 1] = y;
    buffer[i * 3 + 2] = z;

    // 随机选择一个纹理索引
    textureIndices[i] = Math.floor(Math.random() * textures.length);
  }

  // 将位置属性添加到粒子几何体中
  particles.setAttribute('position', new THREE.BufferAttribute(buffer, 3));

  // 将纹理索引属性添加到粒子几何体中
  particles.setAttribute(
    'textureIndex',
    new THREE.BufferAttribute(textureIndices, 1)
  );

  // 将UV属性添加到粒子几何体中
  particles.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      textures: { value: textures }, // 传入预加载的纹理数组
      opacity: { value: snowOpacity }, // 设置初始透明度
      color: { value: new THREE.Color(snowColor) }, // 设置雪花颜色为白色
      size: { value: snowSize }, // 设置雪花的初始大小
    },
    vertexShader: `
    attribute float textureIndex; // 纹理索引属性
    varying float vTextureIndex; // 传递到片段着色器的变量
    uniform float size; // 雪花大小的 uniform

    void main() {
      vTextureIndex = textureIndex; // 将纹理索引传递给片段着色器

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = size * (300.0 / -mvPosition.z); // 根据深度调整点的大小
    }
  `,
    fragmentShader: `
    uniform sampler2D textures[4]; // 传入的纹理数组
    uniform float opacity; // 透明度 uniform
    uniform vec3 color; // 颜色 uniform
    varying float vTextureIndex; // 从顶点着色器接收的纹理索引

    void main() {
      vec4 texColor;
      if (int(vTextureIndex) == 0) {
        texColor = texture2D(textures[0], gl_PointCoord);
      } else if (int(vTextureIndex) == 1) {
        texColor = texture2D(textures[1], gl_PointCoord);
      } else if (int(vTextureIndex) == 2) {
        texColor = texture2D(textures[2], gl_PointCoord);
      } else {
        texColor = texture2D(textures[3], gl_PointCoord);
      }

      texColor.rgb *= color; // 乘以 uniform 颜色，调整雪花颜色
      texColor.a *= opacity; // 调整透明度

      // 处理透明度，避免黑边
      if (texColor.a < 0.5) discard;

      gl_FragColor = texColor; // 输出最终颜色
    }
  `,
    transparent: true, // 使材质透明
    depthWrite: false, // 禁用深度写入，避免遮挡
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);

  onLoop(() => {
    let positions = particleSystem.geometry.attributes.position.array;

    // 更新每个粒子的坐标
    for (var i = 0; i < positions.length; i += 3) {
      positions[i + 3] -= 0.01; // Z 轴向下移动
      positions[i + 1] -= 0.01; // Y 轴向下移动
      if (positions[i + 1] < -10) {
        positions[i + 1] = 10; // 重新设置 Y 轴坐标
      }
      if (positions[i + 3] < -10) {
        positions[i + 3] = 10; // 重新设置 Z 轴坐标
      }
    }

    // 标记位置属性需要更新
    particleSystem.geometry.attributes.position.needsUpdate = true;
  });
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
