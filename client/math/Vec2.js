






export class Vec2 {
    x = 0
    y = 0

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    copy(vec2) {
        this.x = vec2.x
        this.y = vec2.y
        return this
    }

    set(x, y) {
        this.x = x
        this.y = y
        return this
    }

    lengthSq() {
        return this.x ** 2 + this.y ** 2
    }

    length() {
        return this.lengthSq() ** 0.5
    }

    divideScalar(scalar) {
        this.x /= scalar
        this.y /= scalar
        return this
    }

    toArray() {
        return [
            this.x,
            this.y
        ]
    }

    fromArray(array) {
        this.x = array[0]
        this.y = array[1]
        return this
    }

    on_change = () => { }
    emit() {
        this.on_change()
        return this
    }
}





