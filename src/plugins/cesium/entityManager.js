/*
 * @Description: 管理实体
 * @Author: your name
 * @version: 
 * @Date: 2024-08-27 15:36:01
 * @LastEditors: your name
 * @LastEditTime: 2024-08-27 15:37:50
 */
import * as Cesium from 'cesium'
import {getPlotCode} from './index'

export const addBox=(viewer,position,dimensions,color)=>{
    const box=viewer.entities.add({
        id:`box-${getPlotCode}`,
        name:'box',
        position,
        // box就是一个entityGraphic
        box:{
            // 立方体的长宽高
            dimensions:dimensions,
            fill:true,
            // 立方体的材质
            // 如果用内置颜色:Cesium.Color.RED
            // 如果用十六进制颜色 '#ffffff' new Cesium.Color.fromCssColorString('#ff0000')
            // 如果用rgb:new Cesium.Color()
            material:new Cesium.Color.fromCssColorString(color),
            outline:false,
            outlineColor:Cesium.Color.YELLOW,
            // heightReference设置几何体的贴地模式，CLAMP_TO_GROUND贴地形，RELATIVE_TO_GROUND相对地形 NONE不贴，使用position中提供的高度
            heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
        }
    })
    return box
}
