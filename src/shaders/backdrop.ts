import { noiseGLSL, oklabGLSL } from "./common";

export const backdropVertex = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

export const backdropFragment = `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform float uAspect;
uniform float uMix;
uniform int uFrom;
uniform int uTo;
uniform float uDim;
uniform float uPaint;
uniform float uVelocity;
uniform vec2 uPointer;
uniform vec3 uPal[15];

${noiseGLSL}
${oklabGLSL}

float embers(vec2 p, float t){
  float s = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float sc = 7.0 + fi * 5.0;
    vec2 g = p * sc + vec2(sin(t * 0.35 + fi) * 0.7, -t * (1.1 + fi * 0.45));
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash21(id + fi * 17.0);
    vec2 o = (vec2(hash21(id + 3.1), hash21(id + 9.7)) - 0.5) * 0.7;
    float d = length(f - o);
    s += step(0.8, h) * smoothstep(0.1, 0.0, d) * (0.55 + 0.45 * sin(t * 4.0 + h * 40.0));
  }
  return s;
}

vec3 night(vec2 p, float t){
  float glow = exp(-dot(p * vec2(0.8, 2.2), p * vec2(0.8, 2.2)) * 2.2);
  float n = fbm(p * 1.4 + t * 0.03) * 0.5 + 0.5;
  return mix(uPal[0], uPal[1], glow * n * 0.8);
}

vec3 ferrari(vec2 p, float t){
  vec2 w = vec2(fbm(p * 1.3 + vec2(0.0, -t * 0.22)), fbm(p * 1.3 + vec2(5.2, 1.3 - t * 0.18)));
  float n = fbm(p * 1.7 + w * 1.5 + vec2(0.0, -t * 0.3));
  float heat = clamp(n * 0.85 + 0.44 - p.y * 0.5, 0.0, 1.1);
  vec3 c = mix(uPal[3], uPal[4], smoothstep(0.12, 0.66, heat));
  c = mix(c, uPal[5], smoothstep(0.9, 1.08, heat) * 0.7);
  c += uPal[5] * embers(p, t) * 1.6;
  return c;
}

vec3 mercedes(vec2 p, float t){
  vec2 w = vec2(gnoise(p * 0.55 + t * 0.035), gnoise(p * 0.55 + 4.0 - t * 0.04));
  vec2 s = p * 0.62 + w * 0.7;
  float e = 0.03;
  float h = fbm(s);
  vec2 nrm = vec2(fbm(s + vec2(e, 0.0)) - h, fbm(s + vec2(0.0, e)) - h) / e;
  float reflection = p.y * 0.9 + nrm.y * 0.62 + nrm.x * 0.3;
  float band = 0.5 + 0.5 * sin(reflection * 3.4 + t * 0.1);
  float chrome = pow(band, 5.0) * 0.82 + pow(band, 1.6) * 0.1;
  vec3 c = mix(uPal[6], uPal[7], chrome);

  float cut = smoothstep(0.1, 0.0, abs(band - 0.3));
  c += uPal[8] * cut * 0.1;

  float scratch = fbm(vec2(p.x * 1.4, p.y * 26.0)) * 0.55 + fbm(p * 2.2) * 0.3 + 0.5;
  float coat = smoothstep(1.0 - uPaint * 1.25, 1.1 - uPaint * 1.25, scratch);
  coat *= step(0.001, uPaint);
  vec3 white = vec3(0.86, 0.85, 0.82) + gnoise(p * 60.0) * 0.012;
  return mix(c, white, coat);
}

vec3 mclaren(vec2 p, float t){
  float bend = fbm(vec2(p.x * 0.7 - t * 0.12, p.y * 1.1)) * 0.55;
  float y = p.y + bend;
  float sheet = smoothstep(-0.55, 0.5, -y + p.x * 0.45 + fbm(p * 1.1 + t * 0.05) * 0.5);
  vec3 c = mix(uPal[9], uPal[10], sheet);
  float rows = y * 26.0;
  float row = floor(rows);
  float line = smoothstep(0.1, 0.0, abs(fract(rows) - 0.5));
  float dash = smoothstep(0.35, 0.95, sin(p.x * (2.0 + hash21(vec2(row)) * 3.0) - t * (2.0 + hash21(vec2(row, 3.0)) * 4.0) + row));
  c = mix(c, uPal[11], line * dash * 0.75);
  return c;
}

vec3 finale(vec2 p, float t){
  vec2 w = vec2(fbm(p * 1.1 + t * 0.09), fbm(p * 1.1 + 8.0 - t * 0.07));
  float n = fbm(p * 1.0 + w * 2.0) * 1.1 + 0.5 + p.x * 0.3;
  vec3 c = mixOklab(uPal[12], uPal[13], smoothstep(0.1, 0.5, n));
  c = mixOklab(c, uPal[14], smoothstep(0.5, 0.9, n));
  return c * 0.62;
}

vec3 pattern(int i, vec2 p, float t){
  if (i == 0) return night(p, t);
  if (i == 1) return ferrari(p, t);
  if (i == 2) return mercedes(p, t);
  if (i == 3) return mclaren(p, t);
  return finale(p, t);
}

void main(){
  float t = uTime;
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.0;
  p += uPointer * 0.025;

  p.x *= 1.0 - uVelocity * 0.1;

  vec3 col;
  if (uMix < 0.001) {
    col = pattern(uFrom, p, t);
  } else {
    float swirl = sin(uMix * 3.14159);
    vec2 w = vec2(fbm(p * 0.9 + t * 0.1), fbm(p * 0.9 + 3.7 - t * 0.08));
    vec2 q = p + w * swirl * 0.75;

    vec3 a = pattern(uFrom, q, t);
    vec3 b = pattern(uTo, q - w * swirl * 0.3, t);

    float field = fbm(q * 1.15 + w * 1.2) * 0.75 + 0.5 + p.x * 0.14;
    float edge = mix(-0.55, 1.55, uMix);
    float m = smoothstep(edge - 0.3, edge + 0.3, field);

    col = mixOklab(b, a, m);

    float band = 4.0 * m * (1.0 - m);
    vec3 fused = mixOklab(a, b, 0.5);
    col += fused * band * band * 0.42;
  }

  col = mix(col, col * 0.13, uDim);

  float v = smoothstep(1.9, 0.55, length(p / vec2(max(uAspect, 1.0), 1.0)));
  col *= mix(0.62, 1.0, v);

  gl_FragColor = vec4(col, 1.0);
}
`;
