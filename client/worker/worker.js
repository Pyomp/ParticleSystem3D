import { WORKER_CMD_PARTICLE, WORKER_INSTANCE_CONTROL } from './constants.js'
import { Particle_System_Worker } from './particle_worker/Particle_System_Worker.js'

const instances = {}
let id = 0

const updates = new Set()
const dispatcher = {
    [WORKER_CMD_PARTICLE]: (data) => {
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

setInterval(() => {
    for (const f of updates) f(.1)
}, 100)




