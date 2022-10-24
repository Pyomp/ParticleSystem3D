import { WORKER_CMD_NEW_PARTICLE_SYSTEM, WORKER_INSTANCE_CONTROL } from './constants.js'
import { Particle_System_Worker } from './particle_worker/Particle_System_Worker.js'

const FREQUENCY = 10
const DT_S = 1 / FREQUENCY
const DT_MS = DT_S * 1000

const instances = {}
let id = 0

const updates = new Set()
const dispatcher = {
    [WORKER_CMD_NEW_PARTICLE_SYSTEM]: (data) => {
        const system = new Particle_System_Worker(
            updates,

            data.data_sab,
            data.position_sab,
            data.velocity_sab,

            data.time_sab,


            data.p,
        )
        instances[id++] = system
        return id - 1
    },
    [WORKER_INSTANCE_CONTROL]: (data) => {
        return instances[data.id][data.prop](data.param)
    },
}

onmessage = (e) => {
    const data = e.data
    const callback = dispatcher[data.cmd]
    if (callback !== undefined) {
        if (data.message_id !== undefined)
            postMessage({ message_id: data.message_id, data: callback(data.data) })
        else
            callback(data.data)
    }
}

// loop
let last = performance.now()

setInterval(() => {
    const now = performance.now()
    const dt = Math.min(now - last, .1)
    last = now

    for (const f of updates) f(dt)

}, DT_MS)
