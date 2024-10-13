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

        <div
          class="search"
          v-show="searchShow">
          <el-icon
            class="searchIcon"
            @click="toSearch"
            ><Search
          /></el-icon>
          <input
            type="text"
            placeholder="搜索"
            v-model="inputVal" />
          <ul
            class="searchResult"
            v-show="resultShow">
            <li
              v-for="item in searchResult"
              :key="item.key"
              @click="toSearchResult(item)">
              {{ item.example.name }}
            </li>
          </ul>
        </div>
      </div>

      <div class="rightHeader">
        <i
          class="iconfont icon-gitee"
          style="font-size: 25px"
          @click="toGitee"></i>
        <i
          class="iconfont icon-github"
          style="font-size: 25px"
          @click="toGitHub"></i>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <div>
        <span>Copyright © 2024 All rights reserved. Mystia</span>
        <span
          class="ICP"
          @click="goGov">
          宁ICP备2024005901号
        </span>
      </div>
      <div class="contact">
        <div style="width: 300px">联系邮箱：wuxiao_18095178410@163.com</div>
        <div class="wexin">
          <img src="/public/img/others/image.png" />
          <p>个人微信</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useHomeStore } from './stores/home';
  import { useExampleStore } from './stores/example';

  const homeStore = useHomeStore();
  const { selectedMenu } = storeToRefs(homeStore);
  const { selectedExample, allExampleList } = storeToRefs(useExampleStore());
  const { findItemsByNameContains, findChildrenOfClass } = useExampleStore();
  const router = useRouter();

  const searchShow = ref(false);
  const inputVal = ref('');
  const searchResult = ref([]);
  const resultShow = ref(false);

  const MenuList = ref([
    {
      name: 'Mystia',
      path: '/',
      key: 'home',
    },
    {
      name: '展示',
      path: '/example',
      key: 'example',
    },
    {
      name: '关于',
      path: '/about',
      key: 'about',
    },
  ]);

  watch(
    selectedMenu,
    (val) => {
      if (val === 'example') {
        searchShow.value = true;
      } else {
        searchShow.value = false;
      }
    },
    {
      immediate: true,
    }
  );

  watch(inputVal, (val) => {
    toSearch();
  });

  const toSearch = () => {
    if (inputVal.value) {
      const NameFind = findItemsByNameContains(
        allExampleList.value,
        inputVal.value
      );
      console.log(NameFind);

      if (NameFind.length > 0) {
        resultShow.value = true;
        searchResult.value = NameFind;
      } else {
        resultShow.value = false;
      }
    } else {
      resultShow.value = false;
    }
  };

  const toSearchResult = (item) => {
    selectedExample.value = item.example;
    resultShow.value = false;
    router.push(`/example/${item.child}`);
  };

  const toPage = (path, key) => {
    selectedMenu.value = key;
    router.push(path);
  };

  const toGitee = () => {
    window.open('https://gitee.com/mystia_lorelei/mysita-web');
  };

  const toGitHub = () => {
    window.open('https://github.com/Quincy0c0');
  };

  const goGov = () => {
    window.open('https://beian.miit.gov.cn/');
  };

  onMounted(() => {
    let path = window.location.pathname;
    path = path.match(/\/\w+/);

    if (path) {
      path = path[0];
    } else {
      path = '/';
    }

    MenuList.value.map((item) => {
      if (item.path === path) {
        selectedMenu.value = item.key;
      }
    });
  });
</script>
<style scoped>
  .app {
    width: 100%;
    height: auto;
    background-color: #f5f5f5;
  }
  header {
    position: relative;
    display: flex;
    margin: 1ch;
    padding: 10px;
    background-color: rgba(244, 219, 224, 0.9);
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

  .search {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    animation: searchAnime 0.5s ease-in-out;
  }

  @keyframes searchAnime {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .searchIcon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .searchResult {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 15%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .searchResult li {
    padding: 10px;
    cursor: pointer;
    color: rgb(133, 112, 117);
    border-radius: 10px;
  }

  .searchResult li:hover {
    background-color: rgb(255, 181, 195, 0.425);
  }

  .search input {
    width: 200px;
    height: 40px;
    border-radius: 10px;
    padding: 0 10px;
    font-family: 'PingFang SC';
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.05em;
    outline: none;
    background-color: #fdf3f5;
    box-shadow: inset 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
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
    margin: 0 25px;
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
    overflow: hidden; /* 确保内容隐藏 */
    animation: mainAnime 1.5s ease-in-out;
  }

  @keyframes mainAnime {
    0% {
      opacity: 0;
      height: 0;
    }

    100% {
      opacity: 1;
      height: 92vh;
    }
  }

  footer {
    padding: 10px;
    font-family: 'PingFang SC';
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    letter-spacing: 0.05em;
    color: rgb(133, 112, 117);
    border-radius: 15px;
    margin: 0 2% 15px 2%;
    animation: footerAnime 1.5s ease-in-out;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  @keyframes footerAnime {
    0% {
      opacity: 0;
    }
    99% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .ICP {
    color: rgb(133, 112, 117);
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.05em;
    margin: 0 10px;
  }

  .ICP:hover {
    color: rgb(241, 154, 174);
    cursor: pointer;
  }

  .contact {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    margin: 0 10px;
  }

  .contact p {
    margin: 0 10px;
    width: 200px;
  }

  .wexin {
    width: 100px;
    height: 100px;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .wexin p {
    margin: 10px 0px;
    width: 200px;
  }

  .wexin img {
    width: 80px;
    height: 80px;
  }
</style>

<style>
  @import url('/src/assets/style/pane.css');

  @import url('./assets/style/icon.css');
</style>
