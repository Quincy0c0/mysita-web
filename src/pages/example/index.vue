<template>
  <div class="example-page">
    <div class="left-guider">
      <el-menu
        background-color="#fff2f5"
        text-color="#947075">
        <el-sub-menu
          v-for="item in leftGuiderList"
          :key="item.key"
          :index="item.index">
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.id"
            :index="child.index"
            @click="toExample(child.path)">
            {{ child.name }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <main><router-view style="width: 100%; height: 100%"></router-view></main>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();

  const toExample = (path) => {
    console.log(path);
    router.push(path);
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
        },
        {
          index: '1-2',
          name: 'Mapbox',
          key: 'example_1_2',
          path: '/example/mapbox',
        },
        {
          index: '1-3',
          name: 'Cesium',
          key: 'example_1_3',
          path: '/example/cesium',
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
          path: '/example/three-basic',
        },
        { index: '2-2', name: '物体交互', key: 'example_2_2', path: '' },
        { index: '2-3', name: '效果', key: 'example_2_3', path: '' },
      ],
    },
  ]);
</script>
<style scoped>
  .example-page {
    width: 100%;
    display: flex;
  }

  .left-guider {
    width: 200px;
  }
  main {
    width: calc(100% - 200px);
    height: auto;
    padding: 10px;
    border-radius: 15px;
  }
</style>
