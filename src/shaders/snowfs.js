const Fs = /*glsl*/ `
uniform sampler2D colorTexture;
varying vec2 v_textureCoordinates;
uniform float snowSpeed;
uniform float snowSize;
void main() {
    // resolution是shaderToy中内置变量,czm_viewport.zw
    // 可以考虑，通过修改时间速度的方式，修改降雪速度
    float iTime = (czm_frameNumber / 120.)*snowSpeed;
    float snow = 0.0;
    vec2 iResolution = czm_viewport.zw;
    float gradient = (1.0 - float(gl_FragCoord.y / iResolution.x)) * 0.4;
    float random = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    for(int k = 0; k < 6; k++) {
        for(int i = 0; i < 12; i++) {
            float cellSize = 2.0 + (float(i) * 3.0);
            float downSpeed = 0.3 + (sin(iTime * 0.4 + float(k + i * 20)) + 1.0) * 0.00008;
            vec2 uv = (gl_FragCoord.xy / iResolution.x) + vec2(0.01 * sin((iTime + float(k * 6185)) * 0.6 + float(i)) * (5.0 / float(i)), downSpeed * (iTime + float(k * 1352)) * (1.0 / float(i)));
            // 可以将uv画布做一个重复，原理和backgroundRepeat一样，可以实现设置降雪大小
            uv*=snowSize;
            vec2 uvStep = (ceil((uv) * cellSize - vec2(0.5, 0.5)) / cellSize);
            float x = fract(sin(dot(uvStep.xy, vec2(12.9898 + float(k) * 12.0, 78.233 + float(k) * 315.156))) * 43758.5453 + float(k) * 12.0) - 0.5;
            float y = fract(sin(dot(uvStep.xy, vec2(62.2364 + float(k) * 23.0, 94.674 + float(k) * 95.0))) * 62159.8432 + float(k) * 12.0) - 0.5;

            float randomMagnitude1 = sin(iTime * 2.5) * 0.7 / cellSize;
            float randomMagnitude2 = cos(iTime * 2.5) * 0.7 / cellSize;

            float d = 5.0 * distance((uvStep.xy + vec2(x * sin(y), y) * randomMagnitude1 + vec2(y, x) * randomMagnitude2), uv.xy);

            float omiVal = fract(sin(dot(uvStep.xy, vec2(32.4691, 94.615))) * 31572.1684);
            if(omiVal < 0.08 ? true : false) {
                float newd = (x + 1.0) * 0.4 * clamp(1.9 - d * (15.0 + (x * 6.3)) * (cellSize / 1.4), 0.0, 1.0);
                /*snow += d<(0.08+(x*0.3))/(cellSize/1.4)?
                    newd
                    :newd;*/
                snow += newd;
            }
        }
    }

    vec4 snowCol = vec4(snow) + gradient * vec4(0.4, 0.8, 1.0, 0.0) + random * 0.01;
    vec4 col = texture2D(colorTexture, v_textureCoordinates);

    gl_FragColor = mix(col,snowCol,0.6);
}`;

export default Fs;
