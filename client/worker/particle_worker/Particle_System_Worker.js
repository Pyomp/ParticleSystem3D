

import { Event_Dispatcher } from '../../../utils/Event_Dispatcher.js'
import { Array_Tween } from '../../../utils/math/Tween.js'
import { p_default } from '../../param_default.js'
import { Particle_Worker } from './Particle_Worker.js'

export class Particle_System_Worker extends Event_Dispatcher {

    #stop_request = true
    get stop_request() { return this.#stop_request }
    set stop_request(a) {

        this.#stop_request = a
        if (this.#stop_request === true) {
            this.emit('stop')
        } else {
            this.emit('start')
        }
    }

    /** @type {[Particle_Worker]} */
    #particles = []

    /**
     * 
     * @param {Set} updates 
     * @param {number} count 
     * @param {SharedArrayBuffer} sab 
     */
    constructor(
        updates,

        data_sab,
        position_sab,
        velocity_sab,
        acceleration_sab,
        time_sab,

        p = p_default,

    ) {
        super()

        this.count = p.count || p_default.count
        this.position_base = p.position_base || p_default.position_base
        this.position_spread = p.position_spread || p_default.position_spread

        this.velocity_base = p.velocity_base || p_default.velocity_base
        this.velocity_spread = p.velocity_spread || p_default.velocity_spread

        this.acceleration_tween = new Array_Tween(p.acceleration_tween || p_default.acceleration_tween)

        const data_ui32a = new Uint32Array(data_sab)
        const position_f32a = new Float32Array(position_sab)
        const velocity_f32a = new Float32Array(velocity_sab)
        const acceleration_f32a = new Float32Array(acceleration_sab)
        const time_f32a = new Float32Array(time_sab)

        for (let i = 0; i < this.count; i++) {
            this.#particles.push(
                new Particle_Worker(
                    position_f32a.subarray(i * 3, i * 3 + 3),
                    velocity_f32a.subarray(i * 3, i * 3 + 3),
                    acceleration_f32a.subarray(i * 3, i * 3 + 3),
                    time_f32a.subarray(i, i + 1),
                    i / (this.count - 1),
                    this,
                )
            )
        }

        const update = (dt) => {

            data_ui32a[0] = Date.now()

            for (let i = 0; i < this.#particles.length; i++) {

                this.#particles[i].update(dt)

            }
        }

        let particles_stopped = 0
        const update_stop = (dt) => {
            data_ui32a[0] = Date.now()

            particles_stopped = 0

            for (let i = 0; i < this.#particles.length; i++) {

                this.#particles[i].update(dt)

                if (this.#particles[i].alive === false)

                    particles_stopped++
            }

            if (particles_stopped === this.count) {
                updates.delete(update_stop)
                if (dispose_resolve) dispose_resolve()
            }
        }

        this.start = () => {
            this.stop_request = false
            updates.delete(update_stop)
            updates.add(update)
        }

        this.stop = () => {
            this.stop_request = true
            updates.delete(update)
            updates.add(update_stop)
        }

        let dispose_resolve
        this.dispose = async () => {
            this.start = () => { }
            await new Promise((resolve) => {
                this.stop()
                this.stop = () => { }
                dispose_resolve = resolve
            })
            updates.delete(update)
            updates.delete(update_stop)
        }
    }
}









