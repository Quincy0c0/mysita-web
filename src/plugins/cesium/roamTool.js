/*
 * @Description: 轨迹漫游工具
 * @Author: your name
 * @version:
 * @Date: 2024-09-04 10:24:34
 * @LastEditors: your name
 * @LastEditTime: 2024-09-05 09:10:50
 */
import * as Cesium from "cesium";

class Roam {
  /**
   * 世界坐标转屏幕坐标
   * @param {Cesium.Viewer} viewer : viewer程序对象
   * @param {Object} options 漫游配置选项 modelUrl,isLoop,isTrail,cameraTrack
   */
  constructor(viewer, options) {
    const defaultOptions = {
      modelUrl: "/src/assets/gltf/redCar.glb",
      isLoop: true,
      isTrail: true,
      track: "自由",
    };

    this.viewer = viewer;
    this.options = Object.assign(defaultOptions, options);
    this.animationEntity = null;
  }

  /**
   * 开始漫游
   * @param {Array<Cesium.Cartesian3>} positions : 笛卡尔三的数组，漫游的路线节点
   * @param {Number} speed 漫游的速度
   */
  startRoam(positions, speed) {
    // 根据速度,计算漫游每个节点的时间以及总时间
    if (positions.length <= 1 || speed <= 0) {
      return;
    }
    // 开始漫游的时候，第一步就要把时间流动打开
    this.viewer.clock.shouldAnimate = true;
    const { modelUrl, isTrail, isLoop } = this.options;
    const { timeSum, times } = this.getSiteTime(positions, speed);
    // 计算漫游开始时间  如果取现在的值，stopTime显示的是NaN，所以取一个以前日期
    const startTime = Cesium.JulianDate.fromDate(new Date());
    // 计算漫游结束的时间，这两个时间，将用来计算aviliablebilty的值
    const stopTime = Cesium.JulianDate.addSeconds(
      startTime,
      timeSum,
      new Cesium.JulianDate()
    );
    // 构造availability，用于展示轨迹，如果不添加这个属性，path将无法显示
    const availability = new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: startTime,
        stop: stopTime,
      }),
    ]);
    // 计算sampledProperty
    const sampledProperty = this.getSampledProperty(
      times,
      positions,
      startTime
    );

    // 设置时间范围
    this.viewer.clock.startTime = startTime;
    this.viewer.clock.stopTime = stopTime;
    //   currentTime是当前时钟系统记录的时间
    this.viewer.clock.currentTime = startTime;
    this.viewer.clock.clockRange = isLoop
      ? Cesium.ClockRange.LOOP_STOP
      : Cesium.ClockRange.UNBOUNDED; // 循环播放

    this.animationEntity = this.viewer.entities.add({
      name: "roam-entity",
      availability,
      position: sampledProperty,
      //   小车朝向的设置
      orientation: new Cesium.VelocityOrientationProperty(sampledProperty),
      model: {
        uri: modelUrl,
        scale: 0.1,
      },
      path: {
        show: isTrail,
        // Cesium发光线材质
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.5,
          color: Cesium.Color.YELLOW,
        }),
        width: 10,
      },
    });
    //   根据配置，绑定视角
    this.trackCamera();
  }

  trackCamera() {
    const { track } = this.options;
    this.viewer.trackedEntity = null;
    // 取消第三人称或者第一人称视角的锁定
    this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    switch (track) {
      case "自由":
        //   自由视角
        this.viewer.trackedEntity = this.animationEntity;
        break;
      case "第三人称":
        // clock，onTick 可以监听时钟系统，得到当前的时间--->property--->getValue(time)--->当前时间的小车坐标
        this.viewer.clock.onTick.addEventListener(this.trackEvent, this);
        break;
      case "第一人称":
        // clock，onTick 可以监听时钟系统，得到当前的时间--->property--->getValue(time)--->当前时间的小车坐标
        this.viewer.clock.onTick.addEventListener(this.trackEvent, this);
        break;
      default:
        break;
    }
  }

  trackEvent() {
    const { track } = this.options;
    let offset;
    if (track === "第一人称") {
      offset = new Cesium.Cartesian3(-10, 10, 10);
    } else {
      offset = new Cesium.Cartesian3(-100, 0, 50);
    }
    // 获取当前小车的位置
    const positionAnimate = this.animationEntity.position.getValue(
      this.viewer.clock.currentTime
    );
    //   第一人称需要将小车的朝向角加进来
    const orientation = this.animationEntity.orientation.getValue(
      this.viewer.clock.currentTime
    );
    //   通过打印得知，orientation是一个四元数,这里需要通过fromQuaternion得到旋转矩阵，然后再构造新的模型矩阵
    console.log(orientation);
    // 这个transform包含了平移的信息以及旋转的信息，所以不需要构造东北天矩阵了
    const transform = Cesium.Matrix4.fromRotationTranslation(
      Cesium.Matrix3.fromQuaternion(orientation),
      positionAnimate
    );
    //通过调整offset的值，可以将第三人称改为第一人称
    this.viewer.camera.lookAtTransform(transform, offset);
  }

  /**
   * 是否暂停漫游
   */
  controlRoam(isStop) {
    this.viewer.clock.shouldAnimate = !isStop;
  }

  /**
   * 销毁
   */
  destroyRoam() {
    this.animationEntity && this.viewer.entities.remove(this.animationEntity);
    this.animationEntity = null;
    this.viewer.trackedEntity = null;
    // 取消第三人称或者第一人称视角的锁定
    this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    this.viewer.clock.onTick.removeEventListener(this.trackEvent, this);
  }

  getSiteTime(positions, speed) {
    // 总时间
    let timeSum = 0;
    // 每个节点的时间
    let times = [];
    for (let i = 0; i < positions.length; i++) {
      if (i === 0) {
        times.push(0); //第一个坐标点对应的时间是0
        continue;
      }
      // 每个漫游节点之间耗费的时间
      let timeBreak =
        Cesium.Cartesian3.distance(positions[i - 1], positions[i]) / speed;
      // 计算漫游到当前节点的总时间
      timeSum += timeBreak;
      // 计算当前节点的时间戳
      times.push(timeSum);
    }
    return {
      timeSum,
      times,
    };
  }

  getSampledProperty(times, positions, startTime) {
    const property = new Cesium.SampledPositionProperty();

    if (times.length !== positions.length) {
      return;
    }

    property.setInterpolationOptions({
      interpolationDegree: 3,
      interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
    });
    positions.forEach((position, index) => {
      // 取到每一个时间戳的值，构造JulianDate
      const time = times[index];
      const julianTime = Cesium.JulianDate.addSeconds(
        startTime,
        time,
        new Cesium.JulianDate()
      );
      property.addSample(julianTime, position);
    });
    return property;
  }
}

export default Roam;
