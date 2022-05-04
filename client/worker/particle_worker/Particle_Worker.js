


// acceleration
// color/opcity
// size
// angle

import { Particle_System_Worker } from './Particle_System_Worker.js'


export class Particle_Worker {

    /**
     * 
     * @param {*} position 
     * @param {*} velocity 
     * @param {*} delta_t 
     * @param {Particle_System_Worker} system_data 
     */
    constructor(
        position,
        velocity,
        time,
        delta_t,
        system_data,
    ) {

        let age = delta_t

        const base = [...position, ...velocity]

        const die = () => {
            position[0] = position[1] = position[2] = 0
            velocity[0] = velocity[1] = velocity[2] = 0
        }

        const reset = () => {
            position[0] = base[0]
            position[1] = base[1]
            position[2] = base[2]

            velocity[0] = base[3]
            velocity[1] = base[4]
            velocity[2] = base[5]
        }

        const update_position = (dt) => {
            position[0] += velocity[0] * dt
            position[1] += velocity[1] * dt
            position[2] += velocity[2] * dt
        }

        const on_start = () => { age %= 1, reset() }
        system_data.addEventListener('start', on_start)

        this.alive = false

        this.update = (dt) => {
            age += dt

            if (this.alive === false) {
                if (system_data.stop_request === false && age > 1) {
                    this.alive = true
                } else {
                    return
                }
            }

            if (age > 1) {
                if (system_data.stop_request === true) {
                    this.alive = false
                    die()
                } else {
                    reset()
                    age %= 1
                    update_position(age)
                }
            } else {
                update_position(dt)
            }
            time[0] = age
        }
    }
}









