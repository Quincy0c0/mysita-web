const fragmentShader = /*glsl*/ `

vec3 getMovingRing(float czm_h){
    vec3 resCol=vec3(0.4,.4,.4);
    // 渐变色2 实现两种颜色的渐变过渡
    vec3 col1=vec3(0.1,0.1,0.1);
    vec3 col2=vec3(0.,0.5,0.9);
    resCol=mix(col1,col2,czm_h);
    // 如果要让光圈动起来，只需要将0.5改成iTime就可以了
    // float iTime=czm_frameNumber/120.;
    // 根据graphToy中的演示，可以得到一个锯齿状的函数图像，这个函数让iTime在0-1之间循环往复的线性运动
    // iTime=abs(fract(iTime)*2.-1.);
    // if(czm_h>iTime && czm_h<iTime+0.01){
    //     resCol*=10.;
    // }
    return resCol;
}

// 点光源颜色 当前片元的世界坐标，光源中心的世界坐标，光源的颜色，光源辐射半径
vec3 PointLight(vec3 positionWC,vec3 lightPosition,vec3 lightCol,float lightRadius){
    // pow(clamp(1.-lightDistance/u_lightRadius,0. ,1.),2. );
    // lightDistance是当前渲染的片元与光源中心的距离 u_lightRadius是光源半径
    // length是glsl的内置函数，传入两个维度一样的vec可以计算，这两个点之间的距离
    // length函数要求传入一个向量，而不是两个坐标
    float lightDistance=length(positionWC-lightPosition);
    // 点光源强度因子计算
    float intensity=pow(clamp(1.-lightDistance/lightRadius,0.0,1.0),2.0);
    // 得到点光源颜色
    return lightCol*intensity;
}

void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material){
    vec3 resCol=vec3(0.4,.4,.4);
    // 获取模型坐标
    vec3 positionMC=fsInput.attributes.positionMC;
    // 获取当前模型的世界坐标 这个白膜里面的positionWC是准确的
    vec3 positionWC=fsInput.attributes.positionWC;
    // vec4 worldPosition = czm_model * modelPosition;
    //vec3 positionWCN=positionMC
    float czm_height=positionMC.z-380.;
    float czm_h=czm_height/320.;
    // 模型扫光颜色
    vec3 movingRingCol=getMovingRing(czm_h);
    // 得到点光源颜色
    vec3 pointlightCol=PointLight(positionWC,u_LightPosition,u_LightCol,u_LightRadius);
    
    material.diffuse=movingRingCol+pointlightCol;
}
`;

export default fragmentShader;
