"use client";

import { useEffect, useRef } from "react";
import { onIdle, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Domain-warped simplex noise, tinted in brand colours, with a soft pointer glow.
const FRAGMENT = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    f += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.04;

  vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, t)), fbm(p * 1.2 + vec2(5.2, -t)));
  vec2 r = vec2(
    fbm(p * 1.05 + 2.0 * q + vec2(1.7, 9.2) + t * 0.7),
    fbm(p * 1.05 + 2.0 * q + vec2(8.3, 2.8) - t * 0.5)
  );
  float f = fbm(p * 1.15 + 2.1 * r) * 0.5 + 0.5;

  vec2 center = vec2(aspect * 0.8, 0.78);
  float mask = smoothstep(1.35, 0.05, length((p - center) * vec2(0.8, 1.0)));

  vec2 mp = vec2(u_mouse.x * aspect, u_mouse.y);
  float glow = smoothstep(0.6, 0.0, length(p - mp));

  vec3 ink = vec3(0.024, 0.024, 0.03);
  vec3 plum = vec3(0.22, 0.09, 0.28);
  vec3 ember = vec3(1.0, 0.353, 0.122);
  vec3 amber = vec3(1.0, 0.66, 0.42);

  vec3 col = ink;
  col = mix(col, plum, smoothstep(0.3, 0.75, f) * mask * 0.75);
  col = mix(col, ember * 0.8, smoothstep(0.5, 0.95, f + length(r) * 0.22) * mask * 0.9);
  col = mix(col, amber, smoothstep(0.78, 1.1, f + length(q) * 0.25) * mask * 0.45);
  col += ember * glow * 0.12;
  col *= 0.35 + 0.65 * smoothstep(0.0, 0.6, uv.y);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Initialises WebGL and the render loop; returns a cleanup function. */
function start(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return () => {};

  // Skip software renderers (no GPU): they would burn CPU for a decorative effect.
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return () => {};
  }

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return () => {};
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "u_res");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uMouse = gl.getUniformLocation(program, "u_mouse");

  const SCALE = 0.33;
  const resize = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
    const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let mx = 0.72;
  let my = 0.7;
  let tmx = mx;
  let tmy = my;
  const onPointer = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    tmx = (e.clientX - rect.left) / rect.width;
    tmy = 1 - (e.clientY - rect.top) / rect.height;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const reduced = prefersReducedMotion();
  const t0 = performance.now() - 20000;
  const FRAME = 1000 / 30;
  let raf = 0;
  let last = 0;
  let visible = true;
  let firstFrame = true;

  const draw = (now: number) => {
    if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(draw);
    if (!firstFrame && now - last < FRAME) return;
    last = now;
    mx += (tmx - mx) * 0.08;
    my += (tmy - my) * 0.08;
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform2f(uMouse, mx, my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (firstFrame) {
      firstFrame = false;
      canvas.dataset.ready = "true";
    }
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(draw);
  });
  io.observe(canvas);

  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && visible) raf = requestAnimationFrame(draw);
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

/**
 * Lightweight WebGL aurora for the hero (no 3D library). Renders at low
 * resolution for a soft look and minimal GPU cost; pauses off screen.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    // Desktop only: phones get the static CSS glow, which saves battery and CPU.
    const capable =
      window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches &&
      !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!capable) return;

    let teardown = () => {};
    const cancelIdle = onIdle(() => {
      teardown = start(canvas);
    }, 2000);

    return () => {
      cancelIdle();
      teardown();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn(
        "h-full w-full opacity-0 transition-opacity duration-[1600ms] data-[ready=true]:opacity-100",
        className,
      )}
    />
  );
}
