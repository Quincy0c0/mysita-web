/*
 * @Description: 模型压平
 * @Author: your name
 * @version: 
 * @Date: 2024-09-04 14:58:08
 * @LastEditors: your name
 * @LastEditTime: 2024-09-05 09:25:44
 */
import * as Cesium from 'cesium'

class TileFlatten {
  /**
   * 世界坐标转屏幕坐标
   * @param {Cesium.Viewer} viewer : viewer程序对象
   * @param {Cesium.Cesium3DTileset} tileset 需要压平的模型
   * @param {Array<Cesium.Cartesian3>} positions Cesium的笛卡尔3数组，长度至少为3
   * @param {Number} flattenHeight 需要压平的高度
   */
  constructor(viewer, tileset, positions, flattenHeight) {
    this.viewer = viewer;
    this.tileset = tileset;
    this.positions = positions;
    this.flattenHeight = flattenHeight;
    this.modelRange = this.getModelPosition();
  }

  // 开始压平
  startFlatten() {
    // 从网上找的glsl代码，判断点是否在多边形内：https://blog.csdn.net/qq_40043761/article/details/117700084
    //由于shader只能传固定长度，所以这里的长度要写成定好的，并且不能长度不能为0;
    //二三维一样的，改下类型就行了，一般只用判断是否在平面内
    const shaderIsInPolygon = /*glsl*/`bool pointInPolygon(vec2 p, vec2 points[${this.modelRange.length}]){
        bool inside = false;
        const int length = ${this.modelRange.length};
        for (int i = 0; i < length; i++) {
          float xi = points[i].x;
          float yi = points[i].y;
          float xj;
          float yj;
          if (i == 0) {
            xj = points[length - 1].x;
            yj = points[length - 1].y;
          } else {
            xj = points[i - 1].x;
            yj = points[i - 1].y; 
          }
          bool intersect = ((yi > p.y) != (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
          if (intersect) {
            inside = !inside;
          }
        }
        return inside;
      }`;
    const customShader = new Cesium.CustomShader({
      uniforms: {
        u_Height: {
          type: Cesium.UniformType.FLOAT,
          value: this.flattenHeight,
        },
        // 不支持传入数组
      },
      vertexShaderText: shaderIsInPolygon+/*glsl*/ `
            void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
                `+this.getStr()+
                /*glsl*/`
                // 当前渲染的模型坐标 positionMC positionEC positionWC--->不精确
                vec3 positionMC=vsInput.attributes.positionMC;
                vec2 modelPosition=vec2(positionMC.x,positionMC.z);
                // 根据算法，计算点是否在多边形内
                bool isInside=pointInPolygon(modelPosition,vs);
                if(isInside){
                    vsOutput.positionMC.y=u_Height;
                }
            }
        `,
    });
    this.tileset.customShader=customShader
  }

  // 改变压平高度
  changeFlattenHeight(val) {
    if(!Number.isNaN(val)){
        this.tileset.customShader.setUniform('u_Height',val)
    }
  }

  // 清除模型压平
  clearFlatten() {
    this.tileset.customShader=null
  }

  // 将世界坐标转为基于当前tileset的模型坐标
  getModelPosition() {
    // 得到当前3dtile的模型矩阵
    const transform = this.tileset.root.computedTransform.clone();
    console.log(transform);
    // _root.transform没有效果,空矩阵
    // 通过查阅源码发现，修改3dtile的模型矩阵的时候，root.transform不会跟着一起改变
    // root.transform，modelMatrix,computedTransform最终模型矩阵
    // this.tileset.modelMatrix=new Cesium.Matrix4(...); 当modelMatrix发现改变的时候，computedTransform会重新计算
    console.log(this.tileset._root.transform);
    console.log(this.tileset.modelMatrix);
    // 求模型矩阵的逆矩阵
    const inverseTransform = Cesium.Matrix4.inverseTransformation(
      transform,
      new Cesium.Matrix4()
    );
    const newArr = [];
    this.positions.forEach((position) => {
      // 将模型的矩阵逆矩阵乘上世界坐标=坐标在这个模型坐标系下的坐标
      const modelPos = Cesium.Matrix4.multiplyByPoint(
        inverseTransform,
        position,
        new Cesium.Cartesian3()
      );
      console.log(modelPos);
      // 这里y轴要取反，因为cesium坐标系和模型坐标系的y轴方向相反
      newArr.push([modelPos.x, -modelPos.y]);
    });
    return newArr;
  }

  getStr() {
    // shader中，无法直接传入数组的uniform
    // vec2 vs[]; 数组中的每一项都是vec2 vs中只能有vec2
    // vs[0]=vec2(1.,1.);
    // vs[1]=vec2(2.,2.);
    let str = "vec2 vs[" + this.modelRange.length + "];\n";
    this.modelRange.forEach((item, index) => {
      str += "vs[" + index + "] = vec2(" + item[0] + "," + item[1] + ");\n";
    });
    console.log(str);
    return str;
  }
}

export default TileFlatten
