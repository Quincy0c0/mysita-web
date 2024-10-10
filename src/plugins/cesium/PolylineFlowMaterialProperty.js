/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2024-09-05 15:58:10
 * @LastEditors: your name
 * @LastEditTime: 2024-09-05 16:12:43
 */
import * as Cesium from "cesium";

// 1.如何用ES5语法构造类 
// 2.为什么要用_加变量
// 3.材质引擎校验了什么属性
class PolylineFlowMaterialProperty {
  constructor(color) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  // 我们材质得类型
  getType(time, result) {
    return "PolylineFlow";
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
      this._color,
      time,
      Cesium.Color.WHITE,
      result.color
    );
    return result;
  }

  equals(other) {
    return (
      this === other || //
      (other instanceof PolylineFlowMaterialProperty && //
        Cesium.Property.equals(this._color, other._color))
    );
  }
}

// 对于color，我们需要包装成property
Object.defineProperties(PolylineFlowMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor("color"),
});

/**
 * Gets the name of the color material.
 * @type {string}
 * @readonly
 */
Cesium.Material.PolyFlowType = "PolylineFlow";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolyFlowType, {
  fabric: {
    type: Cesium.Material.PolyFlowType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
    },
    source: /*glsl*/ `
            // czm_materialInput和czm_modelMaterial是一个结构
            uniform vec4 color;
            czm_material czm_getMaterial(czm_materialInput materialInput){
                // 不能直接赋值 因为没有声明inout
                //materialInput.diffuse=color;
                // 注意这里和customShader中得编译环境不一样，主函数返回值不是void
                // 主函数得返回值是一个czm_material类型得数据
                // czm_material类型得数据可以通过内置函数czm_getDefaultMaterial获取到
                czm_material material=czm_getDefaultMaterial(materialInput);
                // 获取坐标，得到当前渲染片元得位置 materialInput中有一个属性叫做st，是当前片元相对于整个纹理得uv坐标
                vec2 st=materialInput.st;
                vec3 resCol=color.rgb;
                float alpha=0.3;
                float iTime=czm_frameNumber/120.;
                iTime=fract(iTime);

                if(st.s<iTime+0.02 && st.s>iTime){
                    resCol*=5.;
                    // smoothstep平滑过渡函数--->glsl内置得常用函数
                    alpha=smoothstep(iTime,iTime+0.02,st.s);
                }
                material.diffuse=resCol;
                material.alpha=alpha;
                return material;
            }
    `,
  },
  translucent: function () {
    return true
  },
});

export default PolylineFlowMaterialProperty
