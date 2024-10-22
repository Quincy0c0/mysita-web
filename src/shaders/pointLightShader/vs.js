// 夜景贴图顶点
const vertexShader=/*glsl*/`
void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput){
    v_normalMC=vsInput.attributes.normalMC;
}
`

export default vertexShader