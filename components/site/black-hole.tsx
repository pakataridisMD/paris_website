'use client';

import { useEffect, useRef } from 'react';

/* A ray-traced black hole in the style of Interstellar's Gargantua: light
   rays are bent around the hole (Schwarzschild geodesics, units where the
   event horizon has radius 1), so the far side of the accretion disk shows
   above and below the shadow. Background stars are lensed the same way. */
const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uDist;
uniform float uTilt;
uniform float uShift;
uniform float uExposure;
uniform float uFade;

const float DISK_IN = 3.0;
const float DISK_OUT = 13.0;

float hash3(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise3(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash3(i), hash3(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash3(i + vec3(0.0, 1.0, 0.0)), hash3(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash3(i + vec3(0.0, 0.0, 1.0)), hash3(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash3(i + vec3(0.0, 1.0, 1.0)), hash3(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

vec3 sky(vec3 d) {
  vec3 c = vec3(0.0);
  vec3 p = d * 110.0;
  vec3 id = floor(p);
  float h = hash3(id);
  if (h > 0.972) {
    vec3 f = fract(p) - 0.5;
    c += smoothstep(0.22, 0.0, length(f)) * (h - 0.972) * 36.0 * mix(vec3(1.0, 0.86, 0.66), vec3(0.82, 0.9, 1.0), hash3(id + 3.7));
  }
  p = d * 260.0;
  id = floor(p);
  h = hash3(id);
  if (h > 0.985) {
    vec3 f = fract(p) - 0.5;
    c += smoothstep(0.25, 0.0, length(f)) * 0.5 * vec3(1.0, 0.95, 0.9);
  }
  c += vec3(0.05, 0.035, 0.025) * pow(noise3(d * 2.5 + 4.0), 4.0) * 2.0;
  return c;
}

// Accretion disk: hot white-gold near the inner edge, amber further out,
// streaked by differential (Keplerian) rotation.
vec4 disk(vec3 q, float rq, vec3 v) {
  float x = (rq - DISK_IN) / (DISK_OUT - DISK_IN);
  float a = atan(q.z, q.x) + uTime * 2.4 * pow(DISK_IN / rq, 1.5);
  vec3 np = vec3(cos(a) * 1.6, sin(a) * 1.6, rq * 2.6);
  float n = noise3(np) * 0.65 + noise3(np * vec3(2.0, 2.0, 3.3) + 11.0) * 0.35;
  float edge = smoothstep(0.0, 0.05, x) * (1.0 - smoothstep(0.45, 1.0, x));
  float I = edge * (0.15 + 1.5 * n * n) * 1.25 / (0.22 + 4.5 * x);
  vec3 c = mix(vec3(1.0, 0.94, 0.82), vec3(1.0, 0.6, 0.26), smoothstep(0.0, 0.6, x));
  vec3 orbit = normalize(vec3(-q.z, 0.0, q.x));
  float dop = 1.0 + 0.3 * dot(orbit, -normalize(v));
  return vec4(c * I * dop, clamp(I * 1.2, 0.0, 1.0) * edge);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.y, uRes.x / 1.2) - vec2(0.0, uShift);
  vec3 cam = vec3(0.0, sin(uTilt), -cos(uTilt)) * uDist;
  vec3 fw = normalize(-cam);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 v = normalize(fw * 1.7 + rt * uv.x + up * uv.y);
  vec3 p = cam;
  vec3 hv = cross(p, v);
  float h2 = dot(hv, hv);

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float glow = 0.0;
  bool captured = false;

  for (int i = 0; i < 260; i++) {
    float r2 = dot(p, p);
    float r = sqrt(r2);
    if (r < 1.0) { captured = true; break; }
    if (r > uDist + 6.0 && dot(p, v) > 0.0) break;
    float dt = clamp(0.055 * r, 0.012, 2.0);
    v += -1.5 * h2 * p / (r2 * r2 * r) * dt;
    vec3 pn = p + v * dt;
    if (p.y * pn.y < 0.0) {
      vec3 q = mix(p, pn, p.y / (p.y - pn.y));
      float rq = length(q.xz);
      if (rq > DISK_IN && rq < DISK_OUT) {
        vec4 d = disk(q, rq, v);
        col += (1.0 - alpha) * d.rgb;
        alpha += (1.0 - alpha) * d.a;
      }
    }
    glow += exp(-(r - 1.5) * (r - 1.5) * 90.0) * dt;
    p = pn;
    if (alpha > 0.98) break;
  }
  // Only rays that escape carry the photon-ring glow and the starlight.
  if (!captured) col += (1.0 - alpha) * (sky(normalize(v)) + vec3(1.0, 0.8, 0.55) * glow * 0.12);
  col = 1.0 - exp(-col * uExposure);
  gl_FragColor = vec4(col * uFade, 1.0);
}`;

const VERTEX = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/* Camera path over the scene (t from 0 to 1): drop out of light speed near
   the hole, drift closer while the disk turns, then an ever faster fall with
   the camera arcing up until the shadow swallows the whole view. */
function camera(t: number) {
  const dist =
    t < 0.1 ? 70 - 36 * easeOut(t / 0.1)
    : t < 0.6 ? 34 - 12 * ((t - 0.1) / 0.5)
    : t < 0.93 ? 22 - 21 * Math.pow((t - 0.6) / 0.33, 2.6)
    : 0.9;
  const plunge = Math.min(1, Math.max(0, (t - 0.6) / 0.33));
  const tilt = 0.2 - 0.12 * Math.min(1, t / 0.6) + 0.55 * Math.pow(plunge, 1.6);
  const exposure = 1.25 + 0.9 * Math.max(0, 1 - dist / 8);
  return { dist, tilt, exposure, fade: Math.min(1, t / 0.05) };
}

export function BlackHole({ ms, playing }: { ms: number; playing: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const host = hostRef.current;
    const bloomCanvas = bloomRef.current;
    const bloom = bloomCanvas?.getContext('2d');
    if (!host || !bloomCanvas || !bloom) return;
    // A fresh canvas per mount: a canvas keeps its (possibly lost) context.
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 h-full w-full';
    host.appendChild(canvas);
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    // Without WebGL, nothing covers the still frame beneath.
    const fail = () => {
      canvas.remove();
      bloomCanvas.style.display = 'none';
    };
    if (!gl) return fail();

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (vs && fs && program) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
    }
    if (!vs || !fs || !program || !gl.getProgramParameter(program, gl.LINK_STATUS)) return fail();
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const attr = gl.getAttribLocation(program, 'a');
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      res: uniform('uRes'),
      time: uniform('uTime'),
      dist: uniform('uDist'),
      tilt: uniform('uTilt'),
      shift: uniform('uShift'),
      exposure: uniform('uExposure'),
      fade: uniform('uFade'),
    };

    // Render at a fixed pixel budget (upscaled by the browser; the glow hides
    // it) and lower it if the device struggles.
    let budget = 600_000;
    let shift = 0.06;
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const scale = Math.min(1, Math.sqrt(budget / Math.max(1, w * h)));
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      bloomCanvas.width = Math.max(1, Math.round(w / 10));
      bloomCanvas.height = Math.max(1, Math.round(h / 10));
      gl.viewport(0, 0, canvas.width, canvas.height);
      // Landscape: just above centre. Portrait: high, clear of the title.
      shift = w >= h ? 0.06 : (0.16 * h) / Math.min(h, w / 1.2);
    };
    resize();
    window.addEventListener('resize', resize);

    let elapsed = 0;
    let last = performance.now();
    let slow = 0;
    let raf = 0;
    const frame = (now: number) => {
      const dt = now - last;
      last = now;
      if (playingRef.current) {
        // Real time (capped after a stall), so the path stays in step with the film.
        elapsed += Math.min(dt, 250) / 1000;
        const c = camera(Math.min(1, elapsed / (ms / 1000)));
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform1f(u.time, elapsed);
        gl.uniform1f(u.dist, c.dist);
        gl.uniform1f(u.tilt, c.tilt);
        gl.uniform1f(u.shift, shift);
        gl.uniform1f(u.exposure, c.exposure);
        gl.uniform1f(u.fade, c.fade);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        bloom.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
        bloom.drawImage(canvas, 0, 0, bloomCanvas.width, bloomCanvas.height);
        slow = dt > 34 ? slow + 1 : Math.max(0, slow - 1);
        if (slow > 12 && budget > 150_000) {
          budget *= 0.7;
          slow = 0;
          resize();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [ms]);

  return (
    <>
      <div ref={hostRef} aria-hidden='true' className='absolute inset-0' />
      <canvas
        ref={bloomRef}
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 h-full w-full opacity-60 mix-blend-screen blur-2xl'
      />
    </>
  );
}
