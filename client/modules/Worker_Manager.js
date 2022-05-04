

export class Worker_Manager {
    constructor(url) {

        const worker = new Worker(url, { type: 'module' })

        const resolves = {}

        let message_id = 0
        this.request = (cmd, data) => {
            return new Promise((resolve) => {
                worker.postMessage({ message_id: ++message_id, cmd: cmd, data: data })
                resolves[message_id] = resolve
            })
        }

        this.send = (cmd, data) => {
            worker.postMessage({ cmd: cmd, data: data })
        }

        worker.onmessage = (e) => {
            const message_id = e.data.message_id
            const cb = resolves[message_id]
            if (cb !== undefined) {
                cb(e.data.data)
                delete resolves[message_id]
            }
        }
        worker.onerror = (event) => {
            console.log(event.message, event)
        }
    }
}











