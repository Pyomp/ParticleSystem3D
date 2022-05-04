










import { cbH } from '../modules/utils.js'
import { DT_PHYSICS } from '../constants.js'


export class Loop_Manager {
    frame_updates = new Set()
    updates_physics = new Set()
    now = 0
    dt_physics_raf = 0

    constructor() {
        this.frame_update = (dt) => {
            this.now += dt
            this.dt_physics_raf += dt

            while (this.dt_physics_raf > DT_PHYSICS) {
                this.dt_physics_raf -= DT_PHYSICS
                cbH(this.updates_physics)
            }

            for (const f of this.frame_updates)
                if (f(dt) === true)
                    this.frame_updates.delete(f)
        }
    }
}





