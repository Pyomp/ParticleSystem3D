import fs from 'fs'
import svgo from 'svgo'

import path from 'path'
import url from 'url'
import { chdir } from 'process'
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
chdir(__dirname)


let htmlFile = `nameSVG, nameIMG, nameCANVAS<br><div style="display: flex; flex-wrap: wrap;">`
let jsFile = `
const div = document.createElement('div')
const createSVGElement = (svgStr) => {
    div.innerHTML = svgStr
    return div.firstChild
}

const svgToImg = (rawSVG, width, height) => {
    const img = new Image()
    img.width = width
    img.height = height
    img.src = "data:image/svg+xml;base64," + btoa(rawSVG)
    img.onerror = (e)=>{console.log(e)}
    return img
}

const svgToCanvas = (rawSVG, width, height) => {
    const canvas = document.createElement('canvas')
    const img = svgToImg(rawSVG, width, height)
    img.onload = () => {
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
    }
    return canvas
}
`
const rec = (path = '.') => {
    const files = fs.readdirSync(path, { withFileTypes: true })
    for (const file of files) {
        if (file.isDirectory()) {
            rec(`${path}\\${file.name}`)
        } else {
            svgComputation(path, file.name)
        }
    }
}

const svgComputation = (basePath, name) => {
    const l = name.length
    if (name.substring(l - 4) !== '.svg') return

    const buffer = fs.readFileSync(`${basePath}\\${name}`)
    let str = buffer.toString()
    str = str.replace(/\n/gm, ' ').replace(/> +</gm, '><').replace(/ +/gm, ' ')

    const nameF = name.substring(0, l - 4)

    const result = svgo.optimize(str, {
        // optional but recommended field
        path: `${basePath}\\${name}`,
        // all config fields are also available here
        multipass: true,
    })
    str = result.data

    jsFile += `
const ${nameF} = \`${str}\`
export const ${nameF}SVG = ()=>{return createSVGElement(${nameF})}
export const ${nameF}IMG = (width, height)=>{return svgToImg(${nameF}, width, height)}
export const ${nameF}CANVAS = (width, height)=>{return svgToCanvas(${nameF}, width, height)}
`
    htmlFile += `<div style="margin: 5px"><div style="text-align: center;">${nameF}</div><div style="width: 100px">${str}</div></div>`
}

rec()
fs.writeFileSync('icons.js', jsFile)
fs.writeFileSync('icons.html', htmlFile + `</div>`)
