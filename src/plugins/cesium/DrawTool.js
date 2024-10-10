/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2024-03-05 14:46:14
 * @LastEditors: your name
 * @LastEditTime: 2024-04-11 10:48:24
 */
import * as Cesium from "cesium";
import {getPositionHeight,get2PositionDistance,generateCirclePoints,cartesian3ToDegreesHeight} from './utils'
import _ from "lodash";

class DrawTool {
  constructor(viewer) {
    this.viewer = viewer;
    // 初始化handler,events
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.DrawStartEvent = new Cesium.Event(); //开始绘制事件
    this.DrawEndEvent = new Cesium.Event(); //结束绘制事件
  }

  DrawTypes = {
    Polyline: "Polyline",
    Rect: "Rect",
    Point: "Point",
    Circle:'Circle'
  };

  // 激活工具，传入DrawType
  active(drawType) {
    // 如果在我们的绘制工具集合中，存在这个工具
    if (Object.keys(this.DrawTypes).includes(drawType)) {
      this.drawType = drawType;
      // 最终的坐标
      this.positions = [];
      // 绘制过程中的坐标
      this.curPositions = [];
      //   每次点击有一个标点，需要存储实体
      this.points = [];
      // 注册鼠标事件
      this.registerEvents();

      //设置鼠标状态
      this.viewer.enableCursorStyle = false;
      this.viewer._element.style.cursor = "default";
      this.DrawStartEvent.raiseEvent("开始绘制");
      this.createMarker(drawType);
    } else {
      return;
    }
  }

  createMarker(drawType) {
    this.marker = document.createElement("div");
    this.marker.innerHTML = `左键点击绘制${drawType},右键结束绘制`;
    this.marker.className = "marker-draw";
    this.viewer.cesiumWidget.container.appendChild(this.marker);
  }

  destoryMarker() {
    this.marker && this.viewer.cesiumWidget.container.removeChild(this.marker);
    this.marker=null
  }

  registerEvents() {
    // 分别注册左键画点，右键结束画点，鼠标移动事件
    this.leftClickEvent();
    this.rightClickEvent();
    this.mouseMoveEvent();
  }

  // 屏幕坐标转笛卡尔
  positionTransfer(position) {
    let positionTrans = this.viewer.scene.pickPosition(position);
    if (!positionTrans) {
      positionTrans = this.viewer.scene.camera.pickEllipsoid(
        position,
        this.viewer.scene.globe.ellipsoid
      );
    }
    return positionTrans;
  }

  leftClickEvent() {
    // 单机鼠标左键画点
    this.handler.setInputAction((e) => {
      let position = this.positionTransfer(e.position);
      if (!position) return;
      this.positions.push(position);
      this.curPositions.push(position);
      // 如果是第一个点，就开始根据drawType，绘制图案
      if (this.positions.length === 1) {
        this.startDraw();
      }
      //  如果是画线，每次点击左键，都在同一位置画一个点
      if(this.drawType===this.DrawTypes.Polyline){
        this.generatePoint(position);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  //   鼠标移动事件
  mouseMoveEvent() {
    this.handler.setInputAction((e) => {
      this.marker.style.left = e.endPosition.x + 20 + "px";
      this.marker.style.top = e.endPosition.y - 20 + "px";
      this.viewer._element.style.cursor = "default"; //由于鼠标移动时 Cesium会默认将鼠标样式修改为手柄 所以移动时手动设置回来
      let position = this.positionTransfer(e.endPosition);
      if (!position || !this.drawEntity) return;
      // tempPositions是每次鼠标移动时，我们得到的坐标,this.position是我们左键点击才能得到的坐标
      this.curPositions = [...this.positions, position];
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  //   右键点击，结束绘制
  rightClickEvent() {
    this.handler.setInputAction(() => {
      // 如果还没有开始绘制，直接结束绘制状态
      if (!this.drawEntity) {
        this.deactive();
        return;
      }
      // 如果当前的坐标数量少于最小数量，直接结束
      if (this.positions.length < this.minPositionCount) {
        this.deactive();
        return;
      }
      // 根据各种绘制类型，要重新给坐标赋值，吧callback变为constant
      switch (this.drawType) {
        case this.DrawTypes.Polyline:
          this.drawEntity.polyline.positions = this.positions;
          break;
        case this.DrawTypes.Rect:
          this.drawEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(
            this.getRectFourPoints()
          );
          this.drawEntity.polyline.positions = this.getRectFourPoints();
          this.positions = this.getRectFourPoints();
          this.positions.pop();
          break;
        case this.DrawTypes.Circle:
          this.drawEntity.ellipse.semiMinorAxis = this.getAxis();
          this.drawEntity.ellipse.semiMajorAxis = this.getAxis();
          this.minPositionCount = 2;
          break;
        default:
          break;
      }
      this.deactive();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  startDraw() {
    switch (this.drawType) {
      case this.DrawTypes.Point:
        // 对于点，直接结束绘制就完事了
        this.drawEntity = this.generatePoint(this.positions[0]);
        this.deactive();
        this.minPositionCount = 1;
        break;
      case this.DrawTypes.Polyline:
        this.generatePolyline();
        this.minPositionCount = 2;
        break;
      case this.DrawTypes.Rect:
        this.generateRect();
        this.minPositionCount = 2;
        break;
      case this.DrawTypes.Circle:
        this.generateCircle();
        this.minPositionCount = 2;
        break;
      default:
        break;
    }
  }
  // 绘制点
  generatePoint(position) {
    const point = this.viewer.entities.add({
      Type:this.DrawTypes.Point,
      position: position,
      point: {
        pixelSize: 14,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        color: Cesium.Color.RED,
      },
    });
    this.points.push(point);
    return point;
  }

  //   绘制线,position使用callbackProperty
  generatePolyline() {
    this.drawEntity = this.viewer.entities.add({
      Type:this.DrawTypes.Polyline,
      polyline: {
        positions: new Cesium.CallbackProperty((e) => {
          return this.curPositions;
        }, false),
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
        clampToGround: true,
      },
    });
  }

  //   绘制矩形，由polygon和polyline组成
  generateRect() {
    this.drawEntity = this.viewer.entities.add({
      Type:this.DrawTypes.Rect,
      polygon: {
        hierarchy: new Cesium.CallbackProperty((e) => {
          return new Cesium.PolygonHierarchy(this.getRectFourPoints());
        }, false),
        material: Cesium.Color.RED.withAlpha(0.6),
        perPositionHeight: true,
      },
      polyline: {
        positions: new Cesium.CallbackProperty((e) => {
          return this.getRectFourPoints();
        }, false),
        width: 1,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
      },
    });
  }

  // 获取矩形四个点
  getRectFourPoints() {
    if (this.curPositions.length) {
      let p1 = this.curPositions[0];
      let p2 = this.curPositions[0];
      if (this.curPositions.length > 1) p2 = this.curPositions[1];

      let c1 = Cesium.Cartographic.fromCartesian(p1);
      let c2 = Cesium.Cartographic.fromCartesian(p2);
      if (c1.height < 0) c1.height = 0;
      if (c2.height < 0) c2.height = 0;
      let lls = this.getRectanglePointsByTwoPoint(c1, c2);

      // 坐标数组转为指定格式
      let ars = [
        lls[0][0],
        lls[0][1],
        c1.height,
        lls[1][0],
        lls[1][1],
        c1.height,
        lls[2][0],
        lls[2][1],
        c1.height,
        lls[3][0],
        lls[3][1],
        c1.height,
        lls[0][0],
        lls[0][1],
        c1.height,
      ];
      const result = Cesium.Cartesian3.fromDegreesArrayHeights(ars);
      return result;
    }
  }

  //   获取矩形四个点
  getRectanglePointsByTwoPoint(c1, c2) {
    //转为经纬度
    let lngLat1 = [
      Cesium.Math.toDegrees(c1.longitude),
      Cesium.Math.toDegrees(c1.latitude),
    ];
    let lngLat2 = [
      Cesium.Math.toDegrees(c2.longitude),
      Cesium.Math.toDegrees(c2.latitude),
    ];

    let lngLat3 = [
      Cesium.Math.toDegrees(c1.longitude),
      Cesium.Math.toDegrees(c2.latitude),
    ];
    let lngLat4 = [
      Cesium.Math.toDegrees(c2.longitude),
      Cesium.Math.toDegrees(c1.latitude),
    ];

    return [lngLat1, lngLat3, lngLat2, lngLat4];
  }

  // 绘制圆
  generateCircle(){
    this.drawEntity = this.viewer.entities.add({
      position:this.positions[0],
      ellipse: {
        height: getPositionHeight(this.positions[0]),
        semiMinorAxis: new Cesium.CallbackProperty((e) => {
          return this.getAxis();
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty((e) => {
          return this.getAxis();
        }, false),
        material: Cesium.Color.RED.withAlpha(0.6),
      }
    })
  }

  
  //圆半径
  getAxis() {
    if (this.curPositions.length) {
      let p1 = this.curPositions[0];
      let p2 = this.curPositions[0];
      if (this.curPositions.length > 1)
        p2 = this.curPositions[this.curPositions.length - 1];
      const axis = get2PositionDistance(p1, p2);
      return axis;
    }
  }

  // 结束绘制
  deactive() {
    // 对于圆，根据半径计算边缘点坐标并返回
    let points=[]
    if(this.drawType===this.DrawTypes.Circle){
      const radius=this.getAxis()
      const positions=cartesian3ToDegreesHeight(this.positions[0])
      points=generateCirclePoints(positions,radius)
      points=points.map(item=>{
        const height=getPositionHeight(this.positions[0])
        return Cesium.Cartesian3.fromDegrees(item[0],item[1],height)
      })
    }

    // 提交绘制结束事件
    this.DrawEndEvent.raiseEvent(
      this.drawEntity,
      this.positions,
      this.drawType,
      points
    );
    this.unRegisterEvents();
    this.destoryMarker();
    this.drawType = undefined;
    this.drawEntity = undefined;
    this.positions = [];
    this.curPositions = [];
    this.viewer._element.style.cursor = "pointer";
    this.viewer.enableCursorStyle = true;
  }

  //解除鼠标事件
  unRegisterEvents() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
  }

  //   清除绘制的实体
  removeAllDrawEnts() {
    this.points &&this.points.forEach((point) => {
      this.viewer.entities.remove(point);
    });
    this.drawEntity && this.viewer.entities.remove(this.drawEntity);
    this.points = [];
    this.drawEntity = null;
  }
}

export default DrawTool;
