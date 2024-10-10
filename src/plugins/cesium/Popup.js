/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-08-30 10:27:31
 * @LastEditors: your name
 * @LastEditTime: 2024-08-30 11:03:28
 * @usage:const popup=new Popup(viewer)
          popup.addPopup(position,htmlString)
          popup.removePopup()

          升级：1.气泡框是否能够像billboard实现近大远小
          2.是否能够像billboard一样实现相机距离远了之后消失
          3.billboard数量比较多，如何管理
          4.将htmlString改为vue组件
          5.像billboard一样实现pixeloffset

1. 在cesiumWigdets中新增一个dom节点，用来承载气泡框，并设置为绝对定位
2. 调用我们概述中提过的场景触发事件camera.changed.addEventListener，监听相机变化，相机变化时，更新气泡框位置
3. 编写函数，将气泡框的笛卡尔三维坐标转为屏幕坐标，并计算出合适的left和bottom，实现定位
4. 不要忘记将产生的气泡框以及监听函数存储起来，方便销毁
 */
import * as Cesium from 'cesium'
import {cartesianToScreenPos} from './index'

class Popup {
    /**
    * @param {Cesium.Viewer} viewer : viewer程序对象
    */
    constructor(viewer){
        this.viewer=viewer
        this.popup=null
    }

    /**添加气泡框
    * @param {Cesium.Cartesian3} position : 气泡框所在的位置，笛卡尔坐标
    * @param {string} htmlString:气泡框的骨架结构
    * @param {Object} options 气泡框配置选项 offset Cesium.Carstian2
    * nearfarScalar(near,nearVal,far,farVal)
    */
    addPopup(position,htmlString,options){
        // 创建一个气泡框的容器
        const target=document.createElement('div')
        target.id='popup-wrapper'
        // viewer.cesiumWidget.container是cesium视口的容器
        this.viewer.cesiumWidget.container.appendChild(target)
        target.innerHTML=htmlString
        target.className='popup'
        target.style.position='absolute'
        this.renderPosition(position,target,options)
        this.popup={
            container:target
        }
    }

    renderPosition(position,container,options){
        // 设置相机的更新频率
        this.viewer.camera.percentageChanged=0.01
        this.updatePopup(position,container,options)
        // 相机的更新事件
        this.viewer.camera.changed.addEventListener(()=>this.updatePopup(position,container,options))
    }

    // 为了方便销毁事件，将更新函数写到类中
    updatePopup(position,container,options){
        const {offset}=options
        let offsetReal=Cesium.defaultValue(offset,[0,0])
  
        // 将笛卡尔坐标转为屏幕坐标
        const positionScreen=cartesianToScreenPos(this.viewer,position)
        // 得到canvas的高度
        const canvasHeight=this.viewer.scene.canvas.height
        container.style.bottom=canvasHeight-positionScreen.y+offsetReal[0]+'px'
        // 将气泡框往左位移一半宽度
        container.style.left=positionScreen.x-container.offsetWidth/2+offsetReal[1]+'px'
    }

    removePopup(){
        const {container}=this.popup
        if(container){
            this.viewer.cesiumWidget.container.removeChild(container)
            this.viewer.camera.changed.removeEventListener(this.updatePopup)
            this.popup=null
        }
    }
}

export default Popup
