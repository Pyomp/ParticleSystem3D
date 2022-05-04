import fs from 'fs'
import url from 'url'
import path from 'path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let jsFile = `export const baseCSS = \`\n`
const cssFile = fs.readFileSync(path.join(__dirname, 'style.css'))
jsFile += cssFile.toString()
    .replaceAll('\n', '')
    .replaceAll('\r', '')
    .replaceAll(/\/\*.*?\*\//gm, '')
    .replaceAll(/  */gm, ' ')
    .replaceAll(': ', ':')
    .replaceAll(' :', ':')
    .replaceAll('; ', ';')
    .replaceAll(' ;', ';')
    .replaceAll('} ', '}')
    .replaceAll(' }', '}')
    .replaceAll('{ ', '{')
    .replaceAll(' {', '{')

jsFile += '\n`'
fs.writeFileSync(path.join(__dirname, 'baseCSS.js'), jsFile)






