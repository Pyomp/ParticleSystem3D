

'use strict'

import { init_server } from './route.js'
import { fileURLToPath } from 'url'



const server = init_server()
process.chdir(fileURLToPath(new URL('../', import.meta.url).href))
console.log(process.cwd())
server.listen(80, '0.0.0.0')








