/**
 * Procedural Texture Generator
 * Creates crisp, high-resolution procedural textures with zero 404 dependencies.
 */
import * as THREE from 'three';

export function createGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base lush rural Ontario green
  ctx.fillStyle = '#3a6629';
  ctx.fillRect(0, 0, 512, 512);

  // Organic foliage variation & clover speckling
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 3 + 1;
    const shades = ['#2f5421', '#477c32', '#528d3a', '#435f29', '#2b441c'];
    ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle blades/streaks
  ctx.strokeStyle = '#5a9640';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() * 4 - 2), y - (Math.random() * 6 + 2));
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(40, 40);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createRoadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Asphalt base
  ctx.fillStyle = '#2b2d30';
  ctx.fillRect(0, 0, 512, 1024);

  // Aggregate grain
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 1024;
    const shade = Math.random() > 0.5 ? '#36393d' : '#1f2022';
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, 2, 2);
  }

  // Outer white edge lines
  ctx.fillStyle = '#e8eaed';
  ctx.fillRect(40, 0, 12, 1024);
  ctx.fillRect(512 - 52, 0, 12, 1024);

  // Center double yellow dashed lines (Ontario rural highway style)
  ctx.fillStyle = '#f5b018';
  const dashLength = 120;
  const dashGap = 80;
  for (let y = 0; y < 1024; y += dashLength + dashGap) {
    ctx.fillRect(250, y, 8, dashLength);
    ctx.fillRect(264, y, 8, dashLength);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 20);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWoodPlankTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rustic pine siding base
  ctx.fillStyle = '#7a5839';
  ctx.fillRect(0, 0, 512, 512);

  const plankHeight = 64;
  for (let y = 0; y < 512; y += plankHeight) {
    // Plank seam
    ctx.fillStyle = '#452e18';
    ctx.fillRect(0, y, 512, 4);

    // Wood grain lines
    ctx.fillStyle = Math.random() > 0.5 ? '#8f6844' : '#6b4c30';
    ctx.fillRect(0, y + 4, 512, plankHeight - 4);

    for (let k = 0; k < 60; k++) {
      ctx.strokeStyle = '#5a3d21';
      ctx.lineWidth = 1;
      const grainY = y + Math.random() * plankHeight;
      ctx.beginPath();
      ctx.moveTo(0, grainY);
      ctx.bezierCurveTo(
        150, grainY + (Math.random() * 8 - 4),
        350, grainY + (Math.random() * 8 - 4),
        512, grainY
      );
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createSignTexture(text: string, sub: string, bgColor = '#185a2d'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Ontario Highway Sign Green/White border
  ctx.fillStyle = bgColor;
  ctx.roundRect(10, 10, 492, 236, 16);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.roundRect(18, 18, 476, 220, 12);
  ctx.stroke();

  // Primary text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 105);

  // Subtext
  ctx.font = '600 24px sans-serif';
  ctx.fillStyle = '#d4e8d4';
  ctx.fillText(sub, 256, 165);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createMailboxTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#22252a';
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('42 OLD HWY 2', 128, 55);

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#f5a623';
  ctx.fillText('H. VENTURES', 128, 90);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
