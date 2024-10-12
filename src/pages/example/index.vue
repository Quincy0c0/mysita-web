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
  import { useExampleStore } from '/src/stores/example.js';
  import { storeToRefs } from 'pinia';

  const { selectedExample, allExampleList } = storeToRefs(useExampleStore());
  const { findKeyOrNameWithParentInfo } = useExampleStore();

  const router = useRouter();
  const activeItem = ref();

  const toExample = (path, name) => {
    router.push(path);
    activeItem.value = name;
  };

  const leftGuiderList = ref([
    {
      key: 'map',
      name: '地图',
      index: '1',
      children: [
        {
          index: '1-1',
          name: 'OpenLayers',
          key: 'openlayers',
          path: '/example/openlayers',
          src: '/src/assets/icons/openlayers.svg',
        },
        {
          index: '1-2',
          name: 'Mapbox',
          key: 'mapbox',
          path: '/example/mapbox',
          src: '/src/assets/icons/mapbox.svg',
        },
        {
          index: '1-3',
          name: 'Cesium',
          key: 'cesium',
          path: '/example/cesium',
          src: '/src/assets/icons/cesium.svg',
        },
      ],
    },
    {
      key: 'three',
      index: '2',
      name: 'Three.js',
      children: [
        {
          index: '2-1',
          name: '材质',
          key: 'three-material',
          path: '/example/three-material',
        },
        {
          index: '2-2',
          name: '物体交互',
          key: 'obj-control',
          path: '/example/obj-control',
        },
        {
          index: '2-3',
          name: '粒子效果',
          key: 'sprite-effect',
          path: '/example/sprite-effect',
        },
      ],
    },
  ]);

  onMounted(() => {
    const targetKey = selectedExample.value.key;
    const foundItemsByKey = findKeyOrNameWithParentInfo(
      allExampleList.value,
      targetKey,
      'key'
    );

    if (foundItemsByKey.length > 0) {
      router.push(`/example/${foundItemsByKey[0].child}`);
    }
  });
</script>
<style scoped>
  .example-page {
    width: 100%;
    display: flex;
  }

  .left-guider {
    width: 15%;
    animation: guider 0.5s ease-in-out forwards;
  }

  @keyframes guider {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
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
