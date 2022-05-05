


// acceleration
// color/opcity
// size
// angle

import { Particle_System_Worker } from './Particle_System_Worker.js'


export class Particle_Worker {

    /**
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

        const die = () => {
            position[0] = position[1] = position[2] = 0
            velocity[0] = velocity[1] = velocity[2] = 0
        }

        const acceleration = [0, 0, 0]

        const reset = () => {

            const acc_base = system_data.acceleration_tween.get_value(0)

            acceleration[0] = acc_base[0]
            acceleration[1] = acc_base[1]
            acceleration[2] = acc_base[2]

            position[0] = system_data.position_base.x +
                system_data.position_spread.x * (Math.random() - .5)
            position[1] = system_data.position_base.y +
                system_data.position_spread.y * (Math.random() - .5)
            position[2] = system_data.position_base.z +
                system_data.position_spread.z * (Math.random() - .5)


            velocity[0] = system_data.velocity_base.x +
                system_data.velocity_spread.x * (Math.random() - .5)
            velocity[1] = system_data.velocity_base.y +
                system_data.velocity_spread.y * (Math.random() - .5)
            velocity[2] = system_data.velocity_base.z +
                system_data.velocity_spread.z * (Math.random() - .5)

        }
        reset()

        const update_position = (dt) => {

            system_data.acceleration_tween.get_value(age, acceleration)

            velocity[0] += acceleration[0] * dt
            velocity[1] += acceleration[1] * dt
            velocity[2] += acceleration[2] * dt

            position[0] += velocity[0] * dt
            position[1] += velocity[1] * dt
            position[2] += velocity[2] * dt
        }

        const on_start = () => {
            if (age > 1) {
                age %= 1
                reset()
            }
        }
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









