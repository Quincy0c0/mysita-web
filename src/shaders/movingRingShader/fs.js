/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2024-09-05 09:42:17
 * @LastEditors: your name
 * @LastEditTime: 2024-09-05 11:07:19
 */
// 夜景贴图顶点
const fragmentShader = /*glsl*/ `
void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material){
    vec3 resCol=vec3(0.4,.1,.4);
    // 获取模型坐标
    vec3 positionMC=fsInput.attributes.positionMC;
    // 判断当前渲染的片元在模型的中间  得到模型在x-z上的uv坐标 （0,1）
    // 得到模型的高度--->试出来 模型在地下的高度是380 在地上是320
    float czm_height=positionMC.z-380.;
    float czm_h=czm_height/320.;
    // 在模型的正中央给一个光圈
    // if(czm_h>0.5 && czm_h<0.51){
    //     resCol*=10.;
    // }
    // 渐变
    // resCol*=czm_h;
    // 渐变色2 实现两种颜色的渐变过渡
    vec3 col1=vec3(0.1,1.,0.);
    vec3 col2=vec3(1.,0.,0.);
    resCol=mix(col1,col2,czm_h);
    // 如果要让光圈动起来，只需要将0.5改成iTime就可以了
    float iTime=czm_frameNumber/180.;
    // 根据graphToy中的演示，可以得到一个锯齿状的函数图像，这个函数让iTime在0-1之间循环往复的线性运动
    iTime=abs(fract(iTime)*2.-1.);
    if(czm_h>iTime && czm_h<iTime+0.01){
        resCol*=10.;
    }

    material.diffuse=resCol;
}
`;

export default fragmentShader;
