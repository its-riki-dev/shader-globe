uniform sampler2D colorTexture;
uniform sampler2D alphaTexture;
uniform sampler2D otherTexture;

varying vec2 vUv;
varying float vVisible;
varying float vDist;

void main() {
  if (floor(vVisible + 0.1) == 0.0) discard;
  float alpha = 1.0 - texture2D(alphaTexture, vUv).r;
  vec3 color = texture2D(colorTexture, vUv).rgb;
  vec3 other = texture2D(otherTexture, vUv).rgb;
  float thresh = 0.04;
  if (vDist < thresh) {
    color = mix(color, other, (thresh - vDist) * 50.0);
  }
  gl_FragColor = vec4(color, alpha);
}
