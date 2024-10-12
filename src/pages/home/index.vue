<template>
  <div class="single-page">
    <!-- 欢迎和头像部分 -->
    <section class="hero-section">
      <div class="hero-content">
        <img
          class="profile-image slide-in-left"
          src="/public/ic.jpg"
          alt="Profile Image" />
        <div class="hero-text">
          <h1 class="hero-title fade-in">Mystia</h1>
          <p class="hero-subtitle fade-in delay-1">一个普通的 WebGIS Noob</p>
          <button
            class="explore-btn bounce-in delay-2"
            @click="goExample">
            作品展示&nbsp;<el-icon><Right /></el-icon>
          </button>
        </div>
      </div>
    </section>
    <!-- 网站介绍部分 -->
    <section class="about-section fade-in-up delay-3">
      <div class="about-container">
        <div class="about-text">
          <h2>{{ about.title }}</h2>
          <p
            v-for="(paragraph, index) in about.paragraphs"
            :key="index">
            {{ paragraph }}
          </p>

          <button
            class="explore-btn bounce-in delay-2"
            @click="goAbout">
            关于更多&nbsp;<el-icon><Right /></el-icon>
          </button>
        </div>

        <!-- 新增的状态卡片 -->
        <div class="status-card">
          <h3>{{ statusCard.title }}</h3>
          <p>{{ statusCard.version }}</p>
          <p>{{ statusCard.lastUpdate }}</p>
          <h4>{{ statusCard.updatedTitle }}</h4>
          <p
            v-for="(item, index) in statusCard.updatedInfo"
            :key="index + 'info'">
            {{ index + 1 + '.' + item }}
          </p>
        </div>
      </div>
    </section>

    <!-- 技能展示部分 -->
    <section class="skills-section fade-in-up delay-4">
      <h2>使用到的技术</h2>
      <div class="skills-grid">
        <div
          class="skill-card grow-hover"
          v-for="skill in skills"
          :key="skill.name"
          @click="goToSkill(skill.link)">
          <img :src="skill.iconSrc" />
          <h3>{{ skill.name }}</h3>
        </div>

        <div class="skill-card">
          <h3 class="more">And More...</h3>
        </div>
      </div>
    </section>

    <section class="learn-section fade-in-up delay-5">
      <div>
        <h2>B站的优质课程</h2>
        <h4 class="section-tip fade-in-up delay-5">
          Tips：视频为其他up主的视频，非本人创作，请多多支持原作者
        </h4>
      </div>
      <div class="learn-grid fade-in-up delay-6">
        <div class="learn-card fade-in-up delay-7">
          <ul>
            <li
              @click="chageVideo(item.bv)"
              class="learn-item"
              v-for="(item, index) in videoList"
              :key="index + 'video'">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <!-- 嵌入Bilibili视频的iframe -->
        <iframe
          class="fade-in-up delay-8"
          :src="videoUrl"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true">
        </iframe>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useHomeStore } from '/src/stores/home.js';

  const homeStore = useHomeStore();
  const { selectedMenu } = storeToRefs(homeStore);
  const router = useRouter();

  // 技能数据
  const skills = ref([
    {
      name: 'Vue',
      iconSrc: '/src/assets/icons/Vue.png',
      link: 'https://cn.vuejs.org/',
    },

    {
      name: 'Turf',
      iconSrc: '/src/assets/icons/turf.svg',
      link: 'https://turfjs.org/',
    },
    {
      name: 'OpenLayers',
      iconSrc: '/src/assets/icons/openlayers_blue.svg',
      link: 'https://openlayers.org/',
    },
    {
      name: 'Cesium',
      iconSrc: '/src/assets/icons/Cesium.png',
      link: 'https://cesium.com/',
    },
    {
      name: 'Three',
      iconSrc: '/src/assets/icons/Three.png',
      link: 'https://threejs.org/',
    },
    {
      name: 'Tres',
      iconSrc: '/src/assets/icons/Tres.svg',
      link: 'https://tresjs.org/',
    },
  ]);

  // 网站介绍数据
  const about = ref({
    title: '本站内容',
    paragraphs: [
      '这是一个个人在学习WebGIS技术时建立的个人网站。这里会记录学习过程中的使用到的一些小案例和笔记，并提供了源码供和我一样的Noob学习。',
    ],
  });

  const goToSkill = (link) => {
    window.open(link, '_blank');
  };

  const goExample = () => {
    router.push('/example/openlayers');
    selectedMenu.value = 'example';
  };

  const goAbout = () => {
    router.push('/about');
    selectedMenu.value = 'about';
  };

  // 状态卡片数据
  const statusCard = ref({
    title: '网站状态',
    version: '当前版本：v0.1.0',
    lastUpdate: '最近更新：2024.10.11',
    updatedTitle: '更新内容',
    updatedInfo: ['创建了站点'],
  });

  const videoList = ref([
    {
      name: '计算机图形学入门',
      bv: 'BV1X7411F744',
    },
    {
      name: 'WebGL学习课程',
      bv: 'BV1Kb4y1x72q',
    },
    {
      name: '前端三剑客（HTML+CSS+JS）学习',
      bv: 'BV1BT4y1W7Aw',
    },
    {
      name: 'Blender 4.0 入门',
      bv: 'BV11H4y1P7RV',
    },
    {
      name: 'Three.js：汽车模型展示代码解析',
      bv: 'BV1nm42177d7',
    },
    {
      name: 'WebGIS基础入门',
      bv: 'BV1s24y1u7Ar',
    },
    {
      name: 'Cesium：渲染水体',
      bv: 'BV1sJHSefEhq',
    },
    {
      name: 'Mapbox：注册账号获取Token',
      bv: 'BV1ji421Z76J',
    },
    {
      name: 'GeoServer详解',
      bv: 'BV1Ri421e7NH',
    },
    {
      name: '个人网站搭建',
      bv: 'BV1AT411h7RX',
    },
  ]);

  const videoUrl = ref(
    'https://player.bilibili.com/player.html?bvid=BV1X7411F744&page=1'
  );

  const chageVideo = (bv) => {
    videoUrl.value = `https://player.bilibili.com/player.html?bvid=${bv}&page=1`;
  };

  onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 当元素进入视窗时添加 'visible' 类
          entry.target.classList.add('visible');
        }
      });
    });

    // 选择带有动画的所有元素
    const elements = document.querySelectorAll(
      '.fade-in, .fade-in-up, .slide-in-left, .bounce-in'
    );
    elements.forEach((el) => {
      observer.observe(el);
    });
  });
</script>

<style scoped>
  /* 页面基础样式 */
  .single-page {
    font-family: 'PingFang SC', sans-serif;
    color: #85456f;
    text-align: center;
  }

  /* 欢迎和头像部分 */
  .hero-section {
    height: 60vh;
    background: linear-gradient(135deg, #f4dbe0, #a56989);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-content {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #fff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    transform: translateX(-50px);
  }

  .hero-text {
    color: #fff;
    text-align: left;
  }

  .hero-title {
    font-size: 2.5rem;
    margin: 0;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    margin-top: 10px;
  }

  .explore-btn {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1.2rem;
    background-color: #fff;
    color: #85456f;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
  }

  .explore-btn:hover {
    background-color: #85456f;
    color: #fff;
  }

  /* 网站介绍部分 */
  .about-section {
    padding: 60px 0px;
    background-color: #f7f0f4;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }

  .about-container {
    display: flex;
    gap: 400px;
  }

  .about-text {
    max-width: 600px;
    text-align: left;
  }

  .about-text h2 {
    font-size: 2rem;
    color: #85456f;
    margin-bottom: 20px;
  }

  .about-text p {
    font-size: 1.1rem;
    color: #5c3b4b;
    line-height: 1.8;
    margin-bottom: 15px;
  }

  /* 新增状态卡片的样式 */
  .status-card {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    text-align: left;
  }

  .status-card h3 {
    font-size: 1.5rem;
    color: #85456f;
    margin-bottom: 10px;
  }

  .status-card p {
    font-size: 1rem;
    color: #5c3b4b;
    margin: 5px 0;
  }

  .status-card h4 {
    font-size: 1.2rem;
    color: #85456f;
    margin-top: 15px;
  }

  .status-card li {
    font-size: 0.9rem;
    color: #e49eae;
    margin-bottom: 10px;
  }
  /* 技能展示部分 */
  .skills-section {
    padding: 60px 20px;
    background-color: #f7f0f4;
  }

  .skills-grid {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
  }

  .skill-card {
    width: 150px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .skill-card:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }

  .skill-card h3 {
    font-size: 1.2rem;
    color: #85456f;
    margin-top: 10px;
  }

  .skill-card .more {
    font-size: 1.2rem;
    color: #85456f;
    margin-top: 20px;
  }

  .skill-card img {
    width: 50px;
    height: 50px;
    object-fit: scale-down;
    margin-top: 10px;
  }

  .learn-section {
    padding: 60px 20px;
    background-color: #f7f0f4;
  }

  .learn-section .section-tip {
    font-weight: normal;
    margin-top: 10px;
  }

  .learn-grid {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .learn-card {
    width: 300px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .learn-card ul li {
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .learn-card ul li:hover {
    background-color: #e49eae;
    animation: ulAnime 0.5s forwards;
  }

  @keyframes ulAnime {
    0% {
      background-color: #fff;
    }
    100% {
      background-color: #e49eae;
    }
  }

  .learn-card:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }

  iframe {
    width: 60%;
    height: 600px;
  }

  /* 动画样式 */
  .fade-in {
    opacity: 0;
    animation: fadeIn 1s forwards;
  }

  .fade-in-up {
    opacity: 0;
    transform: translateY(20px);
    /* animation: fadeInUp 1s forwards; */
  }

  .slide-in-left {
    opacity: 0;
    transform: translateX(-100px);
    animation: slideInLeft 1s forwards;
  }

  .bounce-in {
    opacity: 0;
    transform: scale(0.5);
    animation: bounceIn 1s forwards;
  }

  .grow-hover:hover {
    transform: scale(1.05);
  }

  .delay-1 {
    animation-delay: 0.5s;
  }
  .delay-2 {
    animation-delay: 1s;
  }
  .delay-3 {
    animation-delay: 1.5s;
  }
  .delay-4 {
    animation-delay: 2s;
  }
  .delay-5 {
    animation-delay: 2.5s;
  }
  .delay-6 {
    animation-delay: 3s;
  }

  /* 动画关键帧 */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    60% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* 当元素进入视窗，应用 visible 类，触发动画 */
  .fade-in.visible {
    opacity: 1;
    animation: fadeIn 1s forwards;
  }

  .fade-in-up.visible {
    opacity: 1;
    transform: translateY(0);
    animation: fadeInUp 1s forwards;
  }

  .slide-in-left.visible {
    opacity: 1;
    transform: translateX(0);
    animation: slideInLeft 1s forwards;
  }

  .bounce-in.visible {
    opacity: 1;
    transform: scale(1);
    animation: bounceIn 1s forwards;
  }
</style>
