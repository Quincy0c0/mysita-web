/*
 * @Description: cesium帮助工具
 * @Author: your name
 * @version:
 * @Date: 2024-08-27 14:20:08
 * @LastEditors: your name
 * @LastEditTime: 2024-09-02 15:13:27
 */
import * as Cesium from "cesium";

//获取唯一码 时间不可能重复
export const getPlotCode = () => {
  const date = new Date();
  let code = date.getFullYear() + "";
  code += date.getMonth() + 1;
  code += date.getDate();
  code += date.getHours();
  code += date.getMinutes();
  code += date.getSeconds();
  code += date.getMilliseconds();
  return code;
};

/**
 * 笛卡尔3转经纬度
 * @param {Cesium.Viewer} viewer : viewer程序对象
 * @param {Cesium.Cartesian3} cartesianPosition : 笛卡尔三维坐标
 */
export const cartesian3ToLng = (viewer, cartesianPosition) => {
  // 获取到当前地球的椭球体：包含了当前地球的大小，坐标系信息，坐标转换工具
  const ellipsoid = viewer.scene.globe.ellipsoid;
  // cartographic是一个弧度制数据
  const cartographic = ellipsoid.cartesianToCartographic(cartesianPosition);
  // 将弧度制数据转换
  //   toDegrees将弧度转为角度，toRadians将角度转为弧度
  const lat = Cesium.Math.toDegrees(cartographic.latitude);
  const lng = Cesium.Math.toDegrees(cartographic.longitude);
  const alt = cartographic.height;
  return {
    lng,
    lat,
    height: alt,
  };
};

/**
 * 经纬度转笛卡尔3
 * @param {Object} positionLng:经纬度坐标 {lng,lat,height}
 */
export const lngToCartesian3 = (positionLng) => {
  const { lng, lat, height } = positionLng;
  //   fromDegrees可以将普通的经纬度转为笛卡尔3
  return new Cesium.Cartesian3.fromDegrees(lng, lat, height);
};

/**
 * 经纬度数组转笛卡尔3数组
 * @param {Array<{lng,lat,height}>} positionArr:经纬度坐标数组[{lng,lat,height}] | [{lng,lat}]
 */
export const cartographicsToCartesian3 = (positionArr) => {
  const targetArr = [];
  //   对于带高度的情况，使用fromDegreesArrayHeights
  let isHeight = false;
  positionArr.forEach((item) => {
    const { lng, lat, height } = item;
    if (height || height === 0) {
      isHeight = true;
      targetArr.push(lng, lat, height);
    } else {
      targetArr.push(lng, lat);
    }
  });
  // 这个api不能转换带高度的经纬度
  return isHeight
    ? new Cesium.Cartesian3.fromDegreesArrayHeights(targetArr)
    : new Cesium.Cartesian3.fromDegreesArray(targetArr);
};

/**
 * 屏幕坐标转世界坐标
 * @param {Cesium.Viewer} viewer : viewer程序对象
 * @param {Cesium.Cartesian2>} 屏幕坐标
 */
export const screenPosToCartesian3 = (viewer, screenPos) => {
  // getPickRay就是使用当前屏幕坐标以及相机朝向发射射线，进行拾取，和three中的ray一样的
  const cartesian = viewer.scene.globe.pick(
    viewer.camera.getPickRay(screenPos),
    viewer.scene
  );
  return cartesian;
};

/**
 * 世界坐标转屏幕坐标
 * @param {Cesium.Viewer} viewer : viewer程序对象
 * @param {Cesium.Cartesian3>} 世界坐标
 */
export const cartesianToScreenPos = (viewer, Cartesian3) => {
  return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    Cartesian3
  );
};

export const initViewer = () => {
  //使用cesium默认配置 初始化viewer
  const viewer = new Cesium.Viewer("cesiumContainer", {
    // widgets中的ui控件，这些一般都不显示
    // 时间轴控件
    timeline: false,
    // 动画控件
    animation: false,
    // 右上方的底图控件
    baseLayerPicker: false,
    // 右上方的复位按钮
    homeButton: false,
    // 右上方的全屏按钮
    fullscreenButton: false,
    // 右上方的导航按钮
    geocoder: false,
    // 右上方的二三维切换按钮
    sceneModePicker: false,
    // 右上方的帮助按钮
    navigationHelpButton: false,
    // 用来做动画的shouldAnimate，是否让cesium的时钟正常的步进
    shouldAnimate: true,
    // 阻止弹出点击的信息框
    infoBox: false,
    // 取消元素的选中
    selectionIndicator: false,
  });
  // tiltEventTypes 控制相机旋转的交互方式 改为鼠标右键旋转视图
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
  ];

  // zoomEventType 控制相机的缩放交互模式，改为中键拖动和中键的滚轮
  viewer.scene.screenSpaceCameraController.zoomEventType = [
    Cesium.CameraEventType.MIDDLE_DRAG,
    Cesium.CameraEventType.WHEEL,
  ];

  // 设置拖转模式，rotateEventTypes
  viewer.scene.screenSpaceCameraController.rotateEventTypes = [
    Cesium.CameraEventType.LEFT_DRAG,
  ];
  return viewer;
};

export const loadRiver=async (viewer)=>{
  const data=await Cesium.GeoJsonDataSource.load('/src/assets/water.json')
  // 不能直接添加，因为实体没有water材质
  //viewer.dataSources.add(data)
  // 只能将坐标拿出来，用primitive
  const entites=data.entities.values
  // 构造primitive，首先构造geometryInstance
  const instances=[]
  entites.forEach(ent=>{
      // 通过getValue拿到每个实体的坐标的
      const hierarchy=ent.polygon.hierarchy.getValue()
      console.log(hierarchy);
      const instance=new Cesium.GeometryInstance({
          geometry:new Cesium.PolygonGeometry({
              polygonHierarchy:hierarchy,
              extrudedHeight:0,
              height:1,
              vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
          })
      })
      instances.push(instance)
  })
  // 构造appearance实现水域材质
  const appearance=new Cesium.EllipsoidSurfaceAppearance({
      material:new Cesium.Material({
          fabric:{
              type:'Water',
              uniforms:{
                  baseWaterColor:new Cesium.Color(13/255,83/255,151/255,0.8),
                  // 不能添加specularMap，灰度图
                  // specularMap:'/src/assets/earthspec1k.jpg',
                  normalMap:"/src/assets/waterNormals.jpg",
                  frequency:2000,
                  animationSpeed:0.6,
                  amplitude:0.8
              }
          }
      })
  })
  const waterPrimitive=viewer.scene.primitives.add(new Cesium.GroundPrimitive({
      geometryInstances:instances,
      appearance
  }))
}

//获取一个圆的边缘坐标
export const generateCirclePoints = (center, radius) => {
  let points = [];
  for (let i = 0; i < 360; i += 2) {
    points.push(getCirclePoint(center[0], center[1], i, radius));
  }
  return points;
};

const getCirclePoint = (lon, lat, angle, radius) => {
  let dx = radius * Math.sin((angle * Math.PI) / 180.0);
  let dy = radius * Math.cos((angle * Math.PI) / 180.0);
  let ec = 6356725 + ((6378137 - 6356725) * (90.0 - lat)) / 90.0;
  let ed = ec * Math.cos((lat * Math.PI) / 180);
  let newLon = ((dx / ed + (lon * Math.PI) / 180.0) * 180.0) / Math.PI;
  let newLat = ((dy / ec + (lat * Math.PI) / 180.0) * 180.0) / Math.PI;
  return [newLon, newLat];
};

export function getPositionHeight(position) {
  const cartographic = Cesium.Cartographic.fromCartesian(position);
  return cartographic.height;
}

//笛卡尔坐标转为经纬度
export function cartesian3ToDegreesHeight(position) {
  let c = Cesium.Cartographic.fromCartesian(position);
  return [
    Cesium.Math.toDegrees(c.longitude),
    Cesium.Math.toDegrees(c.latitude),
    c.height,
  ];
}