import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4338ca"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <g transform="translate(256,240)" fill="white">
    <polygon points="0,-80 21,-25 80,-31 34,12 52,69 0,40 -52,69 -34,12 -80,-31 -21,-25" opacity="0.95"/>
  </g>
  <g fill="white" opacity="0.9">
    <rect x="156" y="320" width="200" height="12" rx="6"/>
    <rect x="176" y="350" width="160" height="10" rx="5"/>
    <rect x="196" y="375" width="120" height="10" rx="5"/>
  </g>
</svg>`

const iconsDir = path.resolve('public/icons')
fs.mkdirSync(iconsDir, { recursive: true })

const svgPath = path.join(iconsDir, 'icon.svg')
fs.writeFileSync(svgPath, svg)

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-maskable.png', size: 512 },
  { name: 'apple-touch-icon-180.png', size: 180 },
]

let usesSips = false
try {
  execSync('which sips', { stdio: 'ignore' })
  usesSips = true
} catch {}

if (usesSips) {
  for (const { name, size } of sizes) {
    const tmpPng = path.join(iconsDir, '_tmp.png')
    try {
      execSync(`qlmanage -t -s ${size} -o ${iconsDir} "${svgPath}" 2>/dev/null`, { stdio: 'ignore' })
      const qlOutput = path.join(iconsDir, 'icon.svg.png')
      if (fs.existsSync(qlOutput)) {
        fs.renameSync(qlOutput, path.join(iconsDir, name))
      }
    } catch {
      fs.copyFileSync(svgPath, path.join(iconsDir, name.replace('.png', '.svg')))
    }
  }
  console.log('Icons generated via qlmanage')
} else {
  console.log('No image converter found, using SVG fallback')
  for (const { name } of sizes) {
    fs.copyFileSync(svgPath, path.join(iconsDir, name.replace('.png', '.svg')))
  }
}

fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), svg)
console.log('Done')
