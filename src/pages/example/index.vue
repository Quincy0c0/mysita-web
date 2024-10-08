<template>
  <div class="example-page">
    <div class="left-guider">
      <el-menu
        background-color="#fff2f5"
        default-active="1-1"
        text-color="#817175"
        active-text-color="#817175"
        :default-openeds="['1', '2']"
        popper-effect="dark">
        <el-sub-menu
          v-for="item in leftGuiderList"
          :key="item.key"
          :index="item.index">
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.key"
            :index="child.index"
            @click="toExample(child.path, child.name)"
            :style="
              activeItem === child.name ? 'background-color:#f1c6ce ;' : ''
            ">
            <img
              :src="child.src"
              class="logo" />
            {{ child.name }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <main>
      <router-view style="width: 100%; height: 100%"></router-view>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const activeItem = ref();

  const toExample = (path, name) => {
    router.push(path);
    activeItem.value = name;
  };

  const leftGuiderList = ref([
    {
      key: 'example_1',
      name: '地图',
      index: '1',
      children: [
        {
          index: '1-1',
          name: 'OpenLayers',
          key: 'example_1_1',
          path: '/example/openlayers',
          src: '/src/assets/icons/openlayers.svg',
        },
        {
          index: '1-2',
          name: 'Mapbox',
          key: 'example_1_2',
          path: '/example/mapbox',
          src: '/src/assets/icons/mapbox.svg',
        },
        {
          index: '1-3',
          name: 'Cesium',
          key: 'example_1_3',
          path: '/example/cesium',
          src: '/src/assets/icons/cesium.svg',
        },
      ],
    },
    {
      key: 'example_2',
      index: '2',
      name: 'Three.js',
      children: [
        {
          index: '2-1',
          name: '材质',
          key: 'example_2_1',
          path: '/example/three-material',
        },
        {
          index: '2-2',
          name: '物体交互',
          key: 'example_2_2',
          path: '/example/three-interaction',
        },
        { index: '2-3', name: '粒子效果', key: 'example_2_3', path: '' },
      ],
    },
  ]);

  onMounted(() => {
    let path = window.location.pathname;
  });
</script>
<style scoped>
  .example-page {
    width: 100%;
    display: flex;
  }

  .left-guider {
    width: 15%;
  }
  main {
    width: 85%;
    height: auto;
    padding: 10px;
    border-radius: 15px;
  }

  .logo {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
</style>
