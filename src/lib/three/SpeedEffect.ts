import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import { Uniform } from "three";

const fragment = `
uniform float uAmount;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
  if (uAmount < 0.002) {
    outputColor = inputColor;
    return;
  }
  vec2 c = uv - 0.5;
  float reach = uAmount * smoothstep(0.08, 0.72, length(c));
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 10; i++) {
    float f = float(i) / 9.0;
    vec2 o = c * reach * f * 0.2;
    acc.r += texture2D(inputBuffer, uv - o * 1.35).r;
    acc.g += texture2D(inputBuffer, uv - o).g;
    acc.b += texture2D(inputBuffer, uv - o * 0.65).b;
  }
  outputColor = vec4(acc / 10.0, inputColor.a);
}
`;

export class SpeedEffect extends Effect {
  constructor() {
    super("SpeedEffect", fragment, {
      blendFunction: BlendFunction.NORMAL,
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map([["uAmount", new Uniform(0)]]),
    });
  }

  set amount(value: number) {
    this.uniforms.get("uAmount")!.value = value;
  }
}
