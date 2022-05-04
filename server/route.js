
import { readFile } from 'fs'
import { extname } from 'path'
import { totalmem, freemem } from 'os'

import { createServer } from 'http'

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
}
const cacheFile = {}
const max_mem_allowed = totalmem() / 2

export const http_POST_dispatcher = {}
export const http_GET_dispatcher = {}

export const init_server = () => {
    return createServer((req, res) => {
        if (req.method === 'GET') {
            const [filePath] = ('.' + req.url).split('?', 1)
            if (filePath.includes('..')) return
            const cb = http_GET_dispatcher[filePath]
            if (cb) {
                cb(req, res)
            } else {
                const extension = String(extname(filePath)).toLowerCase()
                const contentType = mimeTypes[extension] || 'application/octet-stream'

                readFile(filePath, (error, content) => {
                    if (error !== null) {
                        res.writeHead(404).end('404')
                    } else {
                        res.writeHead(200, {
                            'Content-Type': contentType,
                            'Cross-Origin-Opener-Policy': 'same-origin',
                            'Cross-Origin-Embedder-Policy': 'require-corp',
                        })
                        res.end(content, 'utf-8')
                    }
                })
            }
        } else if (req.method === 'POST') {
            const cb = http_POST_dispatcher[req.url]
            if (cb) {
                cb(req, res)
            } else {
                res.writeHead(404).end('404')
            }
        }
    })
}

const getBodyStr = (req) => {
    return new Promise((resolve) => {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk.toString()
        })
        req.on('end', () => {
            resolve(body)
        })
    })
}
