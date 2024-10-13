## 介绍

一个附有地图案例的个人网站，供学习 WebGIS 使用

网站主要使用的内容有：

框架：

- [Vue3](https://v3.cn.vuejs.org/)

地图部分：

- [openlayers](https://openlayers.org/)

- [mapbox](https://www.mapbox.com/)

- [cesium](https://cesium.com/)

三维部分：

- [ThreeJS](https://threejs.org/)

- [TresJS](https://tresjs.org)

文档部分：

- [markdown-it](https://github.com/markdown-it/markdown-it)

## 启动步骤

### 1. 安装

```js
pnpm install
```

### 2. 启动前准备

创建`.env.development`文件配置

```js
VITE_MAPBOX_KEY = '你的mapbox key';

VITE_TIANDITU_KEY = '你的天地图 key';

VITE_CESIUM_KEY = '你的cesium key';

VITE_SERVER_SRC = '后端服务器地址'; //没有这个会影响部分Cesium加载本地模型的案例
```

### 3. 启动

```js
pnpm dev
```

## 版权

本项目遵循 MIT 开源协议，支持免费使用，二次开发请标注出处和作者。
