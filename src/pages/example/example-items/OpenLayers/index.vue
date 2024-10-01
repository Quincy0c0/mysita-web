<template>
  <div>
    <div class="example-list">
      <div
        class="example-item"
        v-for="item in exampleList"
        :key="item.key"
        @click="selectedExample = item.key"
        :class="item.key === selectedExample ? 'selected' : ''">
        <img :src="item.img" />
        <span>{{ item.name }}</span>
      </div>
      <p class="example-desc">更多案例正在开发中···</p>
    </div>
    <div class="show-window">
      <span v-if="!selectedExample">选择一个示例以展示</span>
      <BasicMap v-if="selectedExample === 'basic_map'" />
      <div
        class="example-code-link"
        @click="openLink">
        <i class="iconfont icon-code"></i>
        <span>查看源码</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import BasicMap from './BasicMap.vue';

  const selectedExample = ref('');

  const exampleList = ref([
    {
      name: '基础地图加载',
      img: '',
      key: 'basic_map',
      src: 'https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=0cf416af893d04d5a9f77ea5e49029ff',
    },
  ]);

  const openLink = () => {
    exampleList.value.map((item) => {
      if (item.key === selectedExample.value) {
        if (item.src) {
          window.open(item.src, '_blank');
        }
      }
    });
  };
</script>
<style scoped>
  @import '/src/assets//style/icon.css';

  .show-window {
    position: relative;
    width: 100%;
    height: 600px;
    border-radius: 15px;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .show-window span {
    color: rgb(249, 223, 227);
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .example-list {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: rgb(133, 112, 117);
    overflow-x: auto;
  }
  .example-item {
    width: 210px;
    height: 175px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
    background-color: transparent;
    border: 2px solid rgba(133, 112, 117, 0.3);
    margin: 0 10px;
  }

  @keyframes example-item-hover {
    0% {
      background-color: transparent;
    }
    100% {
      background-color: rgb(241, 154, 174);
    }
  }
  .example-item:hover {
    background-color: rgb(241, 154, 174);
    color: rgb(133, 112, 117);
    animation: example-item-hover 0.3s ease-in-out;
    border: 2px solid rgb(249, 223, 227);
  }
  .example-item img {
    padding: 10px 10px 0px 10px;
    width: 210px;
    height: 160px;
    border-radius: 15px;
  }
  .example-item span {
    font-size: 14px;
  }
  .selected {
    background-color: rgb(133, 112, 117);
    color: rgb(249, 223, 227);
  }

  .example-code-link {
    padding: 10px;
    display: flex;
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: rgb(249, 223, 227);
    background-color: rgba(133, 112, 117, 0.7);
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .example-code-link i {
    font-size: 20px;
    margin-right: 5px;
  }

  .example-code-link span {
    font-size: 14px;
  }
  .example-code-link:hover {
    color: rgb(133, 112, 117);
    background-color: rgba(241, 154, 174);
    cursor: pointer;
    animation: example-item-hover 0.3s ease-in-out;
  }

  .example-code-link:hover span {
    color: rgb(133, 112, 117);
  }

  .example-desc {
    width: 210px;
    height: 175px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
    background-color: transparent;
    border: 2px solid rgba(133, 112, 117, 0.3);
    margin: 0 10px;
    font-size: 12px;
  }
  .example-desc:hover {
    background-color: rgb(241, 154, 174);
    color: rgb(133, 112, 117);
    animation: example-item-hover 0.3s ease-in-out;
    border: 2px solid rgb(249, 223, 227);
  }
</style>
