import{Y as z}from"./trescientos-if5UbsrM.js";import{W as b,aI as A,p as v,q as I,s as B,x as R,O as F,o as p,P as _,Q as t,Z as y,w as L,e as f,aG as k,aH as T,aU as D,aV as $,aW as w,aX as C,aY as j,aZ as G,a_ as V,X as E,Y as N,F as W,a0 as Y,a9 as h,c as M,R as H,U}from"./index-B2By82I9.js";import{P as O}from"./tweakpane-DhSwS92u.js";const X={class:"container"},Z=["position"],q=["position","a-scale"],Q={__name:"PointFlow",setup(S){const{onLoop:r}=A(),m=v(),i=v(),c=I({clearColor:"black",shadows:!0,alpha:!1}),l={transparent:!0,blending:D,depthWrite:!1,vertexShader:`
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uTime;
  attribute float aScale;

  void main()
  {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;

      gl_Position = projectionPosition;
      gl_PointSize = aScale * uSize * uPixelRatio;
      gl_PointSize *= (1.0 / - viewPosition.z);
  }
  `,fragmentShader:`
  void main()
    {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float strength = 0.05 / distanceToCenter - 0.1;

      gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
    }
  `,uniforms:{uSize:{value:100},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uTime:{value:0}}},u=v(6e3),n=v(null),x=v(null),d=v(10),o=v(1);B(u,s=>{n.value=new Float32Array(s*3),x.value=new Float32Array(s);for(let a=0;a<s;a++)n.value[a*3+0]=Math.random()*d.value,n.value[a*3+1]=Math.random()*d.value,n.value[a*3+2]=Math.random()*d.value,x.value[a]=Math.random()},{immediate:!0});const e=()=>{m.value=new O({container:i.value}),m.value.addBlade({view:"slider",label:"粒子数量",min:0,max:1e4,value:u.value}).on("change",s=>{u.value=s.value}),m.value.addBlade({view:"slider",label:"粒子速度",min:0,max:10,value:o.value}).on("change",s=>{o.value=s.value})};return r(({elapsed:s})=>{l.uniforms.uTime.value=s*o.value}),R(()=>{e()}),(s,a)=>{const P=F("TresCanvas");return p(),_("div",X,[t("div",{ref_key:"paneRef",ref:i,class:"pane"},null,512),y(P,k(T(c)),{default:L(()=>[a[0]||(a[0]=t("TresPerspectiveCamera",{position:[5,5,5],fov:45,near:.1,far:1e3,"look-at":[0,0,0]},null,-1)),y(f(z)),a[1]||(a[1]=t("TresAmbientLight",{intensity:.5},null,-1)),t("TresPoints",{position:[-d.value*.5,-d.value*.5,-d.value*.5]},[t("TresBufferGeometry",{position:[n.value,3],"a-scale":[x.value,1]},null,8,q),t("TresShaderMaterial",k(T(l)),null,16)],8,Z),a[2]||(a[2]=t("TresDirectionalLight",{position:[0,2,4],intensity:1,"cast-shadow":""},null,-1)),a[3]||(a[3]=t("TresGridHelper",null,null,-1))]),_:1},16)])}}},J=b(Q,[["__scopeId","data-v-db76d741"]]),K={class:"container"},ee=["object"],g=1e3,te=.8,oe=.8,ae="#ffffff",ne={__name:"Snow",setup(S){const{onLoop:r}=A(),m=I({clearColor:"black",shadows:!0,alpha:!1}),i=new $,c=new Float32Array(g*3),l=new Float32Array(g),u=new Float32Array(g*2),n=[new w().load("/src/assets/texture/snowflake1_t.png"),new w().load("/src/assets/texture/snowflake2_t.png"),new w().load("/src/assets/texture/snowflake3_t.png"),new w().load("/src/assets/texture/snowflake4_t.png")];for(let o=0,e=g;o<e;o++){const s=Math.random()*20-10,a=Math.random()*20-10,P=Math.random()*20-10;c[o*3]=s,c[o*3+1]=a,c[o*3+2]=P,l[o]=Math.floor(Math.random()*n.length)}i.setAttribute("position",new C(c,3)),i.setAttribute("textureIndex",new C(l,1)),i.setAttribute("uv",new C(u,2));const x=new j({uniforms:{textures:{value:n},opacity:{value:oe},color:{value:new G(ae)},size:{value:te}},vertexShader:`
    attribute float textureIndex; // 纹理索引属性
    varying float vTextureIndex; // 传递到片段着色器的变量
    uniform float size; // 雪花大小的 uniform

    void main() {
      vTextureIndex = textureIndex; // 将纹理索引传递给片段着色器

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = size * (300.0 / -mvPosition.z); // 根据深度调整点的大小
    }
  `,fragmentShader:`
    uniform sampler2D textures[4]; // 传入的纹理数组
    uniform float opacity; // 透明度 uniform
    uniform vec3 color; // 颜色 uniform
    varying float vTextureIndex; // 从顶点着色器接收的纹理索引

    void main() {
      vec4 texColor;
      if (int(vTextureIndex) == 0) {
        texColor = texture2D(textures[0], gl_PointCoord);
      } else if (int(vTextureIndex) == 1) {
        texColor = texture2D(textures[1], gl_PointCoord);
      } else if (int(vTextureIndex) == 2) {
        texColor = texture2D(textures[2], gl_PointCoord);
      } else {
        texColor = texture2D(textures[3], gl_PointCoord);
      }

      texColor.rgb *= color; // 乘以 uniform 颜色，调整雪花颜色
      texColor.a *= opacity; // 调整透明度

      // 处理透明度，避免黑边
      if (texColor.a < 0.5) discard;

      gl_FragColor = texColor; // 输出最终颜色
    }
  `,transparent:!0,depthWrite:!1}),d=new V(i,x);return r(()=>{let o=d.geometry.attributes.position.array;for(var e=0;e<o.length;e+=3)o[e+3]-=.01,o[e+1]-=.01,o[e+1]<-10&&(o[e+1]=10),o[e+3]<-10&&(o[e+3]=10);d.geometry.attributes.position.needsUpdate=!0}),(o,e)=>{const s=F("TresCanvas");return p(),_("div",K,[y(s,k(T(m)),{default:L(()=>[e[0]||(e[0]=t("TresPerspectiveCamera",{position:[5,5,5],fov:45,near:.1,far:1e3,"look-at":[0,0,0]},null,-1)),y(f(z)),e[1]||(e[1]=t("TresAmbientLight",{intensity:.5},null,-1)),t("primitive",{object:f(d)},null,8,ee),e[2]||(e[2]=t("TresDirectionalLight",{position:[0,2,4],intensity:1,"cast-shadow":""},null,-1)),e[3]||(e[3]=t("TresGridHelper",null,null,-1))]),_:1},16)])}}},se=b(ne,[["__scopeId","data-v-eb1ca17a"]]),re={class:"example-list"},ie=["onClick"],le=["src"],ue={class:"show-window"},de={key:0},ce={__name:"index",setup(S){const{selectedExample:r,allExampleList:m}=E(N()),i=v(m.value.three["sprite-effect"]),c=()=>{i.value.map(l=>{l.key===r.value.key&&l.src&&window.open(l.src,"_blank")})};return(l,u)=>(p(),_("div",null,[t("div",re,[(p(!0),_(W,null,Y(i.value,n=>(p(),_("div",{class:H(["example-item",n.key===f(r).key?"selected":""]),key:n.key,onClick:x=>r.value=n},[t("img",{src:n.img},null,8,le),t("span",null,U(n.name),1)],10,ie))),128)),u[0]||(u[0]=t("p",{class:"example-desc"},"更多案例正在开发中···",-1))]),t("div",ue,[f(r).key?h("",!0):(p(),_("span",de,"选择一个示例以展示")),f(r).key==="PointFlow"?(p(),M(J,{key:1})):h("",!0),f(r).key==="Snow"?(p(),M(se,{key:2})):h("",!0),t("div",{class:"example-code-link",onClick:c},u[1]||(u[1]=[t("i",{class:"iconfont icon-code"},null,-1),t("span",null,"查看源码",-1)]))])]))}},fe=b(ce,[["__scopeId","data-v-e546e50d"]]);export{fe as default};
