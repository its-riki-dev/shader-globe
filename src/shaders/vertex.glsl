uniform float size;
uniform sampler2D elevTexture;
uniform vec2 mouseUV;

varying vec2 vUv;
varying float vVisible;
varying float vDist;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float elv = texture2D(elevTexture, vUv).r;
  vec3 vNormal = normalMatrix * normal;
  vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormal)));
  mvPosition.z += 0.35 * elv;

  float dist = distance(mouseUV, vUv);
  float zDisp = 0.0;
  float thresh = 0.04;
  if (dist < thresh) {
    zDisp = (thresh - dist) * 10.0;
  }
  vDist = dist;
  mvPosition.z += zDisp;

  gl_PointSize = size;
  gl_Position = projectionMatrix * mvPosition;
}
