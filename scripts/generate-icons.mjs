import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { createAvatar } from '@dicebear/core'
import { thumbs } from '@dicebear/collection'

const avatar = createAvatar(thumbs, {
  seed: 'Rank our Favorites',
  size: 512,
  backgroundColor: ['10B981'],
  backgroundType: ['solid'],
})

const avatarSvg = avatar.toString()

const innerSvg = avatarSvg.replace(/<\/?svg[^>]*>/g, '')

const svgWithPadding = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
  <rect width="640" height="640" rx="128" fill="#10B981"/>
  <g transform="translate(70, 70) scale(5)">
    ${innerSvg}
  </g>
</svg>`

const iconsDir = path.resolve('public/icons')
fs.mkdirSync(iconsDir, { recursive: true })

const svgPath = path.join(iconsDir, 'icon.svg')
fs.writeFileSync(svgPath, svgWithPadding)

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

fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), svgWithPadding)
console.log('Done')
