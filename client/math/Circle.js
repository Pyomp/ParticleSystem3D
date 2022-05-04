





import { Math_atan2, Math_cos } from './math_utils.js'

export class Circle {

    angle = 0
    radius = 0

    constructor(angle, radius) {
        this.angle = angle
        this.radius = radius
    }

    copy(circle) {
        this.angle = circle.angle
        this.radius = circle.radius
        return this
    }

    fromVec2(vec2) {
        this.radius = vec2.length()
        this.angle = Math_atan2(vec2.y, vec2.x)
    }
    toVec2(vec2) {
        vec2.x = Math_cos(this.angle) * this.radius
        vec2.y = Math_sin(this.angle) * this.radius
    }

    toArray() {
        return [
            this.angle,
            this.radius
        ]
    }

    fromArray(array) {
        this.angle = array[0]
        this.radius = array[1]
        return this
    }

    on_change = () => { }
    emit() {
        this.on_change()
        return this
    }
}





