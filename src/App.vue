<template>
  <div class="app">
    <header>
      <div class="leftHeader">
        <div
          class="menu"
          v-for="item in MenuList"
          :key="item.key"
          :class="selectedMenu === item.key ? 'active' : ''"
          @click="toPage(item.path, item.key)">
          {{ item.name }}
        </div>
      </div>
      <div class="rightHeader">
        <i
          class="iconfont icon-github"
          style="font-size: 25px"
          @click="toGitHub"></i>
      </div>
    </header>
    <main><router-view></router-view></main>
    <footer>宁ICP备2024005901号</footer>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useHomeStore } from './stores/home';

  const homeStore = useHomeStore();
  const { selectedMenu } = storeToRefs(homeStore);
  const router = useRouter();

  const MenuList = ref([
    {
      name: 'Mystia',
      path: '/',
      key: 'home',
    },
    {
      name: '案例展示',
      path: '/example',
      key: 'example',
    },
    {
      name: '关于',
      path: '/about',
      key: 'about',
    },
  ]);

  const activeMenu = ref('home');

  const toPage = (path, key) => {
    selectedMenu.value = key;
    router.push(path);
  };

  const toGitHub = () => {
    window.open('https://github.com/Quincy0c0');
  };

  onMounted(() => {
    let path = window.location.pathname;
    path = path.match(/\/\w+/)[0];
    console.log(path);
    MenuList.value.map((item) => {
      if (item.path === path) {
        selectedMenu.value = item.key;
      }
    });
  });
</script>
<style scoped>
  @import url('./assets/style/icon.css');

  .app {
    width: 100%;
    height: auto;
    background-color: #f5f5f5;
  }
  header {
    position: relative;
    display: flex;
    margin: 20px;
    padding: 10px;
    background-color: rgba(255, 181, 195, 0.425);
    font-family: 'PingFang SC';
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.05em;
    box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    z-index: 10;
  }

  .menu {
    margin: 0 10px;
    padding: 10px 20px;
    cursor: pointer;
    color: rgb(133, 112, 117);
    padding: 10px;
    border-radius: 10px;
  }
  .leftHeader {
    flex: 1;
    display: flex;
  }

  .rightHeader {
    display: flex;
    align-items: center;
  }

  .rightHeader i {
    margin: 0 10px;
    cursor: pointer;
  }

  .menu:hover {
    background-color: rgb(241, 154, 174);
    color: rgb(133, 112, 117);
    border-radius: 10px;
    animation: hoverBtnAnime 0.3s ease-in-out;
  }

  @keyframes hoverBtnAnime {
    0% {
      color: rgb(133, 112, 117);
      background-color: rgb(255, 181, 195, 0.425);
    }
    50% {
    }
    100% {
      color: rgb(133, 112, 117);
      background-color: rgb(241, 154, 174);
    }
  }

  @keyframes ActiveBtnAnime {
    0% {
      transform: scale(1);
      color: rgb(133, 112, 117);
      background-color: rgb(255, 181, 195, 0.425);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      color: rgb(249, 223, 227);
      background-color: rgb(133, 112, 117);
    }
  }

  .active {
    background-color: rgb(133, 112, 117);
    color: rgb(249, 223, 227);
    border-radius: 10px;
    animation: ActiveBtnAnime 0.3s ease-in-out;
  }

  main {
    margin: 0 30px;
    padding: 10px;
    font-family: 'PingFang SC';
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0.05em;

    background-color: rgb(255, 242, 245);
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 15px 15px;
    transform: translateY(-25px);
    z-index: 1;
  }

  footer {
    margin: 20px;
    padding: 10px;
    font-family: 'PingFang SC';
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-align: center;
  }
</style>
